
import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import PublicWebsite from './pages/PublicWebsite';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminPanel from './pages/AdminPanel';
import MaintenancePage from './pages/MaintenancePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import Disclaimer from './pages/Disclaimer';
import TermsAndConditions from './pages/TermsAndConditions';
import BlogPage from './pages/BlogPage';

const basePath = '/Google-Portal';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { generalSettings, seoSettings } = useData();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);
  
  // Update document title based on SEO settings and current page
  useEffect(() => {
    const route = path.replace(basePath, '') || '/';
    let title = seoSettings.global.siteTitle;
    if (route.startsWith('/admin')) title = `Admin Panel | ${title}`;
    else if (route === '/blog') title = `Blog | ${title}`;
    else if (route === '/privacy') title = `Privacy Policy | ${title}`;
    else if (route === '/terms') title = `Terms & Conditions | ${title}`;
    else if (route === '/about') title = `About Us | ${title}`;
    else if (route === '/disclaimer') title = `Disclaimer | ${title}`;
    document.title = title;
  }, [path, seoSettings.global.siteTitle]);


  const navigate = (newPath: string) => {
    // Ensure the new path starts with a single slash
    const sanitizedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
    const fullPath = `${basePath}${sanitizedPath}`.replace('//', '/');
    window.history.pushState({}, '', fullPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const route = path.replace(basePath, '') || '/';

  if (generalSettings.maintenanceMode && !route.startsWith('/admin')) {
      return <MaintenancePage />;
  }

  if (route.startsWith('/admin')) {
    return isLoggedIn ? <AdminPanel /> : <AdminLoginPage />;
  }
  
  switch (route) {
    case '/':
      return <PublicWebsite navigate={navigate} />;
    case '/blog':
      return <BlogPage navigate={navigate} />;
    case '/privacy':
      return <PrivacyPolicy navigate={navigate} />;
    case '/about':
      return <AboutUs navigate={navigate} />;
    case '/disclaimer':
        return <Disclaimer navigate={navigate} />;
    case '/terms':
        return <TermsAndConditions navigate={navigate} />;
    default:
        // For gh-pages, a 404 might just be a refresh on a sub-page.
        // Let's redirect to home. In a real server setup, this would be a 404 page.
        return <PublicWebsite navigate={navigate} />;
  }
};

export default App;
