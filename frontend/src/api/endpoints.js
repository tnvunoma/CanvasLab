import { apiClient } from './apiClient';

export const authApi = {
  register: (email, username, password) =>
    apiClient.post('/auth/register', { email, username, password }),
  
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  refresh: () =>
    apiClient.post('/auth/refresh'),
  
  getMe: () =>
    apiClient.get('/auth/me')
};

export const userApi = {
  getProfile: () =>
    apiClient.get('/users/profile'),
  
  updateProfile: (data) =>
    apiClient.patch('/users/profile', data),
  
  deleteAccount: () =>
    apiClient.delete('/users/account')
};

export const canvasApi = {
  getCanvases: () =>
    apiClient.get('/canvases'),
  
  getCanvas: (id) =>
    apiClient.get(`/canvases/${id}`),
  
  createCanvas: (title) =>
    apiClient.post('/canvases', { title }),
  
  updateCanvas: (id, data) =>
    apiClient.patch(`/canvases/${id}`, data),
  
  deleteCanvas: (id) =>
    apiClient.delete(`/canvases/${id}`)
};