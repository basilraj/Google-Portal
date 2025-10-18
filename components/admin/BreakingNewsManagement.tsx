import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { BreakingNews } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';

const NewsForm: React.FC<{ newsItem?: BreakingNews; onSave: (news: Omit<BreakingNews, 'id'>, id?: string) => void; onCancel: () => void }> = ({ newsItem, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<BreakingNews, 'id'>>(newsItem ? { ...newsItem } : {
        text: '', link: '', status: 'active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, newsItem?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">News Text *</label>
                <input type="text" name="text" value={formData.text} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Link URL</label>
                    <input type="url" name="link" value={formData.link} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://example.com/news-story" />
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
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save News</button>
            </div>
        </form>
    );
};


const BreakingNewsManagement: React.FC = () => {
    const { breakingNews, addNews, updateNews, deleteNews } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<BreakingNews | undefined>(undefined);

    const handleSave = (newsData: Omit<BreakingNews, 'id'>, id?: string) => {
        if (id) {
            updateNews({ ...newsData, id });
        } else {
            addNews(newsData);
        }
        setIsModalOpen(false);
        setEditingNews(undefined);
    };

    const handleEdit = (news: BreakingNews) => {
        setEditingNews(news);
        setIsModalOpen(true);
    };

    const handleDelete = (newsId: string) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            deleteNews(newsId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Breaking News Ticker</h2>
                <button onClick={() => { setEditingNews(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                    <Icon name="plus" /> Add News Item
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">News Text</th>
                            <th className="px-6 py-3">Link</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {breakingNews.map(news => (
                            <tr key={news.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{news.text}</td>
                                <td className="px-6 py-4 truncate max-w-xs"><a href={news.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{news.link}</a></td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${news.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{news.status}</span>
                                </td>
                                <td className="px-6 py-4 flex gap-4">
                                    <button onClick={() => handleEdit(news)} className="text-yellow-500 hover:text-yellow-700"><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(news.id)} className="text-red-500 hover:text-red-700"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingNews ? 'Edit News Item' : 'Add News Item'}>
                <NewsForm newsItem={editingNews} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default BreakingNewsManagement;
