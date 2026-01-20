import { ResponseUtil } from '../utils/response.util.js';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return ResponseUtil.validationError(res, errors);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return ResponseUtil.error(res, `${field} already exists`, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ResponseUtil.unauthorized(res, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    return ResponseUtil.unauthorized(res, 'Token expired');
  }

  // Default error
  return ResponseUtil.error(
    res,
    err.message || 'Internal server error',
    err.statusCode || 500
  );
};