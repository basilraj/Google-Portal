
import React from 'react';
import { useData } from '../../contexts/DataContext.tsx';
import Icon from '../Icon.tsx';
import { Job, Subscriber, ContentPost, ContactSubmission } from '../../types.ts';

type AdminTab = 'dashboard' | 'jobs' | 'posts' | 'exam-notices' | 'results' | 'quick-links' | 'breaking-news' | 'subscribers' | 'contacts' | 'email-marketing' | 'notification-history' | 'settings' | 'profile' | 'backup-restore' | 'security-logs';

interface StatCardProps {
  icon: string;
  title: string;
  value: number | string;
  color: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color, onClick }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-md flex items-center gap-6 ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all' : ''}`}
    onClick={onClick}
  >
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${color}`}>
      <Icon name={icon} className="text-white text-3xl" />
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard: React.FC<{ setActiveTab: (tab: AdminTab) => void; }> = ({ setActiveTab }) => {
    const { jobs, subscribers, posts, contacts } = useData();

    const activeJobs = jobs.filter(job => job.status === 'active' || job.status === 'closing-soon').length;
    const totalSubscribers = subscribers.length;
    const totalPosts = posts.filter(p => p.type === 'posts').length;
    const newMessages = contacts.length;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="briefcase" title="Active Jobs" value={activeJobs} color="bg-blue-500" onClick={() => setActiveTab('jobs')} />
                <StatCard icon="users" title="Subscribers" value={totalSubscribers} color="bg-green-500" onClick={() => setActiveTab('subscribers')} />
                <StatCard icon="file-alt" title="Blog Posts" value={totalPosts} color="bg-purple-500" onClick={() => setActiveTab('posts')} />
                <StatCard icon="envelope" title="New Messages" value={newMessages} color="bg-yellow-500" onClick={() => setActiveTab('contacts')} />
            </div>
        </div>
    );
};

export default Dashboard;
