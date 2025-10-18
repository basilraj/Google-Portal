
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
import JobDetailPage from './pages/JobDetailPage';
import BlogDetailPage from './pages/BlogDetailPage';
import TelegramFAB from './components/TelegramFAB';

export const basePath = '/Google-Portal';

/**
 * Determines the initial path for the application.
 * On static hosts like GitHub Pages, a direct visit to a sub-route (e.g., /admin)
 * triggers a 404. The 404.html page saves the intended path to sessionStorage
 * and redirects to the root. This function reads that saved path to restore the
 * correct view on the initial load.
 */
const getInitialPath = () => {
  try {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      // If we have a redirect path, use it. Also, update the browser's history
      // to reflect the correct deep link URL without reloading the page.
      if (window.location.pathname !== redirectPath) {
          window.history.replaceState(null, '', redirectPath);
      }
      return redirectPath;
    }
  } catch (error) {
    console.warn("Could not access sessionStorage to handle redirect:", error);
  }
  // If no redirect path is found, use the current path.
  return window.location.pathname;
};


const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { generalSettings, seoSettings } = useData();
  const [path, setPath] = useState(getInitialPath);

  // This effect listens for browser navigation events (back/forward buttons)
  // to keep the component's path state in sync.
  useEffect(() => {
    const onLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);
  
  // This effect listens for path changes and scrolls to the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
  
  // Update document title based on SEO settings and current page
  useEffect(() => {
    const route = path.replace(basePath, '') || '/';
    let title = seoSettings.global.siteTitle;
    if (route.startsWith('/admin')) title = `Admin Panel | ${title}`;
    else if (route.startsWith('/job/')) title = `Job Details | ${title}`;
    else if (route.startsWith('/blog/')) title = `Blog Post | ${title}`;
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
    // Dispatch a popstate event so the listener in useEffect can update the path state
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const route = path.replace(basePath, '') || '/';
  const isPublicRoute = !route.startsWith('/admin');

  const renderPage = () => {
    if (generalSettings.maintenanceMode && isPublicRoute) {
        return <MaintenancePage />;
    }

    if (route.startsWith('/admin')) {
      return isLoggedIn ? <AdminPanel /> : <AdminLoginPage />;
    }
    
    if (route.startsWith('/job/')) {
      const jobId = route.split('/')[2];
      return <JobDetailPage jobId={jobId} navigate={navigate} />;
    }

    if (route.startsWith('/blog/')) {
      const postId = route.split('/')[2];
      return <BlogDetailPage postId={postId} navigate={navigate} />;
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
          return <PublicWebsite navigate={navigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      {isPublicRoute && !generalSettings.maintenanceMode && <TelegramFAB />}
    </>
  );
};

export default App;
