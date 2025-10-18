import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { JobCategory } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';

const CategoryForm: React.FC<{ category?: JobCategory; onSave: (category: Omit<JobCategory, 'id'>, id?: string) => void; onCancel: () => void }> = ({ category, onSave, onCancel }) => {
    const [name, setName] = useState(category ? category.name : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSave({ name }, category?.id);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Category Name *</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                />
            </div>
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Category</button>
            </div>
        </form>
    );
};

const JobCategoryManagement: React.FC = () => {
    const { jobCategories, addJobCategory, updateJobCategory, deleteJobCategory } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<JobCategory | undefined>(undefined);

    const handleSave = (categoryData: Omit<JobCategory, 'id'>, id?: string) => {
        if (id) {
            updateJobCategory({ ...categoryData, id });
        } else {
            addJobCategory(categoryData);
        }
        setIsModalOpen(false);
        setEditingCategory(undefined);
    };

    const handleEdit = (category: JobCategory) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleDelete = (categoryId: string) => {
        if (window.confirm('Are you sure you want to delete this category? This might affect existing job posts.')) {
            deleteJobCategory(categoryId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Job Categories</h2>
                <button
                    onClick={() => { setEditingCategory(undefined); setIsModalOpen(true); }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Icon name="plus" /> Add New Category
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Category Name</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobCategories.map(cat => (
                            <tr key={cat.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                                <td className="px-6 py-4 flex gap-4">
                                    <button onClick={() => handleEdit(cat)} className="text-yellow-500 hover:text-yellow-700"><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-red-700"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCategory ? 'Edit Category' : 'Add New Category'}>
                <CategoryForm category={editingCategory} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default JobCategoryManagement;
