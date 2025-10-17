import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for testing purposes
 * In production, this should be part of the login process
 */
export const generateTestToken = (userId = '507f1f77bcf86cd799439011') => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  
  const payload = {
    id: userId,
    email: 'test@example.com',
    role: 'user',
  };

  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  return jwt.verify(token, secret);
};
