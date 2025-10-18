import React, { useState } from 'react';
import Icon from '../components/Icon';
import Dashboard from '../components/admin/Dashboard';
import JobManagement from '../components/admin/JobManagement';
import QuickLinkManagement from '../components/admin/QuickLinkManagement';
import ContentPostManagement from '../components/admin/ContentPostManagement';
import SubscriberManagement from '../components/admin/SubscriberManagement';
import AdManagement from '../components/admin/AdManagement';
import GeneralSettings from '../components/admin/GeneralSettings';
import BreakingNewsManagement from '../components/admin/BreakingNewsManagement';
import { useAuth } from '../contexts/AuthContext';

type AdminPage = 'dashboard' | 'jobs' | 'quick-links' | 'content-posts' | 'subscribers' | 'ads' | 'breaking-news' | 'settings';

const AdminPanel: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');
  const { logout } = useAuth();
  
  const NavItem: React.FC<{ page: AdminPage; icon: string; label: string }> = ({ page, icon, label }) => (
    <button 
      onClick={() => setCurrentPage(page)}
      className={`flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors ${
        currentPage === page
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon name={icon} className="mr-3 w-5 text-center" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'jobs': return <JobManagement />;
      case 'quick-links': return <QuickLinkManagement />;
      case 'content-posts': return <ContentPostManagement />;
      case 'subscribers': return <SubscriberManagement />;
      case 'ads': return <AdManagement />;
      case 'breaking-news': return <BreakingNewsManagement />;
      case 'settings': return <GeneralSettings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col shadow-lg">
        <div className="h-16 flex items-center justify-center border-b px-4">
          <Icon name="tools" className="text-indigo-600 text-2xl" />
          <h1 className="text-xl font-bold text-gray-800 ml-2">Admin Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem page="dashboard" icon="tachometer-alt" label="Dashboard" />
          <NavItem page="jobs" icon="briefcase" label="Job Posts" />
          <NavItem page="quick-links" icon="link" label="Quick Links" />
          <NavItem page="content-posts" icon="file-alt" label="Content Posts" />
          <NavItem page="subscribers" icon="users" label="Subscribers" />
          <NavItem page="breaking-news" icon="bullhorn" label="Breaking News" />
          <NavItem page="ads" icon="ad" label="Ad Management" />
          <NavItem page="settings" icon="cogs" label="General Settings" />
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-left rounded-lg text-red-600 hover:bg-red-50"
          >
            <Icon name="sign-out-alt" className="mr-3 w-5 text-center" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
             <h2 className="text-2xl font-semibold text-gray-800 capitalize">{currentPage.replace('-', ' ')}</h2>
          </div>
        </header>
        <div className="container mx-auto p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
