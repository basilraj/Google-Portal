import React from 'react';
import { useData } from '../../contexts/DataContext';
import Icon from '../Icon';
import { Job, ContentPost } from '../../types';

const StatCard: React.FC<{ title: string; value: number; icon: string; color: string }> = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
        <div className={`w-16 h-16 rounded-md flex items-center justify-center text-white text-2xl ${color}`}>
            <Icon name={icon} />
        </div>
        <div>
            <h3 className="text-3xl font-bold text-[#1e3c72]">{value}</h3>
            <p className="text-gray-500">{title}</p>
        </div>
    </div>
);

const ActivityItem: React.FC<{ item: Job | ContentPost }> = ({ item }) => {
    const isJob = (item: any): item is Job => 'department' in item;
    const itemType = isJob(item) ? "New Job" : "New Post";
    const icon = isJob(item) ? "briefcase" : "file-alt";

    return (
        <li className="flex items-center space-x-4 py-2 border-b last:border-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isJob(item) ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                <Icon name={icon} />
            </div>
            <div className="flex-grow">
                <p className="text-sm text-gray-800 font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">{itemType} added on {new Date(item.createdAt!).toLocaleDateString()}</p>
            </div>
        </li>
    );
};

const Dashboard: React.FC = () => {
    const { jobs, quickLinks, posts, subscribers } = useData();

    const recentActivity = [...jobs, ...posts]
        .filter(item => item.createdAt)
        .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        .slice(0, 5);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard title="Active Jobs" value={jobs.length} icon="briefcase" color="bg-indigo-500" />
                    <StatCard title="Quick Links" value={quickLinks.length} icon="link" color="bg-red-500" />
                    <StatCard title="Content Posts" value={posts.length} icon="file-alt" color="bg-green-500" />
                    <StatCard title="Subscribers" value={subscribers.length} icon="users" color="bg-yellow-500" />
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Recent Activity</h3>
                {recentActivity.length > 0 ? (
                    <ul>
                        {recentActivity.map(item => <ActivityItem key={item.id} item={item} />)}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No recent activity to display.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
