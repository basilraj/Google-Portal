
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/Icon';
import Dashboard from '../components/admin/Dashboard';
import JobManagement from '../components/admin/JobManagement';
import QuickLinkManagement from '../components/admin/QuickLinkManagement';
import ContentPostManagement from '../components/admin/ContentPostManagement';
import SubscriberManagement from '../components/admin/SubscriberManagement';
import AdManagement from '../components/admin/AdManagement';

type AdminTab = 'dashboard' | 'jobs' | 'links' | 'posts' | 'subscribers' | 'ads';

const AdminPanel: React.FC = () => {
    const { logout } = useAuth();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    const menuItems: { id: AdminTab; name: string; icon: string }[] = [
        { id: 'dashboard', name: 'Dashboard', icon: 'tachometer-alt' },
        { id: 'jobs', name: 'Job Management', icon: 'briefcase' },
        { id: 'links', name: 'Quick Links', icon: 'link' },
        { id: 'posts', name: 'Content Posts', icon: 'file-alt' },
        { id: 'subscribers', name: 'Subscribers', icon: 'users' },
        { id: 'ads', name: 'Ad Management', icon: 'ad' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard />;
            case 'jobs': return <JobManagement />;
            case 'links': return <QuickLinkManagement />;
            case 'posts': return <ContentPostManagement />;
            case 'subscribers': return <SubscriberManagement />;
            case 'ads': return <AdManagement />;
            default: return <Dashboard />;
        }
    };
    
    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-gradient-to-b from-[#1e3c72] to-[#2a5298] text-white flex flex-col fixed h-full">
                <div className="p-4 border-b border-white/20">
                    <h2 className="text-2xl font-bold">SarkariNaukri</h2>
                    <p className="text-sm opacity-80">Admin Panel</p>
                </div>
                <nav className="flex-grow mt-4">
                    <ul>
                        {menuItems.map(item => (
                             <li key={item.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
                                   className={`flex items-center px-4 py-3 transition-colors duration-200 border-l-4 ${activeTab === item.id ? 'bg-white/10 border-red-500' : 'border-transparent hover:bg-white/10'}`}>
                                    <Icon name={item.icon} className="w-6" />
                                    <span className="ml-3">{item.name}</span>
                                </a>
                            </li>
                        ))}
                         <li>
                            <a href="#" onClick={logout} className="flex items-center px-4 py-3 mt-4 border-l-4 border-transparent hover:bg-white/10">
                                <Icon name="sign-out-alt" className="w-6" />
                                <span className="ml-3">Logout</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 ml-64 p-6">
                <header className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-[#1e3c72] capitalize">{activeTab.replace('-', ' ')}</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">AD</div>
                        <div>
                            <div className="font-semibold">Admin User</div>
                            <small className="text-gray-500">Administrator</small>
                        </div>
                    </div>
                </header>
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminPanel;
