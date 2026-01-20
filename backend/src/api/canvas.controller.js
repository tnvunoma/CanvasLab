import { CanvasService } from '../services/CanvasService.js';
import { ResponseUtil } from '../utils/response.util.js';

export class CanvasController {
  static async createCanvas(req, res, next) {
    try {
      const { title } = req.body;
      const canvas = await CanvasService.createCanvas(req.userId, title);
      
      return ResponseUtil.success(res, { canvas }, 'Canvas created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  static async getCanvases(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 100;
      const skip = parseInt(req.query.skip) || 0;
      
      const result = await CanvasService.getUserCanvases(req.userId, limit, skip);
      
      return ResponseUtil.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getCanvas(req, res, next) {
    try {
      const { id } = req.params;
      const canvas = await CanvasService.getCanvasByIdAndOwner(id, req.userId);
      
      return ResponseUtil.success(res, { canvas });
    } catch (error) {
      next(error);
    }
  }

  static async updateCanvas(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const canvas = await CanvasService.updateCanvas(id, req.userId, updates);
      
      return ResponseUtil.success(res, { canvas }, 'Canvas updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteCanvas(req, res, next) {
    try {
      const { id } = req.params;
      await CanvasService.deleteCanvas(id, req.userId);
      
      return ResponseUtil.success(res, null, 'Canvas deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}