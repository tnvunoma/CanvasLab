import { UserService } from './UserService.js';
import { TokenService } from './TokenService.js';
import { JwtUtil } from '../utils/jwt.util.js';

export class AuthService {
  static async register(email, username, password) {
    const user = await UserService.createUser(email, username, password);
    const accessToken = JwtUtil.generateAccessToken(user._id);
    const refreshToken = await TokenService.createRefreshToken(user._id);

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  static async login(email, password) {
    const user = await UserService.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await UserService.verifyPassword(user, password);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const accessToken = JwtUtil.generateAccessToken(user._id);
    const refreshToken = await TokenService.createRefreshToken(user._id);

    return {
      user,
      accessToken,
      refreshToken
    };
  }

  static async refreshAccessToken(refreshToken) {
    const tokenRecord = await TokenService.findRefreshToken(refreshToken);
    
    if (!tokenRecord) {
      throw new Error('Invalid refresh token');
    }

    const decoded = JwtUtil.verifyRefreshToken(refreshToken);
    
    if (!decoded) {
      throw new Error('Invalid refresh token');
    }

    const accessToken = JwtUtil.generateAccessToken(decoded.userId);
    
    // Optional: Rotate refresh token for added security
    // const newRefreshToken = await TokenService.rotateRefreshToken(refreshToken);
    
    return {
      accessToken
      // refreshToken: newRefreshToken
    };
  }

  static async logout(refreshToken) {
    if (refreshToken) {
      await TokenService.revokeRefreshToken(refreshToken);
    }
  }

  static async logoutAll(userId) {
    await TokenService.revokeAllUserTokens(userId);
  }
}