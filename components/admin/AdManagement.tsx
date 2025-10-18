import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { AdSettings } from '../../types';

const AdManagement: React.FC = () => {
    const { adSettings, updateAdSettings } = useData();
    const [settings, setSettings] = useState<AdSettings>(adSettings);

    const handleFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings({ ...settings, adFrequency: e.target.value as AdSettings['adFrequency'] });
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setSettings({
            ...settings,
            adTypes: { ...settings.adTypes, [name]: checked },
        });
    };

    const handleScheduleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings({
            ...settings,
            adScheduling: { ...settings.adScheduling, [name]: value },
        });
    }

    const handleSave = () => {
        updateAdSettings(settings);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-700 border-b pb-3 mb-4">Ad Display Settings</h2>
                <div className="space-y-4">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Ad Frequency</label>
                        <select value={settings.adFrequency} onChange={handleFrequencyChange} className="mt-1 block w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md bg-white">
                            <option value="low">Low (Every 5 posts)</option>
                            <option value="medium">Medium (Every 3 posts)</option>
                            <option value="high">High (Every post)</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Ad Types to Show</label>
                        <div className="mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
                            <label className="inline-flex items-center"><input type="checkbox" name="banner" checked={settings.adTypes.banner} onChange={handleTypeChange} className="form-checkbox" /> <span className="ml-2">Banner Ads</span></label>
                            <label className="inline-flex items-center"><input type="checkbox" name="square" checked={settings.adTypes.square} onChange={handleTypeChange} className="form-checkbox" /> <span className="ml-2">Square Ads</span></label>
                            <label className="inline-flex items-center"><input type="checkbox" name="skyscraper" checked={settings.adTypes.skyscraper} onChange={handleTypeChange} className="form-checkbox" /> <span className="ml-2">Skyscraper Ads</span></label>
                            <label className="inline-flex items-center"><input type="checkbox" name="popup" checked={settings.adTypes.popup} onChange={handleTypeChange} className="form-checkbox" /> <span className="ml-2">Popup Ads</span></label>
                        </div>
                    </div>
                    
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700">Ad Scheduling</label>
                        <div className="mt-2 flex items-center gap-4">
                            <input type="time" name="start" value={settings.adScheduling.start} onChange={handleScheduleChange} className="px-3 py-2 border border-gray-300 rounded-md" />
                            <span>to</span>
                            <input type="time" name="end" value={settings.adScheduling.end} onChange={handleScheduleChange} className="px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">Save Display Settings</button>
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-700 border-b pb-3 mb-4">Ad Previews</h2>
                <p className="text-sm text-gray-500 mb-6">See a live preview of your ad selections. Previews will appear/disappear as you check/uncheck the boxes above.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        {settings.adTypes.banner && (
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-2">Banner Ad</h3>
                                <div className="w-full h-24 bg-gray-200 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400 text-gray-500">
                                    <span>Banner Preview (e.g., 728x90)</span>
                                </div>
                            </div>
                        )}
                        {settings.adTypes.square && (
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-2">Square Ad</h3>
                                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400 text-gray-500 mx-auto lg:mx-0">
                                    <span>Square Preview (e.g., 300x250)</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-8">
                        {settings.adTypes.skyscraper && (
                             <div>
                                <h3 className="font-semibold text-gray-600 mb-2">Skyscraper Ad</h3>
                                <div className="w-40 h-[400px] bg-gray-200 flex items-center justify-center rounded-md border-2 border-dashed border-gray-400 text-gray-500 mx-auto">
                                    <span className="text-center">Skyscraper Preview (e.g., 160x600)</span>
                                </div>
                            </div>
                        )}
                        {settings.adTypes.popup && (
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-2">Popup Ad</h3>
                                <div className="relative w-80 h-64 bg-white shadow-lg rounded-lg border p-4 flex flex-col justify-between mx-auto border-gray-300">
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-800">Popup Ad Title</h4>
                                        <button className="text-gray-400 text-2xl">&times;</button>
                                    </div>
                                    <div className="text-center text-gray-500">
                                        <p>This is a preview of a popup ad.</p>
                                    </div>
                                    <button className="w-full bg-blue-500 text-white py-2 rounded-md">Call to Action</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-700 border-b pb-3 mb-4">Ad Networks Configuration</h2>
                 <p className="text-gray-600">This section is a placeholder for configuring specific ad networks like AdSense or Adsterra.</p>
            </div>
        </div>
    );
};

export default AdManagement;
