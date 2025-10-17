import jwt from 'jsonwebtoken';
import HttpException from '../utils/exceptions/http.exception.js';
import User from '../models/user.model.js';

/**
 * JWT Authentication Middleware
 * Verifies JWT token, checks tokenVersion and user state, sets req.user
 */
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.header('Authorization') || '';
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return next(new HttpException(401, 'Access token is required'));
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('Missing JWT_SECRET');
      return next(new HttpException(500, 'Server misconfiguration'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new HttpException(401, 'Token expired. Please login again.'));
      }
      return next(new HttpException(403, 'Invalid or malformed token'));
    }

    // decoded must include userId and tokenVersion
    const userId = decoded.userId || decoded.id || decoded.sub;
    if (!userId) {
      return next(new HttpException(403, 'Invalid token payload'));
    }

    const user = await User.findById(userId).select('isActive tokenVersion').lean();
    if (!user || !user.isActive) {
      return next(new HttpException(401, 'Invalid token: user not found or inactive'));
    }

    const tokenVersion = decoded.tokenVersion || 0;
    if ((user.tokenVersion || 0) !== tokenVersion) {
      return next(new HttpException(401, 'Token revoked. Please login again.'));
    }

    req.user = decoded;
    return next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return next(new HttpException(500, 'Authentication error'));
  }
};

/**
 * Optional Authentication Middleware
 * Sets req.user if token is present, but doesn't require it
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.header('Authorization') || '';
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      req.user = null;
      return next();
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, secret);
      const userId = decoded.userId || decoded.id || decoded.sub;
      if (!userId) {
        req.user = null;
        return next();
      }
      const user = await User.findById(userId).select('isActive tokenVersion').lean();
      if (!user || !user.isActive) {
        req.user = null;
        return next();
      }
      if ((user.tokenVersion || 0) !== (decoded.tokenVersion || 0)) {
        req.user = null;
        return next();
      }
      req.user = decoded;
    } catch {
      // invalid or expired token -> treat as unauthenticated
      req.user = null;
    }
    return next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    req.user = null;
    return next();
  }
};

export { authenticateToken, optionalAuth };
