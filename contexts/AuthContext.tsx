import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types.ts';

type AuthStage = 'loading' | 'signup' | 'login' | 'loggedIn' | 'forgotPassword' | 'resetPassword';

interface AuthContextType {
  isLoggedIn: boolean;
  isDemoUser: boolean;
  authStage: AuthStage;
  userEmail: string | null;
  createAdmin: (user: Omit<User, 'id' | 'passwordHash'> & { password: string }) => Promise<boolean>;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemo: () => void;
  logout: () => void;
  updateCredentials: (currentPassword: string, newUsername: string, newPassword: string) => Promise<boolean>;
  goToForgotPassword: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  backToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ username: string; email: string; isDemo: boolean } | null>(null);
  const [authStage, setAuthStage] = useState<AuthStage>('loading');

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth', { method: 'GET' });
      const data = await res.json();
      
      if (data.isLoggedIn) {
        setUser({ username: data.user.username, email: data.user.email, isDemo: data.user.isDemo });
        setAuthStage('loggedIn');
      } else {
        setAuthStage(data.adminExists ? 'login' : 'signup');
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setAuthStage('login'); // Fallback to login
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const createAdmin = async (userData: Omit<User, 'id' | 'passwordHash'> & { password: string }): Promise<boolean> => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', ...userData }),
    });
    if (res.ok) {
      setAuthStage('login');
      return true;
    }
    return false;
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
     const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password, isDemo: false }),
    });
    const data = await res.json();
    if (res.ok) {
      setUser({ username: data.user.username, email: data.user.email, isDemo: false });
      setAuthStage('loggedIn');
      return { success: true };
    }
    return { success: false, message: data.message };
  };

  const loginAsDemo = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', isDemo: true }),
    });
    if (res.ok) {
      const data = await res.json();
      setUser({ username: data.user.username, email: data.user.email, isDemo: true });
      setAuthStage('loggedIn');
    }
  };

  const logout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setUser(null);
    setAuthStage('login');
  };
  
  const updateCredentials = async (currentPassword: string, newUsername: string, newPassword: string): Promise<boolean> => {
    const res = await fetch('/api/auth', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_credentials', currentPassword, newUsername, newPassword }),
    });

    if (res.ok) {
        const data = await res.json();
        setUser(prev => prev ? { ...prev, username: data.user.username } : null);
        return true;
    }
    return false;
  };

  // Password reset logic remains largely conceptual as SMTP isn't implemented.
  const goToForgotPassword = () => setAuthStage('forgotPassword');
  const backToLogin = () => setAuthStage('login');

  const requestPasswordReset = async (email: string): Promise<boolean> => {
     const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request_password_reset', email }),
    });
    if (res.ok) {
        setAuthStage('resetPassword');
        return true;
    }
    return false;
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    const res = await fetch('/api/auth', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_password', newPassword }),
    });
    if (res.ok) {
        setAuthStage('login');
        return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
        isLoggedIn: authStage === 'loggedIn', 
        isDemoUser: user?.isDemo ?? false,
        authStage,
        userEmail: user?.email || null,
        createAdmin,
        login, 
        loginAsDemo,
        logout, 
        updateCredentials,
        goToForgotPassword,
        requestPasswordReset,
        resetPassword,
        backToLogin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
