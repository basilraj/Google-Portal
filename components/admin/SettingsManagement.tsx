
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
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateGeneralSettings(formData);
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-6">General Site Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className={`p-4 rounded-lg transition-all ${formData.maintenanceMode ? 'bg-yellow-100 border border-yellow-300' : 'bg-gray-50 border'}`}>
                    <label className="flex items-center justify-between cursor-pointer">
                        <div>
                            <span className="text-lg font-semibold text-gray-800">Maintenance Mode</span>
                            <p className="text-sm text-gray-600">When enabled, the public site will be replaced by a maintenance page. Admins can still log in.</p>
                        </div>
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={formData.maintenanceMode}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-14 h-8 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                        </div>
                    </label>
                </div>
                
                <div>
                    <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700">Maintenance Message</label>
                    <textarea
                        id="maintenanceMessage"
                        name="maintenanceMessage"
                        value={formData.maintenanceMessage}
                        onChange={handleChange}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="We'll be back soon..."
                    />
                    <p className="text-xs text-gray-500 mt-1">This message will be displayed on the maintenance page.</p>
                </div>
                
                {message && (
                    <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm text-center">
                        {message}
                    </div>
                )}
                
                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                        <Icon name="save" /> Save Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsManagement;
