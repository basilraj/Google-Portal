import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/Icon';
import Dashboard from '../components/admin/Dashboard';
import JobManagement from '../components/admin/JobManagement';
import JobCategoryManagement from '../components/admin/JobCategoryManagement';
import QuickLinkManagement from '../components/admin/QuickLinkManagement';
import ContentPostManagement from '../components/admin/ContentPostManagement';
import SubscriberManagement from '../components/admin/SubscriberManagement';
import AdManagement from '../components/admin/AdManagement';
import BreakingNewsManagement from '../components/admin/BreakingNewsManagement';

type AdminSection = 'dashboard' | 'jobs' | 'categories' | 'quick-links' | 'posts' | 'subscribers' | 'ads' | 'breaking-news';

const AdminPanel: React.FC = () => {
    const { logout } = useAuth();
    const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');

    const menuItems: { id: AdminSection; name: string; icon: string }[] = [
        { id: 'dashboard', name: 'Dashboard', icon: 'tachometer-alt' },
        { id: 'jobs', name: 'Jobs', icon: 'briefcase' },
        { id: 'categories', name: 'Job Categories', icon: 'tags' },
        { id: 'quick-links', name: 'Quick Links', icon: 'link' },
        { id: 'posts', name: 'Content Posts', icon: 'file-alt' },
        { id: 'subscribers', name: 'Subscribers', icon: 'users' },
        { id: 'breaking-news', name: 'Breaking News', icon: 'newspaper' },
        { id: 'ads', name: 'Ad Management', icon: 'ad' },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case 'dashboard': return <Dashboard />;
            case 'jobs': return <JobManagement />;
            case 'categories': return <JobCategoryManagement />;
            case 'quick-links': return <QuickLinkManagement />;
            case 'posts': return <ContentPostManagement />;
            case 'subscribers': return <SubscriberManagement />;
            case 'breaking-news': return <BreakingNewsManagement />;
            case 'ads': return <AdManagement />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e3c72] text-white flex flex-col">
                <div className="p-4 border-b border-blue-800 text-center">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <p className="text-sm text-blue-200">Sarkari Result</p>
                </div>
                <nav className="flex-grow p-2">
                    <ul className="space-y-1">
                        {menuItems.map(item => (
                            <li key={item.id}>
                                <button
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeSection === item.id ? 'bg-blue-800' : 'hover:bg-blue-700'
                                    }`}
                                >
                                    <Icon name={item.icon} className="w-5" />
                                    <span>{item.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="p-4 border-t border-blue-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors"
                    >
                        <Icon name="sign-out-alt" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white shadow-sm p-4">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeSection.replace('-', ' ')}</h2>
                </header>
                <main className="flex-1 p-6 overflow-y-auto">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
