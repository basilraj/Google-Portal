
import React, { createContext, useContext, useState, useRef } from 'react';
import { authService } from '../services/database';
import { AdminCredentials } from '../types';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  updateCredentials: (currentPass: string, newUser: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const credentialsRef = useRef<AdminCredentials>(authService.getCredentials());

  const login = (user: string, pass: string) => {
    const storedCreds = credentialsRef.current;
    if (user === storedCreds.username && pass === storedCreds.password) {
      setIsLoggedIn(true);
      // On successful login, redirect to the admin dashboard
      window.history.pushState({}, '', `/admin`);
      // Dispatch a popstate event to make the App component re-route
      window.dispatchEvent(new PopStateEvent('popstate'));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    // On logout, redirect to the admin login page
    window.location.href = `/admin`;
  };
  
  const updateCredentials = (currentPass: string, newUser: string, newPass: string): boolean => {
    const storedCreds = credentialsRef.current;
    if (currentPass !== storedCreds.password) {
        return false; // Incorrect current password
    }

    const newCredentials = {
        username: newUser,
        password: newPass
    };

    authService.saveCredentials(newCredentials);
    credentialsRef.current = newCredentials;
    return true;
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