import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api.js';
import { connectSocket, disconnectSocket } from '../lib/socket.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkAuth();
    // Connect socket even without auth (for viewing posts)
    connectSocket();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.getMe();
        if (response.success) {
          setUser(response.user);
          connectSocket(token);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (data) => {
    try {
      const response = await authAPI.login(data);
      if (response.success) {
        setUser(response.user);
        connectSocket(response.token);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || { message: 'Login failed' },
      };
    }
  };

  const signup = async (data) => {
    try {
      const response = await authAPI.signup(data);
      if (response.success) {
        setUser(response.user);
        connectSocket(response.token);
        return { success: true };
      }
      return { success: false, error: response.error };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || { message: 'Signup failed' },
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      disconnectSocket();
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

