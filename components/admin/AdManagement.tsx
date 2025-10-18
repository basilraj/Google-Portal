import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { AdSettings } from '../../types';
import Icon from '../Icon';

type NetworkTab = 'adsense' | 'adsterra' | 'custom';

const AdManagement: React.FC = () => {
    const { adSettings, updateAdSettings } = useData();
    const [formData, setFormData] = useState<AdSettings>(adSettings);
    const [activeNetworkTab, setActiveNetworkTab] = useState<NetworkTab>('adsense');

    useEffect(() => {
        setFormData(adSettings);
    }, [adSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        
        // Handle nested state for network settings
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev as any)[parent],
                    [child]: type === 'checkbox' ? checked : value,
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateAdSettings(formData);
    };
    
    const renderNetworkConfig = () => {
        switch(activeNetworkTab) {
            case 'adsense':
                return (
                    <div className="space-y-4">
                        <label className="flex items-center gap-3">
                             <input type="checkbox" name="adsense.enabled" checked={formData.adsense.enabled} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                            <span>Enable Google AdSense</span>
                        </label>
                        {formData.adsense.enabled && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Publisher ID</label>
                            <input type="text" name="adsense.publisherId" value={formData.adsense.publisherId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="pub-XXXXXXXXXXXXXX" />
                        </div>
                        )}
                    </div>
                );
            case 'adsterra':
                 return (
                    <div className="space-y-4">
                         <label className="flex items-center gap-3">
                             <input type="checkbox" name="adsterra.enabled" checked={formData.adsterra.enabled} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                            <span>Enable Adsterra</span>
                        </label>
                        {formData.adsterra.enabled && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zone ID</label>
                            <input type="text" name="adsterra.zoneId" value={formData.adsterra.zoneId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Enter your Zone ID" />
                        </div>
                        )}
                    </div>
                );
            case 'custom':
                 return (
                    <div className="space-y-4">
                         <label className="flex items-center gap-3">
                            <input type="checkbox" name="customAds.enabled" checked={formData.customAds.enabled} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/>
                            <span>Enable Custom Ads</span>
                        </label>
                        {formData.customAds.enabled && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Custom Ad Code (HTML/JS)</label>
                            <textarea name="customAds.code" value={formData.customAds.code} onChange={handleChange} rows={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm" placeholder="Paste your custom ad code here..."/>
                        </div>
                        )}
                    </div>
                );
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Ad Display Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Ad Display Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ad Frequency</label>
                        <select name="adFrequency" value={formData.adFrequency} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                            <option value="low">Low (Every 5 posts)</option>
                            <option value="medium">Medium (Every 3 posts)</option>
                            <option value="high">High (Every post)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ad Scheduling</label>
                        <div className="flex items-center gap-2 mt-1">
                            <input type="time" name="adStartTime" value={formData.adStartTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                            <span>to</span>
                            <input type="time" name="adEndTime" value={formData.adEndTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Ad Types to Show</label>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                            <label className="flex items-center gap-2"><input type="checkbox" name="bannerAds" checked={formData.bannerAds} onChange={handleChange} /> Banner Ads</label>
                            <label className="flex items-center gap-2"><input type="checkbox" name="squareAds" checked={formData.squareAds} onChange={handleChange} /> Square Ads</label>
                            <label className="flex items-center gap-2"><input type="checkbox" name="skyscraperAds" checked={formData.skyscraperAds} onChange={handleChange} /> Skyscraper Ads</label>
                            <label className="flex items-center gap-2"><input type="checkbox" name="popupAds" checked={formData.popupAds} onChange={handleChange} /> Popup Ads</label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ad Previews */}
             <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold text-gray-700 mb-2">Ad Previews</h2>
                 <p className="text-sm text-gray-500 mb-6">See a live preview of your ad selections. Previews will appear/disappear as you check/uncheck the boxes above.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                        {formData.bannerAds && (
                            <div>
                                <h3 className="font-semibold mb-2">Banner Ad</h3>
                                <div className="h-24 bg-gray-100 border-2 border-dashed flex items-center justify-center text-gray-500 text-sm">Banner Preview (e.g., 728x90)</div>
                            </div>
                        )}
                        {formData.squareAds && (
                            <div>
                                <h3 className="font-semibold mb-2">Square Ad</h3>
                                <div className="h-64 w-72 bg-gray-100 border-2 border-dashed flex items-center justify-center text-gray-500 text-sm">Square Preview (e.g., 300x250)</div>
                            </div>
                        )}
                    </div>
                    <div className="space-y-8 flex flex-col items-center lg:items-start">
                        {formData.skyscraperAds && (
                             <div>
                                <h3 className="font-semibold mb-2">Skyscraper Ad</h3>
                                <div className="h-[600px] w-40 bg-gray-100 border-2 border-dashed flex items-center justify-center text-gray-500 text-sm text-center">Skyscraper Preview (e.g., 160x600)</div>
                            </div>
                        )}
                        {formData.popupAds && (
                            <div className="mt-8">
                                <h3 className="font-semibold mb-2 text-center">Popup Ad</h3>
                                <div className="relative w-80 p-6 bg-white border rounded-lg shadow-xl">
                                    <button type="button" className="absolute top-2 right-2 text-gray-400 text-2xl">&times;</button>
                                    <h4 className="font-bold text-lg text-center mb-2">Popup Ad Title</h4>
                                    <p className="text-sm text-gray-600 text-center mb-4">This is a preview of a popup ad.</p>
                                    <button type="button" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">Call to Action</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
             </div>

            {/* Ad Networks Configuration */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Ad Networks Configuration</h2>
                 <div className="border-b border-gray-200 mb-4">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <button type="button" onClick={() => setActiveNetworkTab('adsense')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeNetworkTab === 'adsense' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>AdSense</button>
                        <button type="button" onClick={() => setActiveNetworkTab('adsterra')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeNetworkTab === 'adsterra' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Adsterra</button>
                        <button type="button" onClick={() => setActiveNetworkTab('custom')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeNetworkTab === 'custom' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Custom Ads</button>
                    </nav>
                </div>
                <div>{renderNetworkConfig()}</div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t">
                <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-md hover:bg-indigo-700 text-lg font-semibold flex items-center gap-2">
                    <Icon name="save" /> Save All Ad Settings
                </button>
            </div>
        </form>
    );
};

export default AdManagement;
