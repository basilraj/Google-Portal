import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import AdminPanel from './pages/AdminPanel';
import AdminLoginPage from './pages/AdminLoginPage';
import PublicWebsite from './pages/PublicWebsite';
import AboutUs from './pages/AboutUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Disclaimer from './pages/Disclaimer';
import BlogPage from './pages/BlogPage';
import Icon from './components/Icon';
import { useData } from './contexts/DataContext';

const Header = () => {
  const { breakingNews } = useData();
  const activeNews = breakingNews.filter(n => n.status === 'active');
  const basePath = '/Google-Portal';

  return (
    <header className="bg-white shadow-md">
      <div className="bg-[#1e3c72] text-white text-center py-4">
          <h1 className="text-4xl font-extrabold tracking-wider">SARKARI RESULT</h1>
          <p className="text-lg font-medium">WWW.SARKARIRESULT.COM</p>
      </div>
      <nav className="bg-gray-800">
        <div className="container mx-auto px-4">
            <ul className="flex justify-center items-center space-x-6 text-white font-semibold">
                {['Home', 'Latest Jobs', 'Results', 'Admit Card', 'Answer Key', 'Syllabus', 'Contact Us'].map(item => (
                   <li key={item} className="py-3"><a href="#" className="hover:text-yellow-300 transition-colors duration-200">{item}</a></li>
                ))}
            </ul>
        </div>
      </nav>
      {activeNews.length > 0 && (
         <div className="bg-red-600 text-white p-2 overflow-hidden">
            <div className="marquee-container flex items-center">
              <span className="font-bold mr-4 flex-shrink-0">Breaking News:</span>
              <div className="marquee">
                  <span>
                    {activeNews.map(news => (
                      <a href={news.link || '#'} key={news.id} className="mx-4 hover:underline">{news.text}</a>
                    ))}
                  </span>
              </div>
            </div>
         </div>
      )}
    </header>
  );
};

const Footer = () => {
    const basePath = '/Google-Portal';
    return (
        <footer className="bg-gray-800 text-white mt-10">
            <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">SARKARI RESULT</h3>
                    <p className="text-gray-400">The official portal for all government job notifications, results, and updates.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><a href={`${basePath}/about-us`} className="hover:text-white">About Us</a></li>
                        <li><a href={`${basePath}/privacy-policy`} className="hover:text-white">Privacy Policy</a></li>
                        <li><a href={`${basePath}/terms-and-conditions`} className="hover:text-white">Terms and Conditions</a></li>
                        <li><a href={`${basePath}/disclaimer`} className="hover:text-white">Disclaimer</a></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                    <div className="flex space-x-4 text-2xl">
                        <a href="#" className="text-gray-400 hover:text-white"><Icon prefix="fab" name="facebook-square" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Icon prefix="fab" name="twitter-square" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Icon prefix="fab" name="instagram-square" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><Icon prefix="fab" name="linkedin" /></a>
                    </div>
                </div>
            </div>
            <div className="bg-gray-900 py-4 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Sarkari Result. All Rights Reserved.
            </div>
        </footer>
    );
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="bg-gray-50 min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}

const App: React.FC = () => {
    const { isLoggedIn } = useAuth();
    const basePath = '/Google-Portal';
    const [route, setRoute] = useState(window.location.pathname);

    useEffect(() => {
        const handleRouteChange = () => {
            setRoute(window.location.pathname);
        };
        // This is used for browser back/forward navigation
        window.addEventListener('popstate', handleRouteChange);
        
        // This handles manual URL changes and redirects from AuthContext
        const originalPushState = window.history.pushState;
        window.history.pushState = function(...args) {
            originalPushState.apply(this, args);
            handleRouteChange();
        };

        return () => {
            window.removeEventListener('popstate', handleRouteChange);
            window.history.pushState = originalPushState;
        };
    }, []);

    const renderPage = () => {
        const path = route.endsWith('/') && route.length > 1 ? route.slice(0, -1) : route;
        const appPath = path.replace(basePath, '') || '/';
        
        if (appPath.startsWith('/admin')) {
            return isLoggedIn ? <AdminPanel /> : <AdminLoginPage />;
        }
        
        let pageComponent;
        switch(appPath) {
            case '/':
                pageComponent = <PublicWebsite />;
                break;
            case '/about-us':
                pageComponent = <AboutUs />;
                break;
            case '/privacy-policy':
                pageComponent = <PrivacyPolicy />;
                break;
            case '/terms-and-conditions':
                pageComponent = <TermsAndConditions />;
                break;
            case '/disclaimer':
                pageComponent = <Disclaimer />;
                break;
            case '/blog':
                pageComponent = <BlogPage />;
                break;
            default:
                pageComponent = <PublicWebsite />;
        }
        return <PublicLayout>{pageComponent}</PublicLayout>;
    };

    return <>{renderPage()}</>;
};

export default App;
