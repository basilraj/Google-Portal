
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  updateCredentials: (currentPass: string, newUser: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false);
  const [username, setUsername] = useLocalStorage<string>('adminUser', 'admin');
  const [password, setPassword] = useLocalStorage<string>('adminPass', 'password');

  const login = (user: string, pass: string): boolean => {
    if (user === username && pass === password) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const updateCredentials = (currentPass: string, newUser: string, newPass: string): boolean => {
    if (currentPass !== password) {
      return false;
    }
    setUsername(newUser);
    setPassword(newPass);
    return true;
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
