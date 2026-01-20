import { UserService } from '../services/UserService.js';
import { ResponseUtil } from '../utils/response.util.js';

export class UserController {
  static async getProfile(req, res, next) {
    try {
      const user = await UserService.findById(req.userId);
      return ResponseUtil.success(res, { user });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { username } = req.body;
      const user = await UserService.updateUser(req.userId, { username });
      return ResponseUtil.success(res, { user }, 'Profile updated');
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req, res, next) {
    try {
      await UserService.deleteUser(req.userId);
      res.clearCookie('refreshToken');
      return ResponseUtil.success(res, null, 'Account deleted');
    } catch (error) {
      next(error);
    }
  }
}