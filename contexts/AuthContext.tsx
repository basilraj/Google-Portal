import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.ts';
import { User } from '../types.ts';
import { useData } from './DataContext.tsx';

type AuthStage = 'signup' | 'login' | 'otp' | 'loggedIn';

interface AuthContextType {
  isLoggedIn: boolean;
  authStage: AuthStage;
  userEmail: string | null;
  createAdmin: (user: Omit<User, 'passwordHash'> & { password: string }) => Promise<boolean>;
  login: (username: string, password: string) => Promise<boolean>;
  verifyOtp: (otp: string) => boolean;
  logout: () => void;
  cancelOtp: () => void;
  updateCredentials: (currentPassword: string, newUsername: string, newPassword: string) => Promise<boolean>;
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
  const [authStage, setAuthStage] = useState<AuthStage>('login');
  const [storedOtp, setStoredOtp] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoggedIn) {
      setAuthStage('loggedIn');
    } else if (!user) {
      setAuthStage('signup');
    } else {
      setAuthStage('login');
    }
  }, [user, sessionLoggedIn]);

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
      // Simulate sending OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setStoredOtp(otp);
      
      // In a real app, you would send this via email. For this demo, we'll alert it with context.
      if (smtpSettings.configured) {
        alert(`SMTP is configured. In a real-world application, an email would be sent to ${user.email}.\n\nYour OTP is: ${otp}`);
      } else {
        alert(`SMTP not configured. Please configure it in Settings for a production environment.\n\nYour OTP is: ${otp}`);
      }
      
      setAuthStage('otp');
      return true;
    }
    return false;
  };

  const verifyOtp = (otp: string): boolean => {
    if (otp === storedOtp) {
      setSessionLoggedIn(true);
      setAuthStage('loggedIn');
      setStoredOtp(null);
      addActivityLog('Admin Login', `User '${user?.username}' logged in successfully.`);
      return true;
    }
    return false;
  };

  const logout = () => {
    addActivityLog('Admin Logout', `User '${user?.username}' logged out.`);
    setSessionLoggedIn(false);
    setAuthStage('login');
  };

  const cancelOtp = () => {
    setAuthStage('login');
    setStoredOtp(null);
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

  return (
    <AuthContext.Provider value={{ 
        isLoggedIn: authStage === 'loggedIn', 
        authStage,
        userEmail: user?.email || null,
        createAdmin,
        login, 
        verifyOtp,
        logout, 
        cancelOtp,
        updateCredentials 
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