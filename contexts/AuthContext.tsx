import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { AdminCredentials } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateCredentials: (currentPassword: string, newUsername: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultAdminCredentials: AdminCredentials = {
  username: 'admin',
  password: 'password123',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [credentials, setCredentials] = useLocalStorage<AdminCredentials>('admin-credentials', defaultAdminCredentials);

  // Check login status on initial load from sessionStorage
  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
        setIsLoggedIn(true);
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    if (username === credentials.username && password === credentials.password) {
      setIsLoggedIn(true);
      sessionStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('isLoggedIn');
  };

  const updateCredentials = (currentPassword: string, newUsername: string, newPass: string): boolean => {
    if (currentPassword === credentials.password) {
      setCredentials({ username: newUsername, password: newPass });
      return true;
    }
    return false;
  };

  const value = { isLoggedIn, login, logout, updateCredentials };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
