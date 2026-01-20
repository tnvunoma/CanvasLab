import express from 'express';
import { body, param } from 'express-validator';
import { CanvasController } from '../api/canvas.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';

const router = express.Router();

// All canvas routes require authentication
router.use(authenticate);

// Create canvas
router.post('/',
  [
    body('title').optional().trim().isLength({ min: 1, max: 100 }),
    validate
  ],
  CanvasController.createCanvas
);

// Get all user's canvases
router.get('/', CanvasController.getCanvases);

// Get specific canvas
router.get('/:id',
  [
    param('id').isMongoId(),
    validate
  ],
  CanvasController.getCanvas
);

// Update canvas
router.patch('/:id',
  [
    param('id').isMongoId(),
    body('title').optional().trim().isLength({ min: 1, max: 100 }),
    body('blocks').optional().isArray(),
    body('connections').optional().isArray(),
    body('visibility').optional().isIn(['private', 'public']),
    validate
  ],
  CanvasController.updateCanvas
);

// Delete canvas
router.delete('/:id',
  [
    param('id').isMongoId(),
    validate
  ],
  CanvasController.deleteCanvas
);

export default router;