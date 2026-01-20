import express from 'express';
import { body } from 'express-validator';
import { AuthController } from '../api/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('username').trim().isLength({ min: 3, max: 30 }),
    body('password').isLength({ min: 8 }),
    validate
  ],
  AuthController.register
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate
  ],
  AuthController.login
);

router.post('/refresh', AuthController.refresh);

router.post('/logout', AuthController.logout);

router.get('/me', authenticate, AuthController.me);

export default router;