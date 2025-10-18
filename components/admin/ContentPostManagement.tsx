import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ContentPost, PostType } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';

const PostForm: React.FC<{ post?: ContentPost; onSave: (post: Omit<ContentPost, 'id'>, id?: string) => void; onCancel: () => void }> = ({ post, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<ContentPost, 'id'>>(post ? { ...post } : {
        title: '', category: '', content: '', status: 'published', type: 'posts', publishedDate: new Date().toISOString().split('T')[0]
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
                    <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Post Type *</label>
                    <select name="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                        <option value="posts">Regular Post</option>
                        <option value="exam-notices">Exam Notice</option>
                        <option value="results">Result</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Content *</label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Published Date *</label>
                    <input type="date" name="publishedDate" value={formData.publishedDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status *</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Post</button>
            </div>
        </form>
    );
};

const PostTable: React.FC<{ posts: ContentPost[]; onEdit: (post: ContentPost) => void; onDelete: (postId: string) => void; }> = ({ posts, onEdit, onDelete }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th className="px-6 py-3">Title</th><th className="px-6 py-3">Category</th><th className="px-6 py-3">Published Date</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.map(post => (
                    <tr key={post.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                        <td className="px-6 py-4">{post.category}</td>
                        <td className="px-6 py-4">{post.publishedDate}</td>
                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{post.status}</span></td>
                        <td className="px-6 py-4 flex gap-4">
                            <button onClick={() => onEdit(post)} className="text-yellow-500 hover:text-yellow-700"><Icon name="edit" /></button>
                            <button onClick={() => onDelete(post.id)} className="text-red-500 hover:text-red-700"><Icon name="trash" /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ContentPostManagement: React.FC = () => {
    const { posts, addPost, updatePost, deletePost } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<ContentPost | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<PostType>('posts');

    const handleSave = (postData: Omit<ContentPost, 'id'>, id?: string) => {
        if (id) {
            updatePost({ ...postData, id });
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

    const filteredPosts = posts.filter(p => p.type === activeTab);
    const tabs: {id: PostType, name: string}[] = [{id: 'posts', name: 'Posts'}, {id: 'exam-notices', name: 'Exam Notices'}, {id: 'results', name: 'Results'}];

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">All Content</h2>
                <button onClick={() => { setEditingPost(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                    <Icon name="plus" /> Add New Content
                </button>
            </div>
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`${activeTab === tab.id ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-4">
                <PostTable posts={filteredPosts} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPost ? 'Edit Content Post' : 'Add New Content Post'}>
                <PostForm post={editingPost} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default ContentPostManagement;
