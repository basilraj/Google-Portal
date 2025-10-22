import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.ts';
import { User } from '../types.ts';
import { useData } from './DataContext.tsx';

type AuthStage = 'signup' | 'login' | 'loggedIn' | 'forgotPassword' | 'resetPassword';

interface AuthContextType {
  isLoggedIn: boolean;
  isDemoUser: boolean;
  authStage: AuthStage;
  userEmail: string | null;
  createAdmin: (user: Omit<User, 'passwordHash'> & { password: string }) => Promise<boolean>;
  login: (username: string, password: string) => Promise<boolean>;
  loginAsDemo: () => void;
  logout: () => void;
  updateCredentials: (currentPassword: string, newUsername: string, newPassword: string) => Promise<boolean>;
  goToForgotPassword: () => void;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  backToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A simple (and insecure) hashing function for demonstration.
// In a real app, use a library like bcrypt.
const simpleHash = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        const char = s.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash.toString();
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addActivityLog, smtpSettings } = useData();
  const [user, setUser] = useLocalStorage<User | null>('admin-user', null);
  const [sessionLoggedIn, setSessionLoggedIn] = useLocalStorage('session-is-logged-in', false);
  const [isDemoUser, setIsDemoUser] = useLocalStorage('is-demo-user', false);
  const [authStage, setAuthStage] = useState<AuthStage>('login');

  useEffect(() => {
    if (sessionLoggedIn) {
      setAuthStage('loggedIn');
    } else if (!user) {
      setAuthStage('signup');
    } else if (authStage !== 'forgotPassword' && authStage !== 'resetPassword') {
      setAuthStage('login');
    }
  }, [user, sessionLoggedIn, authStage]);

  const createAdmin = async (userData: Omit<User, 'passwordHash'> & { password: string }): Promise<boolean> => {
    const newUser: User = {
        username: userData.username,
        email: userData.email,
        passwordHash: simpleHash(userData.password),
    };
    setUser(newUser);
    await addActivityLog('Admin Account Created', `New admin account created for user: ${newUser.username}`);
    setAuthStage('login');
    return true;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    if (user && username === user.username && simpleHash(password) === user.passwordHash) {
      setIsDemoUser(false);
      setSessionLoggedIn(true);
      setAuthStage('loggedIn');
      await addActivityLog('Admin Login', `User '${user?.username}' logged in successfully.`);
      return true;
    }
    return false;
  };

  const loginAsDemo = () => {
    setIsDemoUser(true);
    setSessionLoggedIn(true);
    setAuthStage('loggedIn');
    addActivityLog('Demo Login', 'Demo user logged in.');
  };

  const logout = () => {
    addActivityLog(isDemoUser ? 'Demo Logout' : 'Admin Logout', `User '${isDemoUser ? 'demo' : user?.username}' logged out.`);
    setSessionLoggedIn(false);
    setIsDemoUser(false);
    setAuthStage('login');
  };

  const updateCredentials = async (currentPassword: string, newUsername: string, newPassword: string): Promise<boolean> => {
    if (user && simpleHash(currentPassword) === user.passwordHash) {
      const updatedUser = { ...user, username: newUsername, passwordHash: simpleHash(newPassword) };
      setUser(updatedUser);
      await addActivityLog('Credentials Updated', `Admin credentials updated for user: ${newUsername}`);
      return true;
    }
    return false;
  };

  const goToForgotPassword = () => {
    setAuthStage('forgotPassword');
  };
  
  const backToLogin = () => {
    setAuthStage('login');
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    if (user && email === user.email) {
      if (smtpSettings.configured) {
        alert(`SMTP is configured. In a real-world application, a password reset link would be sent to ${user.email}.`);
      } else {
        alert(`SMTP not configured. Please configure it in Settings for a production environment. For this demo, we will proceed directly to the password reset step.`);
      }
      setAuthStage('resetPassword');
      return true;
    }
    return false;
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    if (user) {
      const updatedUser = { ...user, passwordHash: simpleHash(newPassword) };
      setUser(updatedUser);
      await addActivityLog('Password Reset', `Admin password was reset for user: ${user.username}`);
      setAuthStage('login');
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider value={{ 
        isLoggedIn: authStage === 'loggedIn', 
        isDemoUser,
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