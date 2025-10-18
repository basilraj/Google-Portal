import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { GeneralSettings } from '../../types';
import Icon from '../Icon';

const GeneralSettings: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useData();
    const [formData, setFormData] = useState<GeneralSettings>(generalSettings);

    useEffect(() => {
        setFormData(generalSettings);
    }, [generalSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateGeneralSettings(formData);
        // You might want a success notification here
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
             <h2 className="text-xl font-bold text-gray-700 border-b pb-3">General Site Settings</h2>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Site Title</label>
                <input type="text" name="siteTitle" value={formData.siteTitle} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700">Site Description</label>
                <textarea name="siteDescription" value={formData.siteDescription} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                    <input type="text" name="logoUrl" value={formData.logoUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://example.com/logo.png" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Favicon URL</label>
                    <input type="text" name="faviconUrl" value={formData.faviconUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://example.com/favicon.ico" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Footer Text</label>
                <input type="text" name="footerText" value={formData.footerText} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            <div className="flex justify-end pt-4 border-t">
                 <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    <Icon name="save" /> Save Settings
                </button>
            </div>
        </form>
    );
};

export default GeneralSettings;
