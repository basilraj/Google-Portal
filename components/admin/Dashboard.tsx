import React from 'react';
import { useData } from '../../contexts/DataContext.tsx';
import Icon from '../Icon.tsx';
import { Job, ContentPost, Subscriber, ActivityLog, PlacementKey } from '../../types.ts';
import { getEffectiveJobStatus } from '../../utils/jobUtils.ts';

type AdminTab = 'dashboard' | 'jobs' | 'posts' | 'exam-notices' | 'results' | 'quick-links' | 'breaking-news' | 'subscribers' | 'contacts' | 'email-marketing' | 'notification-history' | 'settings' | 'profile' | 'backup-restore' | 'security-logs';

const StatCard: React.FC<{ title: string; value: number | string; icon: string; color: string; onClick?: () => void; }> = ({ title, value, icon, color, onClick }) => (
    <div
        className={`bg-white p-6 rounded-lg shadow-sm flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-transform' : ''}`}
        onClick={onClick}
    >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon name={icon} className="text-white text-xl" />
        </div>
        <div>
            <div className="text-3xl font-bold text-gray-800">{value}</div>
            <div className="text-sm font-medium text-gray-500">{title}</div>
        </div>
    </div>
);

const AdStatusCheck: React.FC<{ setActiveTab: (tab: AdminTab) => void }> = ({ setActiveTab }) => {
    const { adSettings, toggleAdTest } = useData();
    const placements = [
        { key: 'headerAd', label: 'Header Ad' },
        { key: 'sidebarAd', label: 'Sidebar Ad' },
        { key: 'footerAd', label: 'Footer Ad' },
        { key: 'inFeedJobsAd', label: 'In-Feed (Jobs)' },
        { key: 'inFeedBlogAd', label: 'In-Feed (Blog)' },
        { key: 'jobDetailTopAd', label: 'Job Detail Top' },
        { key: 'blogDetailTopAd', label: 'Blog Detail Top' },
    ] as { key: PlacementKey; label: string }[];

    return (
        <section id="ad-status-check">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Ad Status Check</h2>
                <button onClick={() => setActiveTab('settings')} className="text-sm font-semibold text-indigo-600 hover:underline">
                    Go to Ad Settings
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
                <ul className="divide-y divide-gray-200">
                    {placements.map(({ key, label }) => {
                        const placementSetting = adSettings[key];
                        const isEnabled = placementSetting?.enabled || false;
                        const isTestActive = adSettings.activeTests?.includes(key) || false;

                        return (
                            <li key={key} className="p-4 flex items-center justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{label}</p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isEnabled ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <a href={`/?ad_test=${key}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline" title="View on site">
                                        <Icon name="external-link-alt" />
                                    </a>
                                    <div className="flex items-center gap-2">
                                        <label htmlFor={`test-toggle-${key}`} className="text-sm text-gray-600">Test Mode</label>
                                        <button
                                            role="switch"
                                            aria-checked={isTestActive}
                                            id={`test-toggle-${key}`}
                                            onClick={() => toggleAdTest(key)}
                                            className={`${isTestActive ? 'bg-yellow-400' : 'bg-gray-200'} relative inline-flex items-center h-6 rounded-full w-11 transition-colors`}
                                        >
                                            <span className={`${isTestActive ? 'translate-x-6' : 'translate-x-1'} inline-block w-4 h-4 transform bg-white rounded-full transition-transform`} />
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
};

const Dashboard: React.FC<{ setActiveTab: (tab: AdminTab) => void }> = ({ setActiveTab }) => {
    const { jobs, posts, subscribers, activityLogs } = useData();

    const activeJobs = jobs.filter(job => getEffectiveJobStatus(job) === 'active' || getEffectiveJobStatus(job) === 'closing-soon').length;
    const totalPosts = posts.filter(p => p.type === 'posts').length;
    const totalSubscribers = subscribers.length;
    const recentLogs = activityLogs.slice(0, 5);

    return (
        <div className="space-y-6">
            <section id="stats">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Active Jobs" value={activeJobs} icon="briefcase" color="bg-blue-500" onClick={() => setActiveTab('jobs')} />
                    <StatCard title="Blog Posts" value={totalPosts} icon="file-alt" color="bg-green-500" onClick={() => setActiveTab('posts')} />
                    <StatCard title="Subscribers" value={totalSubscribers} icon="users" color="bg-purple-500" onClick={() => setActiveTab('subscribers')} />
                </div>
            </section>

            <section id="quick-actions">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <button onClick={() => setActiveTab('jobs')} className="bg-white p-4 rounded-lg shadow-sm text-center hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <Icon name="plus" className="text-indigo-600 text-2xl" />
                        <span className="text-sm font-semibold text-gray-700">Add New Job</span>
                    </button>
                     <button onClick={() => setActiveTab('posts')} className="bg-white p-4 rounded-lg shadow-sm text-center hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <Icon name="file-medical" className="text-indigo-600 text-2xl" />
                        <span className="text-sm font-semibold text-gray-700">Add New Post</span>
                    </button>
                     <button onClick={() => setActiveTab('settings')} className="bg-white p-4 rounded-lg shadow-sm text-center hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <Icon name="cogs" className="text-indigo-600 text-2xl" />
                        <span className="text-sm font-semibold text-gray-700">Site Settings</span>
                    </button>
                    <button onClick={() => setActiveTab('email-marketing')} className="bg-white p-4 rounded-lg shadow-sm text-center hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <Icon name="paper-plane" className="text-indigo-600 text-2xl" />
                        <span className="text-sm font-semibold text-gray-700">Email Campaign</span>
                    </button>
                     <button onClick={() => setActiveTab('backup-restore')} className="bg-white p-4 rounded-lg shadow-sm text-center hover:bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <Icon name="database" className="text-indigo-600 text-2xl" />
                        <span className="text-sm font-semibold text-gray-700">Backup Data</span>
                    </button>
                </div>
            </section>
            
            <AdStatusCheck setActiveTab={setActiveTab} />

            <section id="recent-activity">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Activity</h2>
                <div className="bg-white rounded-lg shadow-sm">
                    {recentLogs.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {recentLogs.map((log: ActivityLog) => (
                                <li key={log.id} className="p-4 flex items-start gap-4">
                                    <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                                        <Icon name="history" className="text-gray-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{log.action}: <span className="font-normal text-gray-600">{log.details}</span></p>
                                        <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-sm text-gray-500 text-center">No recent activity.</p>
                    )}
                    <div className="p-4 border-t text-center">
                        <button onClick={() => setActiveTab('security-logs')} className="text-sm font-semibold text-indigo-600 hover:underline">
                            View All Logs
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard;