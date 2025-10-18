import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { QuickLink } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import { QUICK_LINK_CATEGORIES } from '../../constants';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';

const QuickLinkManagement: React.FC = () => {
    const { quickLinks, addQuickLink, updateQuickLink, deleteQuickLink } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentLink, setCurrentLink] = useState<QuickLink | null>(null);

    const paginated = usePagination(quickLinks, { itemsPerPage: 10 });

    const openModal = (link: QuickLink | null = null) => {
        setCurrentLink(link);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentLink(null);
    };

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete the link "${title}"?`)) {
            deleteQuickLink(id);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Manage Quick Links</h2>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    <Icon name="plus" /> Add New Link
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">URL</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.paginatedData.map(link => (
                            <tr key={link.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{link.title}</td>
                                <td className="px-6 py-4">{link.category}</td>
                                <td className="px-6 py-4"><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{link.url}</a></td>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => openModal(link)} className="text-indigo-600 hover:text-indigo-900"><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(link.id, link.title)} className="text-red-600 hover:text-red-900"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={paginated.currentPage} totalPages={paginated.totalPages} onPageChange={paginated.goToPage} />
            <QuickLinkFormModal isOpen={isModalOpen} onClose={closeModal} link={currentLink} addQuickLink={addQuickLink} updateQuickLink={updateQuickLink} />
        </div>
    );
};

interface QuickLinkFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    link: QuickLink | null;
    addQuickLink: (link: Omit<QuickLink, 'id'>) => void;
    updateQuickLink: (link: QuickLink) => void;
}

const QuickLinkFormModal: React.FC<QuickLinkFormModalProps> = ({ isOpen, onClose, link, addQuickLink, updateQuickLink }) => {
    const [formData, setFormData] = useState({ title: '', url: '', category: QUICK_LINK_CATEGORIES[0] as 'Admit Card' | 'Result' | 'Latest Jobs' | 'Answer Key' | 'Syllabus' });
    
    React.useEffect(() => {
        setFormData(link ? { title: link.title, url: link.url, category: link.category } : { title: '', url: '#', category: QUICK_LINK_CATEGORIES[0] as 'Admit Card' | 'Result' | 'Latest Jobs' | 'Answer Key' | 'Syllabus' });
    }, [link, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (link) {
            updateQuickLink({ ...link, ...formData });
        } else {
            addQuickLink(formData);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={link ? 'Edit Quick Link' : 'Add New Quick Link'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Link Title" className="w-full p-2 border rounded" required />
                <input name="url" value={formData.url} onChange={handleChange} placeholder="URL" className="w-full p-2 border rounded" required />
                <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                    {QUICK_LINK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{link ? 'Update' : 'Save'}</button>
                </div>
            </form>
        </Modal>
    );
};

export default QuickLinkManagement;
