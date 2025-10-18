import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const login = (user: string, pass: string) => {
    if (user === 'admin' && pass === 'sarkari2025') {
      setIsLoggedIn(true);
      // On successful login, redirect to the admin dashboard
      window.history.pushState({}, '', '/admin');
      // Dispatch a popstate event to make the App component re-route
      window.dispatchEvent(new PopStateEvent('popstate'));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    // On logout, redirect to the admin login page
    window.location.pathname = '/admin';
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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