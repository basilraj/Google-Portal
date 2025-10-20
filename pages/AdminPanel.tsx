import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Icon from '../components/Icon';
import Dashboard from '../components/admin/Dashboard';
import JobManagement from '../components/admin/JobManagement';
import QuickLinkManagement from '../components/admin/QuickLinkManagement';
import ContentPostManagement from '../components/admin/ContentPostManagement';
import SubscriberManagement from '../components/admin/SubscriberManagement';
import ContactManagement from '../components/admin/ContactManagement';
import BreakingNewsManagement from '../components/admin/BreakingNewsManagement';
import SettingsManagement from '../components/admin/SettingsManagement';
import UserProfile from '../components/admin/UserProfile';
import ExamNoticeManagement from '../components/admin/ExamNoticeManagement';
import ResultManagement from '../components/admin/ResultManagement';
import BackupRestore from '../components/admin/BackupRestore';
import EmailMarketing from '../components/admin/EmailMarketing';
import NotificationHistory from '../components/admin/NotificationHistory';

type AdminTab = 'dashboard' | 'jobs' | 'quick-links' | 'posts' | 'exam-notices' | 'results' | 'breaking-news' | 'subscribers' | 'contacts' | 'email-marketing' | 'notification-history' | 'settings' | 'profile' | 'backup';

interface NavItemProps {
    label: string;
    icon: string;
    tabName: AdminTab;
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    isSidebarOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ label, icon, tabName, activeTab, setActiveTab, isSidebarOpen }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        title={label}
        className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            activeTab === tabName ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-indigo-500 hover:text-white'
        } ${!isSidebarOpen && 'justify-center'}`}
    >
        <Icon name={icon} className="w-5" />
        {isSidebarOpen && <span>{label}</span>}
    </button>
);

const AdminPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const { logout } = useAuth();
    const { generalSettings } = useData();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
            case 'jobs': return <JobManagement />;
            case 'quick-links': return <QuickLinkManagement />;
            case 'posts': return <ContentPostManagement />;
            case 'exam-notices': return <ExamNoticeManagement />;
            case 'results': return <ResultManagement />;
            case 'breaking-news': return <BreakingNewsManagement />;
            case 'subscribers': return <SubscriberManagement />;
            case 'contacts': return <ContactManagement />;
            case 'email-marketing': return <EmailMarketing />;
            case 'notification-history': return <NotificationHistory />;
            case 'settings': return <SettingsManagement />;
            case 'profile': return <UserProfile />;
            case 'backup': return <BackupRestore />;
            default: return <Dashboard setActiveTab={setActiveTab} />;
        }
    };
    
    const tabTitles: Record<AdminTab, string> = {
        dashboard: 'Dashboard',
        jobs: 'Job Management',
        'quick-links': 'Quick Links',
        posts: 'General Posts',
        'exam-notices': 'Exam Notices',
        results: 'Results',
        'breaking-news': 'Breaking News',
        subscribers: 'Subscribers',
        contacts: 'Contact Submissions',
        'email-marketing': 'Email Marketing',
        'notification-history': 'Notification History',
        settings: 'Settings',
        profile: 'User Profile',
        backup: 'Backup & Restore',
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-indigo-800 text-white flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className={`p-4 flex ${isSidebarOpen ? 'justify-between' : 'justify-center'} items-center`}>
                    {isSidebarOpen ? (
                        generalSettings.siteIconUrl ? (
                            <img src={generalSettings.siteIconUrl} alt="Site Logo" className="h-10 w-auto" />
                        ) : (
                            <h1 className="text-xl font-bold">Admin Panel</h1>
                        )
                    ) : null}
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-indigo-700">
                        <Icon name={isSidebarOpen ? 'chevron-left' : 'chevron-right'} />
                    </button>
                </div>
                <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
                    <NavItem label="Dashboard" icon="tachometer-alt" tabName="dashboard" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
                    <hr className="my-2 border-indigo-700" />
                    {!isSidebarOpen && <div className="h-4" />}
                    <NavItem label="Jobs" icon="briefcase" tabName="jobs" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Posts" icon="file-alt" tabName="posts" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />
                    <NavItem label="Exam Notices" icon="bell" tabName="exam-notices" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Results" icon="poll" tabName="results" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Quick Links" icon="link" tabName="quick-links" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Breaking News" icon="newspaper" tabName="breaking-news" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <hr className="my-2 border-indigo-700" />
                     {!isSidebarOpen && <div className="h-4" />}
                    <NavItem label="Subscribers" icon="users" tabName="subscribers" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Contacts" icon="inbox" tabName="contacts" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Email" icon="envelope" tabName="email-marketing" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Notifications" icon="history" tabName="notification-history" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <hr className="my-2 border-indigo-700" />
                     {!isSidebarOpen && <div className="h-4" />}
                    <NavItem label="Settings" icon="cogs" tabName="settings" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <NavItem label="Backup" icon="save" tabName="backup" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                </nav>
                <div className="p-2 border-t border-indigo-700">
                    <NavItem label="Profile" icon="user-circle" tabName="profile" activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen}/>
                    <button
                        onClick={logout}
                        title="Logout"
                        className={`w-full flex items-center gap-3 px-4 py-2 mt-1 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <Icon name="sign-out-alt" className="w-5" />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm p-4">
                    <h2 className="text-2xl font-bold text-gray-800">{tabTitles[activeTab]}</h2>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminPanel;