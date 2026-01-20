import mongoose from 'mongoose';

const blockSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['TextBlock', 'Frame', 'Connector', 'Checklist', 'Table', 'Schedule', 'Kanban', 'Habit']
  },
  x: {
    type: Number,
    required: true,
    default: 0
  },
  y: {
    type: Number,
    required: true,
    default: 0
  },
  width: {
    type: Number,
    required: true,
    default: 200
  },
  height: {
    type: Number,
    required: true,
    default: 100
  },
  style: {
    type: Object,
    default: {}
  },
  data: {
    type: Object,
    default: {}
  }
}, { _id: false });

const connectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  fromBlockId: {
    type: String,
    required: true
  },
  toBlockId: {
    type: String,
    required: true
  },
  style: {
    type: Object,
    default: {}
  }
}, { _id: false });

const canvasSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: 'Untitled Canvas'
  },
  blocks: {
    type: [blockSchema],
    default: []
  },
  connections: {
    type: [connectionSchema],
    default: []
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  lastEdited: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
canvasSchema.index({ ownerId: 1, lastEdited: -1 });

// Update lastEdited on save
canvasSchema.pre('save', function(next) {
  this.lastEdited = new Date();
  next();
});

export const Canvas = mongoose.model('Canvas', canvasSchema);