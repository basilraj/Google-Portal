import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import AdminPanel from './pages/AdminPanel';
import PublicWebsite from './pages/PublicWebsite';
import AdminLoginPage from './pages/AdminLoginPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import Disclaimer from './pages/Disclaimer';
import TermsAndConditions from './pages/TermsAndConditions';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  
  const getRoute = () => {
    const base = '/Google-Portal/'; 
    const path = window.location.pathname;
    if (path.toLowerCase().startsWith(base.toLowerCase())) {
      // Return path relative to base, including leading slash (e.g., '/admin', '/privacy')
      return path.substring(base.length - 1);
    }
    // For root access, return '/'
    return path === base ? '/' : path;
  }

  const [route, setRoute] = useState(getRoute());

  const navigate = (path: string) => {
    const base = '/Google-Portal';
    window.history.pushState({}, '', `${base}${path}`);
    setRoute(path);
  }

  useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      window.history.replaceState(null, '', redirectPath);
      setRoute(getRoute());
    }

    const handlePopState = () => {
      setRoute(getRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (route.startsWith('/admin')) {
    return isLoggedIn ? <AdminPanel /> : <AdminLoginPage />;
  }

  switch (route) {
    case '/privacy':
      return <PrivacyPolicy navigate={navigate} />;
    case '/about':
      return <AboutUs navigate={navigate} />;
    case '/disclaimer':
      return <Disclaimer navigate={navigate} />;
    case '/terms':
      return <TermsAndConditions navigate={navigate} />;
    default:
      return <PublicWebsite navigate={navigate} />;
  }
};

export default App;
