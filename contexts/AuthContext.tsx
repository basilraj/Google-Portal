import React, { createContext, useState, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password_provided: string) => boolean;
  logout: () => void;
  updateCredentials: (currentPassword_provided: string, newUsername_provided: string, newPassword_provided: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false);
  const [username, setUsername] = useLocalStorage<string>('adminUsername', 'admin');
  const [password, setPassword] = useLocalStorage<string>('adminPassword', 'password');

  const login = (username_provided: string, password_provided: string): boolean => {
    if (username_provided === username && password_provided === password) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateCredentials = (currentPassword_provided: string, newUsername_provided: string, newPassword_provided: string): boolean => {
    if (currentPassword_provided === password) {
      setUsername(newUsername_provided);
      setPassword(newPassword_provided);
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, updateCredentials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
