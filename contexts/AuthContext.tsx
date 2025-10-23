import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User } from '../types.ts';
import { useData } from './DataContext.tsx';

type AuthStage = 'loading' | 'signup' | 'login' | 'loggedIn' | 'forgotPassword' | 'resetPassword';

interface AuthContextType {
  isLoggedIn: boolean;
  isDemoUser: boolean;
  authStage: AuthStage;
  userEmail: string | null;
  createAdmin: (user: Omit<User, 'id' | 'passwordHash'> & { password: string }) => Promise<boolean>;
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addActivityLog, smtpSettings } = useData();
  const [user, setUser] = useState<Omit<User, 'passwordHash'> | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>('loading');
  const [hasAdminAccount, setHasAdminAccount] = useState(false);

  const checkAdminExists = useCallback(async () => {
    try {
        const response = await fetch('/api/data?model=user');
        const adminUser = await response.json();
        setHasAdminAccount(!!adminUser);
        if (adminUser) {
            setAuthStage('login');
        } else {
            setAuthStage('signup');
        }
    } catch (error) {
        console.error("Failed to check for admin account:", error);
        setAuthStage('login'); // Default to login on error
    }
  }, []);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('admin-user');
    const sessionIsDemo = sessionStorage.getItem('is-demo-user') === 'true';

    if (sessionUser) {
        setUser(JSON.parse(sessionUser));
        setIsDemoUser(sessionIsDemo);
        setAuthStage('loggedIn');
    } else {
        checkAdminExists();
    }
  }, [checkAdminExists]);

  const createAdmin = async (userData: Omit<User, 'id' | 'passwordHash'> & { password: string }): Promise<boolean> => {
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'user', action: 'signup', data: userData })
    });
    
    if (response.ok) {
        await addActivityLog('Admin Account Created', `New admin account created for user: ${userData.username}`);
        setHasAdminAccount(true);
        setAuthStage('login');
        return true;
    }
    return false;
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'user', action: 'login', data: { username, password }})
    });

    if (response.ok) {
      const { user } = await response.json();
      setUser(user);
      setIsDemoUser(false);
      sessionStorage.setItem('admin-user', JSON.stringify(user));
      sessionStorage.setItem('is-demo-user', 'false');
      setAuthStage('loggedIn');
      await addActivityLog('Admin Login', `User '${user.username}' logged in successfully.`);
      return true;
    }
    return false;
  };

  const loginAsDemo = () => {
    const demoUser = { username: 'demo', email: 'demo@example.com' };
    setUser(demoUser);
    setIsDemoUser(true);
    sessionStorage.setItem('admin-user', JSON.stringify(demoUser));
    sessionStorage.setItem('is-demo-user', 'true');
    setAuthStage('loggedIn');
    addActivityLog('Demo Login', 'Demo user logged in.');
  };

  const logout = () => {
    addActivityLog(isDemoUser ? 'Demo Logout' : 'Admin Logout', `User '${isDemoUser ? 'demo' : user?.username}' logged out.`);
    setUser(null);
    setIsDemoUser(false);
    sessionStorage.removeItem('admin-user');
    sessionStorage.removeItem('is-demo-user');
    setAuthStage('login');
  };

  const updateCredentials = async (currentPassword: string, newUsername: string, newPassword: string): Promise<boolean> => {
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'user',
            action: 'updateCredentials',
            data: { currentPassword, newUsername, newPassword }
        })
    });
    if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        sessionStorage.setItem('admin-user', JSON.stringify(updatedUser));
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
    // This remains a simulation as server-side email sending is complex for this scope
    const response = await fetch('/api/data?model=user');
    const adminUser = await response.json();

    if (adminUser && email === adminUser.email) {
      if (smtpSettings.configured) {
        alert(`SMTP is configured. In a real-world application, a password reset link would be sent to ${adminUser.email}.`);
      } else {
        alert(`SMTP not configured. Please configure it in Settings for a production environment. For this demo, we will proceed directly to the password reset step.`);
      }
      setAuthStage('resetPassword');
      return true;
    }
    return false;
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    // This would be a proper API call in a full implementation
     if (user) {
        // This is a placeholder for a proper reset flow
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