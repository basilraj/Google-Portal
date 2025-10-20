
import React, { useState } from 'react';
import Icon from '../Icon';
import AdManagement from './AdManagement';
import SEOManagement from './SEOManagement';
import SocialMediaManagement from './SocialMediaManagement';
import EmailSettings from './EmailSettings';
import { useData } from '../../contexts/DataContext';

type SettingsTab = 'general' | 'seo' | 'ads' | 'social' | 'email';

const GeneralSettingsManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useData();
    const [formData, setFormData] = useState(generalSettings);
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateGeneralSettings(formData);
        setMessage('General settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-700">General Settings</h2>
             <div>
                <label className="block text-sm font-medium text-gray-700">Website Title</label>
                <input type="text" name="siteTitle" value={formData.siteTitle} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Website Icon URL</label>
                <input type="url" name="siteIconUrl" value={formData.siteIconUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://example.com/icon.png"/>
            </div>
             <div className="pt-4 border-t">
                <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                    <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleChange} className="h-4 w-4 rounded border-gray-300"/>
                    <div>
                        <span className="font-medium text-gray-700">Enable Maintenance Mode</span>
                        <p className="text-xs text-gray-500">When enabled, public visitors will only see the maintenance page.</p>
                    </div>
                </label>
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Maintenance Message</label>
                <textarea name="maintenanceMessage" value={formData.maintenanceMessage} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-100" disabled={!formData.maintenanceMode} />
            </div>
             <div className="pt-4 border-t">
                <label className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50">
                    <input type="checkbox" name="emailNotificationsEnabled" checked={formData.emailNotificationsEnabled} onChange={handleChange} className="h-4 w-4 rounded border-gray-300"/>
                    <div>
                        <span className="font-medium text-gray-700">Enable Email Notifications</span>
                        <p className="text-xs text-gray-500">Send email alerts to subscribers when new jobs are posted.</p>
                    </div>
                </label>
             </div>
            {message && <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm text-center">{message}</div>}
             <div className="flex justify-end pt-4 border-t">
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    <Icon name="save" /> Save General Settings
                </button>
            </div>
        </form>
    )
}


const SettingsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettingsManagement />;
            case 'seo':
                return <SEOManagement />;
            case 'ads':
                return <AdManagement />;
            case 'social':
                return <SocialMediaManagement />;
            case 'email':
                return <EmailSettings />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tabName: SettingsTab; label: string; icon: string }> = ({ tabName, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors w-full text-left ${
                activeTab === tabName
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
            }`}
        >
            <Icon name={icon} className="w-5" />
            <span>{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <aside className="md:w-64">
                <nav className="flex flex-row overflow-x-auto md:flex-col gap-1 p-2 bg-gray-50 rounded-lg">
                    <TabButton tabName="general" label="General" icon="cog" />
                    <TabButton tabName="seo" label="SEO" icon="search" />
                    <TabButton tabName="ads" label="Advertisements" icon="ad" />
                    <TabButton tabName="social" label="Social Media" icon="share-alt" />
                    <TabButton tabName="email" label="Email (SMTP)" icon="envelope" />
                </nav>
            </aside>
            <main className="flex-1">
                {renderTabContent()}
            </main>
        </div>
    );
};

export default SettingsManagement;
