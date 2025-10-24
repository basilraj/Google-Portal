import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext.tsx';
import { useData } from './contexts/DataContext.tsx';
import PublicWebsite from './pages/PublicWebsite.tsx';
import AdminLoginPage from './pages/AdminLoginPage.tsx';
import AdminPanel from './pages/AdminPanel.tsx';
import MaintenancePage from './pages/MaintenancePage.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import AboutUs from './pages/AboutUs.tsx';
import Disclaimer from './pages/Disclaimer.tsx';
import TermsAndConditions from './pages/TermsAndConditions.tsx';
import BlogPage from './pages/BlogPage.tsx';
import JobDetailPage from './pages/JobDetailPage.tsx';
import BlogDetailPage from './pages/BlogDetailPage.tsx';
import TelegramFAB from './components/TelegramFAB.tsx';
import ContactPage from './pages/ContactPage.tsx';
import ThemeApplicator from './components/ThemeApplicator.tsx';
import CSPEffect from './components/CSPEffect.tsx';
import ContentProtection from './components/ContentProtection.tsx';
import PreparationPage from './pages/PreparationPage.tsx';
import GoogleSearchConsoleEffect from './components/GoogleSearchConsoleEffect.tsx';

export const basePath = '';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const { generalSettings, seoSettings, securitySettings, isLoading } = useData();
  const [path, setPath] = useState(window.location.pathname);

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
  
  // This effect updates the favicon dynamically.
  useEffect(() => {
    if (isLoading) return;
    const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (link && generalSettings.siteIconUrl) {
      link.href = generalSettings.siteIconUrl;
    }
  }, [generalSettings.siteIconUrl, isLoading]);

  // Update document title based on SEO settings and current page
  useEffect(() => {
    if (isLoading) return;
    const route = (path.replace(basePath, '') || '/').toLowerCase();
    let title = seoSettings.global.siteTitle;
    if (route.startsWith('/admin')) title = `Admin Panel | ${title}`;
    else if (route.startsWith('/job/')) title = `Job Details | ${title}`;
    else if (route.startsWith('/blog/')) title = `Blog Post | ${title}`;
    else if (route === '/blog') title = `Blog | ${title}`;
    else if (route === '/preparation') title = `Exam Preparation | ${title}`;
    else if (route === '/privacy') title = `Privacy Policy | ${title}`;
    else if (route === '/terms') title = `Terms & Conditions | ${title}`;
    else if (route === '/about') title = `About Us | ${title}`;
    else if (route === '/disclaimer') title = `Disclaimer | ${title}`;
    else if (route === '/contact') title = `Contact Us | ${title}`;
    document.title = title;
  }, [path, seoSettings.global.siteTitle, isLoading]);


  const navigate = (newPath: string) => {
    const sanitizedPath = newPath.startsWith('/') ? newPath : `/${newPath}`;
    const fullPath = `${basePath}${sanitizedPath}`.replace('//', '/');
    
    try {
        window.history.pushState({}, '', fullPath);
        setPath(fullPath); // Update state directly to trigger re-render
    } catch (e) {
        if (e instanceof DOMException && e.name === 'SecurityError') {
            // This is an expected error in sandboxed environments (like iframes).
            // Fallback to in-app navigation without changing the URL.
            console.log("History API is disabled in this environment. Falling back to in-app navigation.");
            setPath(fullPath);
        } else {
            throw e;
        }
    }
  };

  const route = (path.replace(basePath, '') || '/').toLowerCase();
  const isPublicRoute = !route.startsWith('/admin');

  if (isLoading && isPublicRoute) {
    // You can return a global loading spinner here for the public site
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const renderPage = () => {
    if (generalSettings.maintenanceMode && isPublicRoute) {
        return <MaintenancePage />;
    }

    if (route.startsWith('/admin')) {
      return isLoggedIn ? <AdminPanel /> : <AdminLoginPage />;
    }
    
    if (route.startsWith('/job/')) {
      const jobSlug = path.split('/')[2];
      return <JobDetailPage jobSlug={jobSlug} navigate={navigate} />;
    }

    if (route.startsWith('/blog/')) {
      const postId = path.split('/')[2];
      return <BlogDetailPage postId={postId} navigate={navigate} />;
    }
    
    switch (route) {
      case '/':
        return <PublicWebsite navigate={navigate} />;
      case '/blog':
        return <BlogPage navigate={navigate} />;
      case '/preparation':
        return <PreparationPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPolicy navigate={navigate} />;
      case '/about':
        return <AboutUs navigate={navigate} />;
      case '/disclaimer':
          return <Disclaimer navigate={navigate} />;
      case '/terms':
          return <TermsAndConditions navigate={navigate} />;
      case '/contact':
          return <ContactPage navigate={navigate} />;
      default:
          return <PublicWebsite navigate={navigate} />;
    }
  };

  return (
    <>
      <ThemeApplicator />
      <CSPEffect />
      <GoogleSearchConsoleEffect />
      {isPublicRoute && securitySettings.preventContentCopy && <ContentProtection />}
      {renderPage()}
      {isPublicRoute && !generalSettings.maintenanceMode && <TelegramFAB />}
    </>
  );
};

export default App;