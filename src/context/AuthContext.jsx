import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    try {
      const session = authService.getCurrentSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (err) {
      console.error('Failed to restore auth session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRegister = useCallback(
    async (profileData) => {
      try {
        const newUser = await authService.registerUser(profileData);
        showToast('Account created successfully! Please sign in to continue.', 'success');
        return newUser;
      } catch (err) {
        showToast(err.message || 'Registration failed.', 'error');
        throw err;
      }
    },
    [showToast]
  );

  const handleLogin = useCallback(
    async (email, password, rememberMe = true) => {
      try {
        const session = await authService.loginUser(email, password, rememberMe);
        setUser(session.user);
        setToken(session.token);
        showToast(`Welcome back, ${session.user.fullName}!`, 'success');
        return session.user;
      } catch (err) {
        showToast(err.message || 'Login failed. Please check your credentials.', 'error');
        throw err;
      }
    },
    [showToast]
  );

  const handleLogout = useCallback(() => {
    authService.logoutUser();
    setUser(null);
    setToken(null);
    showToast('You have been signed out.', 'info');
  }, [showToast]);

  const handleUpdateProfile = useCallback(
    (partialProfile) => {
      const updated = authService.updateUserProfile(partialProfile);
      if (updated) {
        setUser(updated);
        showToast('Profile information updated.', 'success');
      }
      return updated;
    },
    [showToast]
  );

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user),
    isLoading,
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
