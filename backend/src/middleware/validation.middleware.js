import { validationResult } from 'express-validator';
import { ResponseUtil } from '../utils/response.util.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return ResponseUtil.validationError(res, errors.array());
  }
  
  next();
};