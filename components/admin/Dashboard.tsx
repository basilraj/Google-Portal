import React from 'react';
import { useData } from '../../contexts/DataContext';
import Icon from '../Icon';

const StatCard: React.FC<{ icon: string; title: string; value: number | string; color: string }> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon name={icon} className="text-white text-xl" />
        </div>
        <div className="ml-4">
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    const { jobs, subscribers, quickLinks, contentPosts } = useData();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="briefcase" title="Total Job Posts" value={jobs.length} color="bg-blue-500" />
                <StatCard icon="users" title="Total Subscribers" value={subscribers.length} color="bg-green-500" />
                <StatCard icon="link" title="Total Quick Links" value={quickLinks.length} color="bg-yellow-500" />
                <StatCard icon="file-alt" title="Total Content Posts" value={contentPosts.length} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Job Posts</h3>
                    <ul className="space-y-3">
                        {jobs.slice(0, 5).map(job => (
                            <li key={job.id} className="flex justify-between items-center text-sm pb-2 border-b border-gray-100">
                                <span className="text-gray-800 font-medium">{job.title}</span>
                                <span className="text-gray-500">{job.postDate}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Recent Subscribers</h3>
                     <ul className="space-y-3">
                        {subscribers.slice(-5).reverse().map(sub => (
                             <li key={sub.id} className="flex justify-between items-center text-sm pb-2 border-b border-gray-100">
                                <span className="text-gray-800">{sub.email}</span>
                                <span className="text-gray-500">{sub.subscriptionDate}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
