import { JwtUtil } from '../utils/jwt.util.js';
import { UserService } from '../services/UserService.js';
import { ResponseUtil } from '../utils/response.util.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ResponseUtil.unauthorized(res, 'No token provided');
    }

    const token = authHeader.substring(7);
    const decoded = JwtUtil.verifyAccessToken(token);

    if (!decoded) {
      return ResponseUtil.unauthorized(res, 'Invalid or expired token');
    }

    const user = await UserService.findById(decoded.userId);
    
    if (!user) {
      return ResponseUtil.unauthorized(res, 'User not found');
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    return ResponseUtil.error(res, 'Authentication failed', 401);
  }
};

export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return ResponseUtil.unauthorized(res);
    }

    if (!roles.includes(req.user.role)) {
      return ResponseUtil.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};