import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ContentPost } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';
import { CONTENT_POST_CATEGORIES } from '../../constants';

const ContentPostManagement: React.FC = () => {
    const { contentPosts, addContentPost, updateContentPost, deleteContentPost } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPost, setCurrentPost] = useState<ContentPost | null>(null);

    const paginated = usePagination(contentPosts, { itemsPerPage: 10 });

    const openModal = (post: ContentPost | null = null) => {
        setCurrentPost(post);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentPost(null);
    };

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete the post "${title}"?`)) {
            deleteContentPost(id);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Manage Content Posts</h2>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    <Icon name="plus" /> Add New Post
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Author</th>
                            <th className="px-6 py-3">Publish Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.paginatedData.map(post => (
                            <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                <td className="px-6 py-4">{post.category}</td>
                                <td className="px-6 py-4">{post.author}</td>
                                <td className="px-6 py-4">{post.publishDate}</td>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => openModal(post)} className="text-indigo-600 hover:text-indigo-900"><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(post.id, post.title)} className="text-red-600 hover:text-red-900"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={paginated.currentPage} totalPages={paginated.totalPages} onPageChange={paginated.goToPage} />
            <ContentPostFormModal isOpen={isModalOpen} onClose={closeModal} post={currentPost} addContentPost={addContentPost} updateContentPost={updateContentPost} />
        </div>
    );
};

interface ContentPostFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: ContentPost | null;
    addContentPost: (post: Omit<ContentPost, 'id'>) => void;
    updateContentPost: (post: ContentPost) => void;
}

const ContentPostFormModal: React.FC<ContentPostFormModalProps> = ({ isOpen, onClose, post, addContentPost, updateContentPost }) => {
    const [formData, setFormData] = useState({ title: '', content: '', author: 'Admin', category: CONTENT_POST_CATEGORIES[0] as 'Blog' | 'News' | 'Updates' });

    React.useEffect(() => {
        if (post) {
            setFormData({ title: post.title, content: post.content, author: post.author, category: post.category });
        } else {
            setFormData({ title: '', content: '', author: 'Admin', category: CONTENT_POST_CATEGORIES[0] as 'Blog' | 'News' | 'Updates' });
        }
    }, [post, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const postData = {
            ...formData,
            publishDate: new Date().toISOString().split('T')[0],
            tags: [],
        };
        if (post) {
            updateContentPost({ ...post, ...postData });
        } else {
            addContentPost(postData);
        }
        onClose();
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={post ? 'Edit Post' : 'Add New Post'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Post Title" className="w-full p-2 border rounded" required />
                 <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                    {CONTENT_POST_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content (HTML/Markdown)" className="w-full p-2 border rounded" rows={8}></textarea>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{post ? 'Update' : 'Save'}</button>
                </div>
            </form>
        </Modal>
    );
}

export default ContentPostManagement;
