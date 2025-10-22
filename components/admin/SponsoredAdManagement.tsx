import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext.tsx';
import { SponsoredAd } from '../../types.ts';
import Icon from '../Icon.tsx';
import Modal from '../Modal.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';
import { useAuth } from '../../contexts/AuthContext.tsx';

const EmptyState: React.FC<{ message: string; buttonText?: string; onButtonClick?: () => void; }> = ({ message, buttonText, onButtonClick }) => (
    <div className="text-center py-16 border-t">
      <Icon name="dollar-sign" className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600">{message}</h3>
      {buttonText && onButtonClick && (
        <button onClick={onButtonClick} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 mx-auto">
          <Icon name="plus" /> {buttonText}
        </button>
      )}
    </div>
);

const SponsoredAdForm: React.FC<{ ad?: SponsoredAd; onSave: (ad: Omit<SponsoredAd, 'id'>, id?: string) => void; onCancel: () => void; }> = ({ ad, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<SponsoredAd, 'id'>>(ad ? { ...ad } : {
        imageUrl: '',
        destinationUrl: '',
        placement: 'sidebar-top',
        status: 'active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, ad?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Image</label>
                <div className="mt-2 flex items-center gap-4">
                    {formData.imageUrl ? (
                        <img src={formData.imageUrl} alt="Preview" className="h-24 w-auto object-contain rounded-md border p-1 bg-gray-100" />
                    ) : (
                        <div className="h-24 w-32 bg-gray-100 rounded-md flex items-center justify-center border">
                            <Icon name="image" className="text-3xl text-gray-400" />
                        </div>
                    )}
                    <div className="flex-grow">
                        <input id="image-upload-input" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <label htmlFor="image-upload-input" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Upload Image
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Or paste URL below</p>
                    </div>
                </div>
                <input 
                    type="url" 
                    name="imageUrl" 
                    value={formData.imageUrl || ''} 
                    onChange={handleChange} 
                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md" 
                    placeholder="https://example.com/ad-image.jpg"
                    required
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Destination URL *</label>
                <input type="url" name="destinationUrl" value={formData.destinationUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Placement</label>
                     <select name="placement" value={formData.placement} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                        <option value="sidebar-top">Sidebar (Top)</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Status *</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Ad</button>
            </div>
        </form>
    );
};

const SponsoredAdManagement: React.FC = () => {
    const { sponsoredAds, addSponsoredAd, updateSponsoredAd, deleteSponsoredAd, securitySettings, demoUserSettings } = useData();
    const { isDemoUser } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAd, setEditingAd] = useState<SponsoredAd | undefined>(undefined);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [confirmProps, setConfirmProps] = useState<{title: string, message: React.ReactNode, onConfirm: () => void, confirmText?: string, confirmButtonClass?: string}>({
        title: '', message: '', onConfirm: () => {}
    });

    const canManage = !isDemoUser || demoUserSettings.canManageAds;

    const openConfirmModal = (props: Partial<typeof confirmProps>) => {
        setConfirmProps(prev => ({ ...prev, ...props }));
        setIsConfirmModalOpen(true);
    };

    const handleSave = (adData: Omit<SponsoredAd, 'id'>, id?: string) => {
        if (!canManage) return;
        const adToUpdate = sponsoredAds.find(ad => ad.id === id);
        if (id && adToUpdate) {
            updateSponsoredAd({ ...adData, id, clicks: adToUpdate.clicks || 0 });
        } else {
            addSponsoredAd(adData);
        }
        setIsModalOpen(false);
        setEditingAd(undefined);
    };

    const handleEdit = (ad: SponsoredAd) => {
        if (!canManage) return;
        setEditingAd(ad);
        setIsModalOpen(true);
    };

    const handleDeleteRequest = (ad: SponsoredAd) => {
        if (!canManage) return;
        openConfirmModal({
            title: 'Confirm Deletion',
            message: <>Are you sure you want to delete this sponsored ad?</>,
            onConfirm: () => {
                deleteSponsoredAd(ad.id);
                setIsConfirmModalOpen(false);
            },
            confirmText: 'Delete',
            confirmButtonClass: 'bg-red-600 hover:bg-red-700'
        });
    };

    const handleExternalLinkClick = (e: React.MouseEvent, url: string) => {
        e.preventDefault();
        if (securitySettings.warnOnExternalLink) {
            openConfirmModal({
                title: 'External Link Warning',
                message: <>You are about to navigate to an external website: <strong>{url}</strong>. Do you wish to continue?</>,
                onConfirm: () => {
                    window.open(url, '_blank', 'noopener,noreferrer');
                    setIsConfirmModalOpen(false);
                },
                confirmText: 'Proceed',
                confirmButtonClass: 'bg-blue-600 hover:bg-blue-700'
            });
        } else {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Sponsored Ads</h2>
                {canManage && (
                    <button onClick={() => { setEditingAd(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                        <Icon name="plus" /> Add New Ad
                    </button>
                )}
            </div>
            {sponsoredAds.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 responsive-table">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Ad Image</th>
                            <th className="px-6 py-3">Destination</th>
                            <th className="px-6 py-3">Placement</th>
                            <th className="px-6 py-3">Clicks</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sponsoredAds.map(ad => (
                            <tr key={ad.id} className="bg-white hover:bg-gray-50 border-b">
                                <td data-label="Image" className="px-6 py-4">
                                    <img src={ad.imageUrl} alt="Ad" className="h-12 w-24 object-contain rounded-md bg-gray-100" />
                                </td>
                                <td data-label="Destination" className="px-6 py-4 truncate max-w-xs"><a href={ad.destinationUrl} onClick={(e) => handleExternalLinkClick(e, ad.destinationUrl)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{ad.destinationUrl}</a></td>
                                <td data-label="Placement" className="px-6 py-4">{ad.placement}</td>
                                <td data-label="Clicks" className="px-6 py-4 font-medium">{ad.clicks || 0}</td>
                                <td data-label="Status" className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${ad.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{ad.status}</span>
                                </td>
                                <td data-label="Actions" className="px-6 py-4 flex gap-4 actions-cell">
                                    {canManage && (
                                        <>
                                            <button onClick={() => handleEdit(ad)} className="text-yellow-500 hover:text-yellow-700" aria-label={`Edit ad`}><Icon name="edit" /></button>
                                            <button onClick={() => handleDeleteRequest(ad)} className="text-red-500 hover:text-red-700" aria-label={`Delete ad`}><Icon name="trash" /></button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : (
                <EmptyState 
                    message="No sponsored ads have been created yet."
                    buttonText={canManage ? "Add New Ad" : undefined}
                    onButtonClick={canManage ? () => { setEditingAd(undefined); setIsModalOpen(true); } : undefined}
                />
            )}
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAd ? 'Edit Sponsored Ad' : 'Add New Sponsored Ad'}>
                <SponsoredAdForm ad={editingAd} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                {...confirmProps}
            />
        </div>
    );
};

export default SponsoredAdManagement;