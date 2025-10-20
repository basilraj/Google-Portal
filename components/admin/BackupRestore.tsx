
import React, { useState } from 'react';
// Fix: Add .tsx extension to local module import.
import { useData } from '../../contexts/DataContext.tsx';
// Fix: Add .ts extension to local module import.
import { BackupData } from '../../types.ts';
// Fix: Add .tsx extension to local module import.
import Icon from '../Icon.tsx';

const BackupRestore: React.FC = () => {
    const { createBackup, restoreBackup } = useData();
    const [restoreMessage, setRestoreMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleCreateBackup = () => {
        const backupData = createBackup();
        const jsonString = JSON.stringify(backupData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const timestamp = new Date().toISOString().replace(/:/g, '-').slice(0, 19);
        link.download = `sarkari-portal-backup-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRestoreMessage(null);
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/json') {
            setRestoreMessage({ type: 'error', text: 'Invalid file type. Please upload a .json backup file.' });
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const data = JSON.parse(text) as BackupData;
                
                if (window.confirm('Are you sure you want to restore data from this backup? This will overwrite ALL current data and cannot be undone.')) {
                    const success = restoreBackup(data);
                    if (success) {
                        setRestoreMessage({ type: 'success', text: 'Data restored successfully! The page will now reload.' });
                        setTimeout(() => window.location.reload(), 2000);
                    } else {
                        throw new Error('Backup data is not in the expected format.');
                    }
                }
            } catch (error) {
                console.error("Restore failed:", error);
                setRestoreMessage({ type: 'error', text: 'Restore failed. The backup file may be corrupted or in an invalid format.' });
            } finally {
                // Reset file input
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-700 mb-6">Backup & Restore</h2>
            
            {/* Backup Section */}
            <div className="p-4 border rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Create Backup</h3>
                <p className="text-sm text-gray-600 mb-4">Download a single JSON file containing all your website's data, including jobs, posts, subscribers, and settings. Keep this file in a safe place.</p>
                <button
                    onClick={handleCreateBackup}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Icon name="download" /> Download Backup File
                </button>
            </div>

            {/* Restore Section */}
            <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Restore from Backup</h3>
                <p className="text-sm text-red-700 mb-4">
                    <strong className="font-bold">Warning:</strong> Restoring from a backup will completely replace all current data on your website. This action is irreversible. It's recommended to create a fresh backup before restoring.
                </p>
                <div>
                    <label htmlFor="restore-file-input" className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-700 cursor-pointer w-fit">
                        <Icon name="upload" /> Choose Backup File (.json)
                    </label>
                    <input
                        id="restore-file-input"
                        type="file"
                        accept=".json"
                        onChange={handleRestore}
                        className="hidden"
                    />
                </div>
                {restoreMessage && (
                    <div className={`mt-4 p-3 rounded-md text-sm text-center ${restoreMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {restoreMessage.text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BackupRestore;
