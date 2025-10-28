import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET is required in production');
}
if (!JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set — using fallback dev secret. Do not use in production.');
}

const DEFAULT_SECRET = JWT_SECRET || 'your-secret-key';
const DEFAULT_ALGO = 'HS256';

/**
 * Generate a JWT for any payload.
 * @param {Object} payload - minimal user payload (id, email, role, etc.)
 * @param {Object} [options] - jwt.sign options (expiresIn, audience, subject, etc.)
 * @returns {string} token
 */
export const generateToken = (payload = {}, options = {}) => {
  const signOpts = {
    algorithm: DEFAULT_ALGO,
    expiresIn: options.expiresIn || '24h',
    ...options,
  };
  return jwt.sign(payload, DEFAULT_SECRET, signOpts);
};

/**
 * Convenience / backwards-compatible test token generator.
 * @param {string} userId
 * @returns {string}
 */
export const generateTestToken = (userId = '507f1f77bcf86cd799439011') => {
  const payload = {
    id: userId,
    email: 'test@example.com',
    role: 'user',
  };
  return generateToken(payload, { expiresIn: '24h' });
};

/**
 * Verify token and return decoded payload.
 * Throws on invalid/expired token (let error middleware handle it).
 * @param {string} token
 * @returns {Object} decoded payload
 */
export const verifyToken = (token) => {
  return jwt.verify(token, DEFAULT_SECRET, { algorithms: [DEFAULT_ALGO] });
};

/**
 * Safe verify: returns decoded payload or null if invalid/expired.
 * @param {string} token
 * @returns {Object|null}
 */
export const safeVerifyToken = (token) => {
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
};
