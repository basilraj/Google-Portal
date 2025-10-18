import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import AdminPanel from './pages/AdminPanel';
import PublicWebsite from './pages/PublicWebsite';
import AdminLoginPage from './pages/AdminLoginPage';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (route.startsWith('/admin')) {
    return isLoggedIn ? <AdminPanel /> : <AdminLoginPage />;
  }
  
  return <PublicWebsite />;
};

export default App;
