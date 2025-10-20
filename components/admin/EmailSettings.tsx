import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { SMTPSettings } from '../../types';
import Icon from '../Icon';

const EmailSettings: React.FC = () => {
    const { smtpSettings, updateSmtpSettings } = useData();
    const [formData, setFormData] = useState<SMTPSettings>(smtpSettings);
    const [message, setMessage] = useState('');

    useEffect(() => {
        setFormData(smtpSettings);
    }, [smtpSettings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'port' ? parseInt(value) || 0 : value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateSmtpSettings({ ...formData, configured: true }); // Mark as configured on save
        setMessage('SMTP settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Email Server (SMTP) Settings</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <Icon name="exclamation-triangle" className="text-yellow-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Currently, email sending is a <strong className="font-semibold">simulation</strong>. To send real emails, you must configure your SMTP server details below.
                        </p>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SMTP Host</label>
                        <input type="text" name="host" value={formData.host} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="smtp.example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SMTP Port</label>
                        <input type="number" name="port" value={formData.port} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="587" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">SMTP User</label>
                    <input type="text" name="user" value={formData.user} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="your-email@example.com" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">SMTP Password</label>
                    <input type="password" name="pass" value={formData.pass} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="••••••••" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">"From" Email</label>
                        <input type="email" name="fromEmail" value={formData.fromEmail} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="no-reply@yourdomain.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">"From" Name</label>
                        <input type="text" name="fromName" value={formData.fromName} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md" placeholder="Jobtica Portal" />
                    </div>
                </div>
                 <div>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" name="secure" checked={formData.secure} onChange={handleChange} className="h-4 w-4 rounded border-gray-300"/>
                        <span className="text-sm font-medium text-gray-700">Use SSL/TLS (Secure Connection)</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Usually checked for port 465.</p>
                </div>

                {message && <div className="p-3 bg-green-100 text-green-800 rounded-md text-sm text-center">{message}</div>}

                <div className="flex justify-end pt-4 border-t mt-6">
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                        <Icon name="save" /> Save SMTP Settings
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EmailSettings;