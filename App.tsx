import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import AdminPanel from './pages/AdminPanel';
import PublicWebsite from './pages/PublicWebsite';
import AdminLoginPage from './pages/AdminLoginPage';

const App: React.FC = () => {
  const { isLoggedIn } = useAuth();
  
  // Helper function to get the current route relative to the GitHub Pages base path
  const getRoute = () => {
    const base = '/Google-Portal/'; // This must match vite.config.ts
    const path = window.location.pathname;
    // Return the path without the base, but keep the leading slash (e.g., '/admin')
    return path.startsWith(base) ? path.substring(base.length - 1) : path;
  }

  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    // This effect runs only once on initial load to handle SPA redirects
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath) {
      sessionStorage.removeItem('redirectPath');
      // Update the browser's URL to the path the user originally tried to visit
      window.history.replaceState(null, '', redirectPath);
      // Update our component's state to render the correct page
      setRoute(getRoute());
    }

    // This listener handles browser back/forward button clicks
    const handlePopState = () => {
      setRoute(getRoute());
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []); // Empty dependency array ensures this runs only once after mount

  if (route.startsWith('/admin')) {
    return isLoggedIn ? <AdminPanel /> : <AdminLoginPage />;
  }
  
  return <PublicWebsite />;
};

export default App;
