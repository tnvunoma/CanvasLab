import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export class JwtUtil {
  static generateAccessToken(userId) {
    return jwt.sign(
      { userId, type: 'access' },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRY }
    );
  }

  static generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRY }
    );
  }

  static verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      return null;
    }
  }

  static getRefreshTokenExpiry() {
    const expiry = env.JWT_REFRESH_EXPIRY;
    const match = expiry.match(/(\d+)([dhm])/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days
    
    const [, value, unit] = match;
    const multipliers = { d: 24 * 60 * 60 * 1000, h: 60 * 60 * 1000, m: 60 * 1000 };
    return parseInt(value) * multipliers[unit];
  }
}