

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import Icon from '../components/Icon.tsx';
import Dashboard from '../components/admin/Dashboard.tsx';
import JobManagement from '../components/admin/JobManagement.tsx';
import ContentPostManagement from '../components/admin/ContentPostManagement.tsx';
import SubscriberManagement from '../components/admin/SubscriberManagement.tsx';
import QuickLinkManagement from '../components/admin/QuickLinkManagement.tsx';
import BreakingNewsManagement from '../components/admin/BreakingNewsManagement.tsx';
import ContactManagement from '../components/admin/ContactManagement.tsx';
import SettingsManagement from '../components/admin/SettingsManagement.tsx';
import UserProfile from '../components/admin/UserProfile.tsx';
import ExamNoticeManagement from '../components/admin/ExamNoticeManagement.tsx';
import ResultManagement from '../components/admin/ResultManagement.tsx';
import BackupRestore from '../components/admin/BackupRestore.tsx';
import EmailMarketing from '../components/admin/EmailMarketing.tsx';
import NotificationHistory from '../components/admin/NotificationHistory.tsx';
import SecurityLogs from '../components/admin/SecurityLogs.tsx';
import { useData } from '../contexts/DataContext.tsx';

type AdminTab = 'dashboard' | 'jobs' | 'posts' | 'exam-notices' | 'results' | 'quick-links' | 'breaking-news' | 'subscribers' | 'contacts' | 'email-marketing' | 'notification-history' | 'settings' | 'profile' | 'backup-restore' | 'security-logs';

const AdminPanel: React.FC = () => {
    const { logout } = useAuth();
    const { generalSettings, isPersistenceActive } = useData();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
            case 'jobs': return <JobManagement />;
            case 'posts': return <ContentPostManagement />;
            case 'exam-notices': return <ExamNoticeManagement />;
            case 'results': return <ResultManagement />;
            case 'quick-links': return <QuickLinkManagement />;
            case 'breaking-news': return <BreakingNewsManagement />;
            case 'subscribers': return <SubscriberManagement />;
            case 'contacts': return <ContactManagement />;
            case 'email-marketing': return <EmailMarketing />;
            case 'notification-history': return <NotificationHistory />;
            case 'settings': return <SettingsManagement />;
            case 'profile': return <UserProfile />;
            case 'backup-restore': return <BackupRestore />;
            case 'security-logs': return <SecurityLogs />;
            default: return <Dashboard setActiveTab={setActiveTab} />;
        }
    };
    
    const NavLink: React.FC<{ tab: AdminTab; icon: string; label: string; }> = ({ tab, icon, label }) => (
        <button
            onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }}
            className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-200 hover:bg-indigo-800'}`}
        >
            <Icon name={icon} className="w-6 mr-3" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <aside className={`bg-indigo-900 text-white w-64 fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
                <div className="p-4 flex items-center gap-3 border-b border-indigo-800">
                    {generalSettings.siteIconUrl && <img src={generalSettings.siteIconUrl} alt="Logo" className="h-8 w-8 rounded-full" />}
                    <h1 className="text-xl font-bold">{generalSettings.siteTitle}</h1>
                </div>
                <nav className="p-2 space-y-1">
                    <NavLink tab="dashboard" icon="tachometer-alt" label="Dashboard" />
                    <div className="pt-2">
                        <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</h2>
                        <NavLink tab="jobs" icon="briefcase" label="Job Listings" />
                        <NavLink tab="posts" icon="file-alt" label="General Posts" />
                        <NavLink tab="exam-notices" icon="bell" label="Exam Notices" />
                        <NavLink tab="results" icon="poll" label="Results" />
                        <NavLink tab="quick-links" icon="link" label="Quick Links" />
                        <NavLink tab="breaking-news" icon="newspaper" label="Breaking News" />
                    </div>
                     <div className="pt-2">
                        <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Audience</h2>
                        <NavLink tab="subscribers" icon="users" label="Subscribers" />
                        <NavLink tab="contacts" icon="envelope" label="Contact Messages" />
                    </div>
                     <div className="pt-2">
                        <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Marketing</h2>
                        <NavLink tab="email-marketing" icon="paper-plane" label="Email Campaigns" />
                        <NavLink tab="notification-history" icon="history" label="Notification History" />
                    </div>
                    <div className="pt-2">
                        <h2 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">System</h2>
                        <NavLink tab="settings" icon="cogs" label="Settings" />
                        <NavLink tab="profile" icon="user-circle" label="Admin Profile" />
                        <NavLink tab="backup-restore" icon="database" label="Backup & Restore" />
                        <NavLink tab="security-logs" icon="shield-alt" label="Security Logs" />
                    </div>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm z-20 flex justify-between items-center p-4">
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600 md:hidden">
                        <Icon name="bars" className="text-2xl" />
                    </button>
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
                    <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600">
                        <Icon name="sign-out-alt" />
                        <span>Logout</span>
                    </button>
                </header>
                
                {!isPersistenceActive && (
                    <div className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-sm p-3 text-center font-medium shadow-inner">
                        <Icon name="exclamation-triangle" className="mr-2" />
                        <strong>Warning:</strong> Your browser's storage is not accessible. Any changes you make will be lost when you close the app.
                    </div>
                )}

                {/* Main Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;