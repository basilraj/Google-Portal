import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { GeneralSettings } from '../../types';
import Icon from '../Icon';

const SettingsManagement: React.FC = () => {
    const { generalSettings, updateGeneralSettings } = useData();
    const [formData, setFormData] = useState<GeneralSettings>(generalSettings);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFormData(generalSettings);
    }, [generalSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateGeneralSettings(formData);
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-6">General Website Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Maintenance Mode</h3>
                    <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <label htmlFor="maintenanceMode" className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="maintenanceMode"
                                    name="maintenanceMode"
                                    checked={formData.maintenanceMode}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <div className={`block w-14 h-8 rounded-full ${formData.maintenanceMode ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.maintenanceMode ? 'translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-gray-700">
                                <span className="font-medium">Enable Maintenance Mode</span>
                                <p className="text-xs text-gray-500">When enabled, only the admin login page will be accessible. Public pages will show a maintenance message.</p>
                            </div>
                        </label>
                    </div>
                </div>

                <div>
                    <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">Maintenance Message</label>
                    <textarea
                        id="maintenanceMessage"
                        name="maintenanceMessage"
                        rows={4}
                        value={formData.maintenanceMessage}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="e.g., Our website is currently undergoing scheduled maintenance..."
                    />
                     <p className="text-xs text-gray-500 mt-1">This message will be displayed to visitors when maintenance mode is active.</p>
                </div>
                
                {message && (
                    <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm text-center">
                        {message}
                    </div>
                )}

                <div className="flex justify-end pt-4 border-t mt-6">
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                        <Icon name="save" /> Save General Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;
