import { Canvas } from '../models/Canvas.model.js';

const MAX_CANVASES_PER_USER = 50;

export class CanvasService {
  static async createCanvas(ownerId, title = 'Untitled Canvas') {
    // Check canvas limit
    const count = await Canvas.countDocuments({ ownerId });
    if (count >= MAX_CANVASES_PER_USER) {
      throw new Error(`Canvas limit reached. Maximum ${MAX_CANVASES_PER_USER} canvases per user.`);
    }

    const canvas = new Canvas({
      ownerId,
      title,
      blocks: [],
      connections: []
    });

    await canvas.save();
    return canvas;
  }

  static async getCanvasByIdAndOwner(canvasId, ownerId) {
    const canvas = await Canvas.findOne({ _id: canvasId, ownerId });
    if (!canvas) {
      throw new Error('Canvas not found');
    }
    return canvas;
  }

  static async getUserCanvases(ownerId, limit = 100, skip = 0) {
    const canvases = await Canvas.find({ ownerId })
      .sort({ lastEdited: -1 })
      .limit(limit)
      .skip(skip)
      .select('title lastEdited createdAt blocks connections');
    
    const total = await Canvas.countDocuments({ ownerId });
    
    return { canvases, total, remaining: MAX_CANVASES_PER_USER - total };
  }

  static async updateCanvas(canvasId, ownerId, updates) {
    const canvas = await this.getCanvasByIdAndOwner(canvasId, ownerId);
    
    // Only allow updating specific fields
    const allowedUpdates = ['title', 'blocks', 'connections', 'visibility'];
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        canvas[key] = updates[key];
      }
    });

    canvas.lastEdited = new Date();
    await canvas.save();
    return canvas;
  }

  static async deleteCanvas(canvasId, ownerId) {
    const canvas = await this.getCanvasByIdAndOwner(canvasId, ownerId);
    await Canvas.deleteOne({ _id: canvasId });
    return canvas;
  }

  static async getCanvasCount(ownerId) {
    return await Canvas.countDocuments({ ownerId });
  }
}