import { RefreshToken } from '../models/RefreshToken.model.js';
import { JwtUtil } from '../utils/jwt.util.js';

export class TokenService {
  static async createRefreshToken(userId) {
    const token = JwtUtil.generateRefreshToken(userId);
    const expiresAt = new Date(Date.now() + JwtUtil.getRefreshTokenExpiry());

    await RefreshToken.create({
      userId,
      tokenHash: token,
      expiresAt
    });

    return token;
  }

  static async findRefreshToken(token) {
    return await RefreshToken.findOne({
      tokenHash: token,
      revoked: false,
      expiresAt: { $gt: new Date() }
    });
  }

  static async revokeRefreshToken(token) {
    await RefreshToken.updateOne(
      { tokenHash: token },
      { revoked: true }
    );
  }

  static async revokeAllUserTokens(userId) {
    await RefreshToken.updateMany(
      { userId, revoked: false },
      { revoked: true }
    );
  }

  static async cleanupExpiredTokens() {
    await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() }
    });
  }

  static async rotateRefreshToken(oldToken) {
    // Revoke old token
    await this.revokeRefreshToken(oldToken);

    // Verify and get userId from old token
    const decoded = JwtUtil.verifyRefreshToken(oldToken);
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    // Create new token
    return await this.createRefreshToken(decoded.userId);
  }
}