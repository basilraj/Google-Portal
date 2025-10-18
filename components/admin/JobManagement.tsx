import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Job } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 10;

const JobForm: React.FC<{ job?: Job; onSave: (job: Omit<Job, 'id' | 'createdAt'>, id?: string) => void; onCancel: () => void }> = ({ job, onSave, onCancel }) => {
    const { jobCategories } = useData();
    const [formData, setFormData] = useState<Omit<Job, 'id' | 'createdAt'>>(job ? { ...job } : {
        title: '',
        department: jobCategories[0]?.name || '',
        qualification: '',
        lastDate: new Date().toISOString().split('T')[0],
        applyLink: '',
        description: '',
        status: 'active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, job?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Department/Category *</label>
                    <select name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                        {jobCategories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Qualification *</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Date to Apply *</label>
                    <input type="date" name="lastDate" value={formData.lastDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Application Link *</label>
                    <input type="url" name="applyLink" value={formData.applyLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                </select>
            </div>
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Save Job</button>
            </div>
        </form>
    );
};

const JobManagement: React.FC = () => {
    const { jobs, addJob, updateJob, deleteJob } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);

    const sortedJobs = useMemo(() =>
        [...jobs].sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()),
    [jobs]);

    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(sortedJobs, { itemsPerPage: ITEMS_PER_PAGE });

    const handleSave = (jobData: Omit<Job, 'id' | 'createdAt'>, id?: string) => {
        if (id) {
            const originalJob = jobs.find(j => j.id === id);
            if (originalJob) {
                updateJob({ ...originalJob, ...jobData, id });
            }
        } else {
            addJob(jobData);
        }
        setIsModalOpen(false);
        setEditingJob(undefined);
    };

    const handleEdit = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleDelete = (jobId: string) => {
        if (window.confirm('Are you sure you want to delete this job posting?')) {
            deleteJob(jobId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Job Postings</h2>
                <button onClick={() => { setEditingJob(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                    <Icon name="plus" /> Add New Job
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Last Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(job => (
                            <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                <td className="px-6 py-4">{job.department}</td>
                                <td className="px-6 py-4">{new Date(job.lastDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{job.status}</span>
                                </td>
                                <td className="px-6 py-4 flex gap-4">
                                    <button onClick={() => handleEdit(job)} className="text-yellow-500 hover:text-yellow-700"><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-700"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingJob ? 'Edit Job' : 'Add New Job'}>
                <JobForm job={editingJob} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default JobManagement;
