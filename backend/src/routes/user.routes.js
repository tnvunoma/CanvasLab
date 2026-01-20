import express from 'express';
import { body } from 'express-validator';
import { UserController } from '../api/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', UserController.getProfile);

router.patch('/profile',
  [
    body('username').optional().trim().isLength({ min: 3, max: 30 }),
    validate
  ],
  UserController.updateProfile
);

router.delete('/account', UserController.deleteAccount);

export default router;