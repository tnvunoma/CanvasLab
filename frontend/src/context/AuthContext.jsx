import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/endpoints';
import { storage } from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeAuth = useCallback(async () => {
    const token = storage.getAccessToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.getMe();
      setUser(response.data.user);
    } catch (err) {
      storage.removeAccessToken();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const register = async (email, username, password) => {
    setError(null);
    try {
      const response = await authApi.register(email, username, password);
      storage.setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const response = await authApi.login(email, password);
      storage.setAccessToken(response.data.accessToken);
      setUser(response.data.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      storage.removeAccessToken();
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};