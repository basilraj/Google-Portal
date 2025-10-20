import React from 'react';
import { useData } from '../../contexts/DataContext';
import Icon from '../Icon';

const StatCard: React.FC<{ title: string; value: string | number; icon: string; color: string; onClick?: () => void }> = ({ title, value, icon, color, onClick }) => (
    <div onClick={onClick} className={`bg-white p-4 rounded-lg shadow-sm flex items-center gap-4 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1 transition-transform' : ''}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${color}`}>
            <Icon name={icon} />
        </div>
        <div>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className="text-sm text-gray-500">{title}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ data: { label: string; value: number }[]; color: string }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="h-48 flex items-end justify-around space-x-2">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                        className={`${color} w-full rounded-t-sm`}
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                        title={`${item.label}: ${item.value}`}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

const PieChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let cumulativePercent = 0;
    const segments = data.map(item => {
        const percent = (item.value / total) * 100;
        const start = cumulativePercent;
        cumulativePercent += percent;
        return `conic-gradient(${item.color} ${start}% ${cumulativePercent}%, transparent ${cumulativePercent}%)`;
    });

    return (
        <div className="flex items-center gap-6">
            <div className="w-32 h-32 rounded-full relative" style={{ background: segments.reverse().join(',') }}>
                <div className="absolute inset-2 bg-gray-50 rounded-full"></div>
            </div>
            <ul className="space-y-2 text-sm">
                {data.map(item => (
                    <li key={item.label} className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                        <span>{item.label} ({item.value})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const QuickActionButton: React.FC<{ label: string; icon: string; onClick: () => void; }> = ({ label, icon, onClick }) => (
    <button onClick={onClick} className="w-full bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 p-3 rounded-md flex items-center gap-3 transition-colors">
        <Icon name={icon} className="text-indigo-500" />
        <span className="font-semibold">{label}</span>
    </button>
);


const Dashboard: React.FC<{ setActiveTab: (tab: any) => void }> = ({ setActiveTab }) => {
    const { jobs, posts, subscribers, adSettings, generalSettings } = useData();

    // Simulated data for charts
    const jobsLast7Days = [
        { label: 'S', value: 2 }, { label: 'M', value: 5 }, { label: 'T', value: 3 },
        { label: 'W', value: 8 }, { label: 'T', value: 4 }, { label: 'F', value: 6 }, { label: 'S', value: 9 },
    ];
    const contentData = [
        { label: 'General Posts', value: posts.filter(p => p.type === 'posts').length, color: 'bg-blue-500' },
        { label: 'Exam Notices', value: posts.filter(p => p.type === 'exam-notices').length, color: 'bg-yellow-500' },
        { label: 'Results', value: posts.filter(p => p.type === 'results').length, color: 'bg-green-500' },
    ];
    
    const totalActiveAds = (adSettings.headerAdEnabled ? 1:0) + (adSettings.sidebarAdEnabled ? 1:0) + (adSettings.footerAdEnabled ? 1:0);

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Jobs" value={jobs.length} icon="briefcase" color="bg-indigo-500" onClick={() => setActiveTab('jobs')} />
                <StatCard title="Total Posts" value={posts.length} icon="file-alt" color="bg-green-500" onClick={() => setActiveTab('posts')} />
                <StatCard title="Subscribers" value={subscribers.length} icon="users" color="bg-yellow-500" onClick={() => setActiveTab('subscribers')} />
                <StatCard title="Active Ads" value={totalActiveAds} icon="ad" color="bg-red-500" onClick={() => setActiveTab('ads')} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">Portal Statistics (Last 7 Days)</h3>
                    <BarChart data={jobsLast7Days} color="bg-indigo-500" />
                </div>
                <div className="space-y-6">
                     <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-bold text-gray-700 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <QuickActionButton label="Manage Job Listings" icon="briefcase" onClick={() => setActiveTab('jobs')} />
                            <QuickActionButton label="Manage Content Posts" icon="file-alt" onClick={() => setActiveTab('posts')} />
                            <QuickActionButton label="Manage Subscribers" icon="users" onClick={() => setActiveTab('subscribers')} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                     <h3 className="text-xl font-bold text-gray-700 mb-4">Content Overview</h3>
                     <PieChart data={contentData} />
                </div>
                 <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
                     <h3 className="text-xl font-bold text-gray-700 mb-4">System Health</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">API Status</span>
                            <span className="font-semibold text-green-600 flex items-center gap-2"><Icon name="check-circle" /> Operational</span>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Email Notifications</span>
                            {generalSettings.emailNotificationsEnabled ? (
                                <span className="font-semibold text-green-600 flex items-center gap-2"><Icon name="check-circle" /> Active</span>
                            ) : (
                                <span className="font-semibold text-red-600 flex items-center gap-2"><Icon name="times-circle" /> Inactive</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Ad System Status</span>
                            {adSettings.headerAdEnabled || adSettings.sidebarAdEnabled || adSettings.footerAdEnabled ? (
                                <span className="font-semibold text-green-600 flex items-center gap-2"><Icon name="check-circle" /> Active</span>
                            ) : (
                                <span className="font-semibold text-red-600 flex items-center gap-2"><Icon name="times-circle" /> Inactive</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">New Subscriptions (24h)</span>
                            <span className="font-semibold text-gray-800">2 (Simulated)</span>
                        </div>
                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-600">Last Backup</span>
                             <span className="font-semibold text-gray-800">Today (Automatic)</span>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;