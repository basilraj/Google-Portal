
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/Icon';
import Dashboard from '../components/admin/Dashboard';
import JobManagement from '../components/admin/JobManagement';
import QuickLinkManagement from '../components/admin/QuickLinkManagement';
import ContentPostManagement from '../components/admin/ContentPostManagement';
import ExamNoticeManagement from '../components/admin/ExamNoticeManagement';
import ResultManagement from '../components/admin/ResultManagement';
import SubscriberManagement from '../components/admin/SubscriberManagement';
import ContactManagement from '../components/admin/ContactManagement';
import BreakingNewsManagement from '../components/admin/BreakingNewsManagement';
import AdManagement from '../components/admin/AdManagement';
import SEOManagement from '../components/admin/SEOManagement';
import UserProfile from '../components/admin/UserProfile';
import SettingsManagement from '../components/admin/SettingsManagement';
import SocialMediaManagement from '../components/admin/SocialMediaManagement';
import NotificationHistory from '../components/admin/NotificationHistory';
import EmailMarketing from '../components/admin/EmailMarketing';
import BackupRestore from '../components/admin/BackupRestore';

type AdminTab = 'dashboard' | 'jobs' | 'posts' | 'notices' | 'results' | 'links' | 'subscribers' | 'contacts' | 'news' | 'ads' | 'seo' | 'settings' | 'profile' | 'social' | 'notifications' | 'email' | 'backup';

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { logout } = useAuth();

    const menuItems: { id: AdminTab; title: string; icon: string; }[] = [
        { id: 'dashboard', title: 'Dashboard', icon: 'tachometer-alt' },
        { id: 'jobs', title: 'Job Listings', icon: 'briefcase' },
        { id: 'posts', title: 'General Posts', icon: 'file-alt' },
        { id: 'notices', title: 'Exam Notices', icon: 'bell' },
        { id: 'results', title: 'Results', icon: 'poll' },
        { id: 'links', title: 'Quick Links', icon: 'link' },
        { id: 'news', title: 'Breaking News', icon: 'newspaper' },
        { id: 'subscribers', title: 'Subscribers', icon: 'users' },
        { id: 'email', title: 'Email Marketing', icon: 'paper-plane' },
        { id: 'notifications', title: 'Notification History', icon: 'history' },
        { id: 'contacts', title: 'Contact Messages', icon: 'envelope' },
        { id: 'social', title: 'Social Media', icon: 'share-alt' },
        { id: 'ads', title: 'Ad Management', icon: 'ad' },
        { id: 'seo', title: 'SEO Settings', icon: 'search-dollar' },
        { id: 'settings', title: 'General Settings', icon: 'cogs' },
        { id: 'backup', title: 'Backup & Restore', icon: 'database' },
        { id: 'profile', title: 'Admin Profile', icon: 'user-cog' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
            case 'jobs': return <JobManagement />;
            case 'posts': return <ContentPostManagement />;
            case 'notices': return <ExamNoticeManagement />;
            case 'results': return <ResultManagement />;
            case 'links': return <QuickLinkManagement />;
            case 'subscribers': return <SubscriberManagement />;
            case 'email': return <EmailMarketing />;
            case 'notifications': return <NotificationHistory />;
            case 'contacts': return <ContactManagement />;
            case 'news': return <BreakingNewsManagement />;
            case 'social': return <SocialMediaManagement />;
            case 'ads': return <AdManagement />;
            case 'seo': return <SEOManagement />;
            case 'settings': return <SettingsManagement />;
            case 'backup': return <BackupRestore />;
            case 'profile': return <UserProfile />;
            default: return <Dashboard setActiveTab={setActiveTab} />;
        }
    };
    
    const activeTitle = menuItems.find(item => item.id === activeTab)?.title || 'Dashboard';

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-gray-800 text-gray-200 flex flex-col transition-width duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className={`flex items-center justify-center h-16 border-b border-gray-700 ${isSidebarOpen ? '' : 'px-2'}`}>
                    <Icon name="user-shield" className="text-2xl text-indigo-400" />
                    {isSidebarOpen && <h1 className="text-xl font-bold ml-2">Admin Panel</h1>}
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}
                            title={item.title}
                        >
                            <Icon name={item.icon} className="text-lg w-6 text-center" />
                            {isSidebarOpen && <span className="ml-4 font-semibold">{item.title}</span>}
                        </button>
                    ))}
                </nav>
                 <div className="p-4 border-t border-gray-700">
                     <button onClick={logout} className="w-full flex items-center p-3 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Logout">
                         <Icon name="sign-out-alt" className="text-lg w-6 text-center" />
                         {isSidebarOpen && <span className="ml-4 font-semibold">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm flex items-center justify-between p-4">
                     <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 hover:text-indigo-600">
                            <Icon name="bars" className="text-xl" />
                        </button>
                         <h2 className="text-2xl font-bold text-gray-800">{activeTitle}</h2>
                    </div>
                     <a href="/" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline flex items-center gap-2">
                        View Public Site <Icon name="external-link-alt" />
                    </a>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;