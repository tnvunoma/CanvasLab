import { AuthService } from '../services/AuthService.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { email, username, password } = req.body;
      
      const result = await AuthService.register(email, username, password);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return ResponseUtil.success(res, {
        user: result.user,
        accessToken: result.accessToken
      }, 'User registered successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.login(email, password);

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ResponseUtil.success(res, {
        user: result.user,
        accessToken: result.accessToken
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return ResponseUtil.unauthorized(res, 'No refresh token provided');
      }

      const result = await AuthService.refreshAccessToken(refreshToken);

      return ResponseUtil.success(res, {
        accessToken: result.accessToken
      }, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      await AuthService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return ResponseUtil.success(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      return ResponseUtil.success(res, { user: req.user });
    } catch (error) {
      next(error);
    }
  }
}