import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { QuickLink } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';

const EmptyState: React.FC<{ message: string; buttonText?: string; onButtonClick?: () => void; }> = ({ message, buttonText, onButtonClick }) => (
    <div className="text-center py-16 border-t">
      <Icon name="link-slash" className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600">{message}</h3>
      {buttonText && onButtonClick && (
        <button onClick={onButtonClick} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 mx-auto">
          <Icon name="plus" /> {buttonText}
        </button>
      )}
    </div>
);

const QuickLinkForm: React.FC<{ link?: QuickLink; onSave: (link: Omit<QuickLink, 'id'>, id?: string) => void; onCancel: () => void }> = ({ link, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<QuickLink, 'id'>>(link ? { ...link } : {
        title: '',
        category: 'Category',
        url: '',
        description: '',
        status: 'active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, link?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Link Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Link URL *</label>
                    <input type="url" name="url" value={formData.url} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
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
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Link</button>
            </div>
        </form>
    );
};

const QuickLinkManagement: React.FC = () => {
    const { quickLinks, addQuickLink, updateQuickLink, deleteQuickLink } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<QuickLink | undefined>(undefined);

    const handleSave = (linkData: Omit<QuickLink, 'id'>, id?: string) => {
        if (id) {
            updateQuickLink({ ...linkData, id });
        } else {
            addQuickLink(linkData);
        }
        setIsModalOpen(false);
        setEditingLink(undefined);
    };

    const handleEdit = (link: QuickLink) => {
        setEditingLink(link);
        setIsModalOpen(true);
    };

    const handleDelete = (linkId: string) => {
        if (window.confirm('Are you sure you want to delete this quick link?')) {
            deleteQuickLink(linkId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Quick Links</h2>
                <button onClick={() => { setEditingLink(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                    <Icon name="plus" /> Add New Link
                </button>
            </div>
            {quickLinks.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 responsive-table">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">URL</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quickLinks.map(link => (
                            <tr key={link.id} className="bg-white hover:bg-gray-50 border-b">
                                <td data-label="Title" className="px-6 py-4 font-medium text-gray-900">{link.title}</td>
                                <td data-label="URL" className="px-6 py-4 truncate max-w-xs"><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{link.url}</a></td>
                                <td data-label="Status" className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${link.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{link.status}</span>
                                </td>
                                <td data-label="Actions" className="px-6 py-4 flex gap-4 actions-cell">
                                    <button onClick={() => handleEdit(link)} className="text-yellow-500 hover:text-yellow-700" aria-label={`Edit link: ${link.title}`}><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(link.id)} className="text-red-500 hover:text-red-700" aria-label={`Delete link: ${link.title}`}><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : (
                <EmptyState 
                    message="No quick links have been added yet."
                    buttonText="Add New Link"
                    onButtonClick={() => { setEditingLink(undefined); setIsModalOpen(true); }}
                />
            )}
             <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingLink ? 'Edit Quick Link' : 'Add New Quick Link'}>
                <QuickLinkForm link={editingLink} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default QuickLinkManagement;