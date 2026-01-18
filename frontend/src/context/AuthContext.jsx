import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('tasks/'); 
        if (res.status === 200) {
          // Session is valid
        }
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setUser(null);
          localStorage.removeItem('user');
        }
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [user]);

  const login = (username) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const logout = async () => {
    try {
      await api.post('accounts/logout/');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
