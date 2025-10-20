import React, { useState, useEffect } from 'react';
import Icon from '../Icon';
import AdManagement from './AdManagement';
import SEOManagement from './SEOManagement';
import SocialMediaManagement from './SocialMediaManagement';
import EmailSettings from './EmailSettings';
import { useData } from '../../contexts/DataContext';
import { GeneralSettings } from '../../types';

type SettingsTab = 'general' | 'ads' | 'seo' | 'social' | 'email';

const GeneralSettingsManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useData();
    const [formData, setFormData] = useState<GeneralSettings>(generalSettings);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFormData(generalSettings);
    }, [generalSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateGeneralSettings(formData);
        setMessage('General settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Website Title</label>
                    <input type="text" name="siteTitle" value={formData.siteTitle} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                    <p className="text-xs text-gray-500 mt-1">Used in the admin panel and as a fallback.</p>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Website Icon URL</label>
                    <input type="text" name="siteIconUrl" value={formData.siteIconUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="/logo.png"/>
                     <p className="text-xs text-gray-500 mt-1">Provide a relative or absolute URL to the site icon.</p>
                </div>

                <div className="pt-6 border-t">
                    <label className="flex items-center gap-3 p-3 rounded-md border">
                        <input type="checkbox" name="emailNotificationsEnabled" checked={formData.emailNotificationsEnabled} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                        <div>
                            <span className="font-medium">Enable Email Notifications</span>
                            <p className="text-xs text-gray-500">Send email alerts to subscribers when a new job is posted.</p>
                        </div>
                    </label>
                </div>
                
                <div className="pt-6 border-t">
                    <label className="flex items-center gap-3 p-3 rounded-md border">
                        <input type="checkbox" name="maintenanceMode" checked={formData.maintenanceMode} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                        <div>
                            <span className="font-medium">Enable Maintenance Mode</span>
                            <p className="text-xs text-gray-500">When enabled, the public website will be inaccessible and will show a maintenance page.</p>
                        </div>
                    </label>
                    {formData.maintenanceMode && (
                         <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700">Maintenance Message</label>
                            <textarea name="maintenanceMessage" value={formData.maintenanceMessage} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/>
                        </div>
                    )}
                </div>

                {message && <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm text-center">{message}</div>}

                 <div className="flex justify-end pt-4">
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                        <Icon name="save" /> Save General Settings
                    </button>
                </div>
            </form>
        </div>
    );
}

const SettingsManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');

    const renderContent = () => {
        switch (activeTab) {
            case 'general': return <GeneralSettingsManagement />;
            case 'ads': return <AdManagement />;
            case 'seo': return <SEOManagement />;
            case 'social': return <SocialMediaManagement />;
            case 'email': return <EmailSettings />;
            default: return <GeneralSettingsManagement />;
        }
    };

    const navItems = [
        { key: 'general', label: 'General', icon: 'cogs' },
        { key: 'ads', label: 'Advertisements', icon: 'ad' },
        { key: 'seo', label: 'SEO', icon: 'search' },
        { key: 'social', label: 'Social Media', icon: 'share-alt' },
        { key: 'email', label: 'Email (SMTP)', icon: 'server' },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 px-2">Settings Menu</h3>
                <nav className="space-y-1 bg-white p-2 rounded-lg shadow-sm">
                    {navItems.map(item => (
                         <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key as SettingsTab)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md text-left ${
                                activeTab === item.key ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Icon name={item.icon} className="w-5 text-gray-500" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
            <div className="md:w-3/4">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsManagement;
