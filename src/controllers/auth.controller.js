import passport from '../config/passport.config.js';
import User from '../models/user.model.js';
import { generateToken } from '../config/passport.config.js';

// Redirect to Google OAuth
export const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Handle Google OAuth callback
export const googleCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.status(500).json({
        success: false,
        message: 'Authentication failed',
        error: err.message
      });
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Return success response with token and user info
    res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        lastLogin: user.lastLogin
      }
    });
  })(req, res, next);
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        authProvider: user.authProvider,
        isActive: user.isActive,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};

// Logout (invalidate token on client side)
export const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.'
  });
};

// Refresh token
export const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Generate new token
    const token = generateToken(user);
    
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message
    });
  }
};
