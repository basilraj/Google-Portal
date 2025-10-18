import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { ContentPost } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 10;

const PostForm: React.FC<{ post?: ContentPost; onSave: (post: Omit<ContentPost, 'id' | 'createdAt'>, id?: string) => void; onCancel: () => void }> = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<ContentPost, 'id' | 'createdAt'>>(post ? { ...post } : {
        title: '',
        category: 'Preparation Tips',
        content: '',
        status: 'published',
        type: 'posts',
        publishedDate: new Date().toISOString().split('T')[0],
        examDate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, post?.id);
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Post Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required placeholder="e.g., Preparation Tips, Exam Updates" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Post Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                        <option value="posts">Blog Post</option>
                        <option value="exam-notices">Exam Notice</option>
                        <option value="results">Results</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Content *</label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={10} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Published Date *</label>
                    <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Exam Date (if applicable)</label>
                    <input type="date" name="examDate" value={formData.examDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Post</button>
            </div>
        </form>
    );
};

const ContentPostManagement: React.FC = () => {
    const { posts, addPost, updatePost, deletePost } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<ContentPost | undefined>(undefined);
    const [typeFilter, setTypeFilter] = useState<'all' | ContentPost['type']>('all');

    const sortedPosts = useMemo(() =>
        [...posts].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()),
    [posts]);

    const filteredPosts = useMemo(() => {
        if (typeFilter === 'all') {
            return sortedPosts;
        }
        return sortedPosts.filter(post => post.type === typeFilter);
    }, [sortedPosts, typeFilter]);

    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(filteredPosts, { itemsPerPage: ITEMS_PER_PAGE });

    const handleSave = (postData: Omit<ContentPost, 'id' | 'createdAt'>, id?: string) => {
        if (id) {
            const originalPost = posts.find(p => p.id === id);
            if (originalPost) {
                updatePost({ ...originalPost, ...postData, id });
            }
        } else {
            addPost(postData);
        }
        setIsModalOpen(false);
        setEditingPost(undefined);
    };

    const handleEdit = (post: ContentPost) => {
        setEditingPost(post);
        setIsModalOpen(true);
    };

    const handleDelete = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            deletePost(postId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                <h2 className="text-xl font-bold text-gray-700">Content Posts</h2>
                <div className="flex items-center gap-4">
                     <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    >
                        <option value="all">All Types</option>
                        <option value="posts">Blog Post</option>
                        <option value="exam-notices">Exam Notice</option>
                        <option value="results">Results</option>
                    </select>
                    <button onClick={() => { setEditingPost(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                        <Icon name="plus" /> Add New Post
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Published Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(post => (
                            <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                                <td className="px-6 py-4 capitalize">{post.type.replace('-', ' ')}</td>
                                <td className="px-6 py-4">{post.category}</td>
                                <td className="px-6 py-4">{post.publishedDate}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{post.status}</span>
                                </td>
                                <td className="px-6 py-4 flex gap-4">
                                    <button onClick={() => handleEdit(post)} className="text-yellow-500 hover:text-yellow-700"><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(post.id)} className="text-red-500 hover:text-red-700"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPost ? 'Edit Post' : 'Add New Post'}>
                <PostForm post={editingPost} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ContentPostManagement;
