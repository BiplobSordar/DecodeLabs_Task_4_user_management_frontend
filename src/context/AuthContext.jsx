import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // ✅ Add ref to track login in progress
  const loginInProgress = React.useRef(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
      console.count("CHECK AUTH");
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    // ✅ Prevent multiple login attempts
    if (loginInProgress.current) {
      console.log('⚠️ Login already in progress');
      return { success: false, error: 'Login already in progress' };
    }

    loginInProgress.current = true;

    try {
      const response = await api.post('/auth/login', { username, password });
      const userData = response.data.data.user;
      
      setUser(userData);
      setIsAuthenticated(true);
      loginInProgress.current = false;
      
      return { success: true, user: userData };
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      loginInProgress.current = false;
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const user = response.data.data.user;
      
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        if (Array.isArray(errors)) {
          errorMessage = errors.join(', ');
        } else if (typeof errors === 'object') {
          errorMessage = Object.values(errors).flat().join(', ');
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};