import passport from '../config/passport.config.js';
import User from '../models/user.model.js';
import { generateToken } from '../config/passport.config.js';
import crypto from 'crypto';

// Redirect to Google OAuth (generates a per-request state stored in an httpOnly cookie)
export const googleAuth = (req, res, next) => {
  const state = crypto.randomBytes(16).toString('hex');
  res.cookie('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 5 * 60 * 1000 // 5 minutes
  });

  const authOptions = {
    scope: ['profile', 'email'],
    session: false,
    state,
    prompt: 'consent',
    accessType: 'offline'
  };
  return passport.authenticate('google', authOptions)(req, res, next);
};

// Handle Google OAuth callback (validate state cookie, then issue token)
export const googleCallback = (req, res, next) => {
  try {
    const stateCookie = req.cookies?.oauth_state;
    const stateQuery = req.query?.state;

    if (stateCookie && stateQuery !== stateCookie) {
      res.clearCookie('oauth_state');
      return res.status(403).json({ success: false, message: 'Invalid OAuth state' });
    }
    res.clearCookie('oauth_state');

    passport.authenticate('google', { session: false }, async (err, user, info) => {
      if (err) {
        console.error('Google OAuth error (callback):', err?.stack || err);
        return res.status(500).json({ success: false, message: 'Authentication failed' });
      }

      if (!user) {
        if (info) console.info('Google OAuth info:', info);
        return res.status(401).json({ success: false, message: 'Authentication failed' });
      }

      try {
        await user.updateLastLogin?.();
        const token = generateToken(user);

        const frontend = process.env.FRONTEND_URL;
        if (frontend) {
          if (process.env.SEND_TOKEN_COOKIE === 'true') {
            res.cookie('token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60 * 1000
            });
            return res.redirect(`${frontend}/auth/success`);
          }
          return res.redirect(`${frontend}/auth/success#token=${token}`);
        }

        return res.json({
          success: true,
          message: 'Authentication successful',
          token,
          user: user.toPublic(true)
        });
      } catch (error) {
        console.error('Post-auth processing error:', error?.stack || error);
        return res.status(500).json({ success: false, message: 'Failed to process authenticated user' });
      }
    })(req, res, next);
  } catch (err) {
    console.error('OAuth callback error:', err?.stack || err);
    return res.status(500).json({ success: false, message: 'OAuth callback error' });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: user.toPublic(true) });
  } catch (error) {
    console.error('Get profile error:', error?.stack || error);
    return res.status(500).json({ success: false, message: 'Failed to get user profile' });
  }
};

// Logout (invalidate tokens for this user by bumping tokenVersion)
export const logout = async (req, res) => {
  try {
    await User.incrementTokenVersion(req.user.userId);
    if (process.env.SEND_TOKEN_COOKIE === 'true') {
      res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
    }
    return res.json({ success: true, message: 'Logout successful. Tokens invalidated on server.' });
  } catch (error) {
    console.error('Logout error:', error?.stack || error);
    return res.status(500).json({ success: false, message: 'Failed to logout' });
  }
};

// Refresh token: issue a new JWT if the authenticated user's tokenVersion matches current
export const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const token = generateToken(user);
    return res.json({ success: true, message: 'Token refreshed successfully', token });
  } catch (error) {
    console.error('Refresh token error:', error?.stack || error);
    return res.status(500).json({ success: false, message: 'Failed to refresh token' });
  }
};

export const login = (req,res,next)=>{
  passport.authenticate('local',{session: false}, async(err,user,info)=>{
    if(err){
      return res.status(500).json({message: info?.message || "Server side error"});
    }
    if(!user && info?.message === "Invalid credentials"){
      return res.status(401).json({message: info?.message});
    }
    else if(!user){
      return res.status(404).json({message: info?.message || "User not found"});
    }

    const userDetails = await User.findById(user._id);
    const {email, firstName, lastName,name} = userDetails;
    const token = generateToken(userDetails);

      return res.status(200).json({
        message: info?.message,
        user: {
          email,
          firstName,
          lastName,
          name,
        },
        token: token
      });
    }  )(req,res,next);
};

export const signUp = async (req, res, next) => {
  let { email, name, firstName, lastName, password, authProvider } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!email) missingFields.push('email');
  if (!name) missingFields.push('name');
  if (!password) missingFields.push('password');

  // If firstName/lastName not provided, try to split name
  if (!firstName || !lastName) {
    if (name && name.trim().includes(' ')) {
      const nameParts = name.trim().split(/\s+/);
      if (!firstName) firstName = nameParts[0];
      if (!lastName) lastName = nameParts.slice(1).join(' ');
    } else {
      // Use name as both firstName and lastName if no space
      if (!firstName) firstName = name || '';
      if (!lastName) lastName = name || '';
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: 'Required fields are missing',
      missingFields,
    });
  }

  try{

    const user = await User.findOne({
      $or: [{email},{name}]
    });

    if (user) {
      return res.status(400).json({
        message:
          user.email === email
            ? 'User with this email already exists'
            : 'Username already taken',
      });
    }
    
    // Whitelist only allowed fields to prevent mass assignment
    const allowedFields = {
      email,
      name,
      firstName,
      lastName,
      password,
      authProvider: authProvider || 'local' // default to 'local' if not provided
    };

    const newUser = await User.create(allowedFields);

    // Generate token for immediate login
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User signed up successfully",
      token,
      userDetail: {
        userName: name,
        email: email,
        firstName: firstName,
        lastName: lastName
      }
    });
  } catch (err) {
    console.error('Signup error:', err);

    if(err.name === "ValidationError"){
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        name: err.name,
        message: "Validation Failed",
        errors,
      });
    }

    if (err.message && err.message.includes('Password must be')) {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      error: err.message,
      message: "Internal server error during signup"});
  }
}