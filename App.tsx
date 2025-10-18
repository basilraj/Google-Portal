import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import AdminPanel from './pages/AdminPanel';
import PublicWebsite from './pages/PublicWebsite';
import AdminLoginPage from './pages/AdminLoginPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import Disclaimer from './pages/Disclaimer';
import TermsAndConditions from './pages/TermsAndConditions';
import BlogPage from './pages/BlogPage';

const FullScreenLoader: React.FC = () => (
  <div className="fixed inset-0 bg-white z-50 flex flex-col justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
    <p className="mt-4 text-lg text-gray-700 font-semibold">Loading Portal...</p>
  </div>
);

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { loading, seoSettings } = useData();
  
  const getRoute = () => {
    const base = '/Google-Portal/'; 
    const path = window.location.pathname;
    if (path.toLowerCase().startsWith(base.toLowerCase())) {
      return path.substring(base.length - 1);
    }
    return path === base ? '/' : path;
  }

  const [route, setRoute] = useState(getRoute());

  const navigate = (path: string) => {
    const base = '/Google-Portal';
    window.history.pushState({}, '', `${base}${path}`);
    setRoute(path);
  }

  useEffect(() => {
    try {
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath) {
        sessionStorage.removeItem('redirectPath');
        window.history.replaceState(null, '', redirectPath);
        setRoute(getRoute());
      }
    } catch (e) {
      console.warn('Session storage is not available:', e);
    }

    const handlePopState = () => {
      setRoute(getRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);
  
  useEffect(() => {
    const baseTitle = seoSettings.global.siteTitle || 'SarkariNaukri Job Portal';
    let pageTitle = baseTitle;

    switch (route) {
        case '/privacy':
            pageTitle = `Privacy Policy | ${baseTitle}`;
            break;
        case '/about':
            pageTitle = `About Us | ${baseTitle}`;
            break;
        case '/disclaimer':
            pageTitle = `Disclaimer | ${baseTitle}`;
            break;
        case '/terms':
            pageTitle = `Terms & Conditions | ${baseTitle}`;
            break;
        case '/blog':
            pageTitle = `Blog | ${baseTitle}`;
            break;
        default:
            if (route.startsWith('/admin')) {
                pageTitle = `Admin Panel | ${baseTitle}`;
            }
            break;
    }
    document.title = pageTitle;
  }, [route, seoSettings.global.siteTitle]);

  if (loading) {
    return <FullScreenLoader />;
  }

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
    case '/blog':
      return <BlogPage navigate={navigate} />;
    default:
      return <PublicWebsite navigate={navigate} />;
  }
};

export default App;