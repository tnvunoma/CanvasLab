import { create } from 'zustand';
import { canvasApi } from '../api/endpoints';

export const useCanvasStore = create((set, get) => ({
  // State
  canvases: [],
  currentCanvas: null,
  loading: false,
  error: null,
  hasChanges: false,
  lastSaved: null,

  // Actions
  setCanvases: (canvases) => set({ canvases }),
  
  setCurrentCanvas: (canvas) => set({ 
    currentCanvas: canvas, 
    hasChanges: false,
    lastSaved: canvas ? new Date() : null
  }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  setHasChanges: (hasChanges) => set({ hasChanges }),

  // Fetch all canvases
  fetchCanvases: async () => {
    set({ loading: true, error: null });
    try {
      const response = await canvasApi.getCanvases();
      set({ canvases: response.data.canvases, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Fetch single canvas
  fetchCanvas: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await canvasApi.getCanvas(id);
      set({ 
        currentCanvas: response.data.canvas, 
        loading: false,
        hasChanges: false,
        lastSaved: new Date()
      });
      return response.data.canvas;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Create new canvas
  createCanvas: async (title = 'Untitled Canvas') => {
    set({ loading: true, error: null });
    try {
      const response = await canvasApi.createCanvas(title);
      const newCanvas = response.data.canvas;
      set((state) => ({
        canvases: [newCanvas, ...state.canvases],
        currentCanvas: newCanvas,
        loading: false,
        hasChanges: false,
        lastSaved: new Date()
      }));
      return newCanvas;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update canvas
  updateCanvas: async (id, updates) => {
    try {
      const response = await canvasApi.updateCanvas(id, updates);
      const updatedCanvas = response.data.canvas;
      
      set((state) => ({
        canvases: state.canvases.map(c => c._id === id ? updatedCanvas : c),
        currentCanvas: state.currentCanvas?._id === id ? updatedCanvas : state.currentCanvas,
        hasChanges: false,
        lastSaved: new Date()
      }));
      
      return updatedCanvas;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Delete canvas
  deleteCanvas: async (id) => {
    set({ loading: true, error: null });
    try {
      await canvasApi.deleteCanvas(id);
      set((state) => ({
        canvases: state.canvases.filter(c => c._id !== id),
        currentCanvas: state.currentCanvas?._id === id ? null : state.currentCanvas,
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  // Update current canvas locally (triggers autosave)
  updateCurrentCanvasLocally: (updates) => {
    set((state) => ({
      currentCanvas: state.currentCanvas ? { ...state.currentCanvas, ...updates } : null,
      hasChanges: true
    }));
  },

  // Clear current canvas
  clearCurrentCanvas: () => set({ 
    currentCanvas: null, 
    hasChanges: false,
    lastSaved: null
  })
}));