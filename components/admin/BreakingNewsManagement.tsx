import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { BreakingNews } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';

const BreakingNewsManagement: React.FC = () => {
    const { breakingNews, addBreakingNews, updateBreakingNews, deleteBreakingNews } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentNews, setCurrentNews] = useState<BreakingNews | null>(null);

    const openModal = (news: BreakingNews | null = null) => {
        setCurrentNews(news);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentNews(null);
    };

    const handleDelete = (id: string, text: string) => {
        if (window.confirm(`Are you sure you want to delete the news item "${text}"?`)) {
            deleteBreakingNews(id);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Manage Breaking News</h2>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    <Icon name="plus" /> Add News Item
                </button>
            </div>
            <div className="space-y-3">
                {breakingNews.map(news => (
                    <div key={news.id} className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50">
                        <div>
                            <p className="font-medium text-gray-800">{news.text}</p>
                            <a href={news.link} className="text-sm text-blue-500 hover:underline">{news.link}</a>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${news.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {news.isActive ? 'Active' : 'Inactive'}
                            </span>
                             <button onClick={() => openModal(news)} className="text-indigo-600 hover:text-indigo-900"><Icon name="edit" /></button>
                             <button onClick={() => handleDelete(news.id, news.text)} className="text-red-600 hover:text-red-900"><Icon name="trash" /></button>
                        </div>
                    </div>
                ))}
            </div>
            <BreakingNewsFormModal isOpen={isModalOpen} onClose={closeModal} newsItem={currentNews} addBreakingNews={addBreakingNews} updateBreakingNews={updateBreakingNews} />
        </div>
    );
};

interface BreakingNewsFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    newsItem: BreakingNews | null;
    addBreakingNews: (news: Omit<BreakingNews, 'id'>) => void;
    updateBreakingNews: (news: BreakingNews) => void;
}

const BreakingNewsFormModal: React.FC<BreakingNewsFormModalProps> = ({ isOpen, onClose, newsItem, addBreakingNews, updateBreakingNews }) => {
    const [formData, setFormData] = useState({ text: '', link: '', isActive: true });

    React.useEffect(() => {
        setFormData(newsItem ? { text: newsItem.text, link: newsItem.link, isActive: newsItem.isActive } : { text: '', link: '#', isActive: true });
    }, [newsItem, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newsItem) {
            updateBreakingNews({ ...newsItem, ...formData });
        } else {
            addBreakingNews(formData);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={newsItem ? 'Edit News Item' : 'Add News Item'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea name="text" value={formData.text} onChange={e => setFormData(p => ({...p, text: e.target.value}))} placeholder="News Text" className="w-full p-2 border rounded" rows={3} required />
                <input name="link" value={formData.link} onChange={handleChange} placeholder="Link URL" className="w-full p-2 border rounded" required />
                <label className="flex items-center gap-2">
                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                    <span>Set as active</span>
                </label>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{newsItem ? 'Update' : 'Save'}</button>
                </div>
            </form>
        </Modal>
    );
};

export default BreakingNewsManagement;
