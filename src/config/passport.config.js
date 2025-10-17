import passport from 'passport';
import pkg from 'passport-google-oauth20';
const GoogleStrategy = pkg.Strategy || pkg;
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { sendPendingLinkEmail } from '../utils/email.util.js';

// helper to generate JWT (used by controller as well)
export const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    authProvider: user.authProvider,
    tokenVersion: user.tokenVersion || 0 
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// --- ENV validation (fail fast, DO NOT log secrets) ---
const requiredEnvs = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'JWT_SECRET'];
for (const k of requiredEnvs) {
  if (!process.env[k] && process.env.NODE_ENV !== 'test') {
    throw new Error(`Missing required environment variable: ${k}. Add it to your environment (do not commit to git).`);
  }
}

// JWT secret strength check
const jwtSecret = process.env.JWT_SECRET || '';
if (process.env.NODE_ENV !== 'test') {
  // require at least 32 bytes (64 hex chars) for HMAC secrets
  if (typeof jwtSecret !== 'string' || jwtSecret.length < 64) {
    const genCmd = `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`;
    throw new Error(`Weak or missing JWT_SECRET. Use a strong random secret (for example run: ${genCmd}) and set it in environment variables.`);
  }
  // optional: ensure it's not a default placeholder
  if (/replace_|your_|changeme/i.test(jwtSecret)) {
    throw new Error('JWT_SECRET appears to be a placeholder. Replace it with a secure random value.');
  }
}


// NOTE: enable passReqToCallback so controller can verify state cookie if needed
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback',
  passReqToCallback: true,
  state: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const email = profile?.emails?.[0]?.value;
    const emailVerified = !!profile?.emails?.[0]?.verified;
    const googleId = profile?.id;
    if (!email) return done(new Error('Google profile has no email'), null);

    // 1) if a user already linked to this googleId -> return it
    let user = await User.findOne({ googleId });
    if (user) return done(null, user);

    // 2) if an account exists with same email but no googleId -> create pending link
    const existing = await User.findOne({ email });
    if (existing) {
      // require Google-provided email to be verified
      if (!emailVerified) {
        return done(null, false, { message: 'google_email_not_verified' });
      }

      // create pending link token and send verification email
      const token = await User.createPendingGoogleLink(existing._id, googleId);
      // send email (may fallback to console if SMTP not configured)
      try {
        await sendPendingLinkEmail(existing.email, token);
      } catch (emailErr) {
        console.error('Failed to send pending link email:', emailErr);
        // continue — do not leak token; inform the caller via info message
      }

      // inform controller to respond with friendly message
      return done(null, false, { message: 'pending_link_sent' });
    }

    // 3) no existing account -> create new user linked to googleId
    const data = {
      googleId,
      email,
      name: profile.displayName || '',
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      profilePicture: profile.photos?.[0]?.value || '',
      authProvider: 'google'
    };
    user = await User.create(data);
    return done(null, user);
  } catch (error) {
    // log full error server-side (stack) but don't expose details to callers
    console.error('Google OAuth error (strategy):', error?.stack || error);
    return done(new Error('Authentication processing error'), null);
  }
}));

// leave default passport export only
export default passport;
