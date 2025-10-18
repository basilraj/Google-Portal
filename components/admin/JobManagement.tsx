import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Job } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';

const JobManagement: React.FC = () => {
    const { jobs, addJob, updateJob, deleteJob } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState<Job | null>(null);

    const paginated = usePagination(jobs, { itemsPerPage: 10 });

    const openModal = (job: Job | null = null) => {
        setCurrentJob(job);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentJob(null);
    };

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Are you sure you want to delete the job "${title}"?`)) {
            deleteJob(id);
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-700">Manage Job Posts</h2>
                <button onClick={() => openModal()} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                    <Icon name="plus" /> Add New Job
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Department</th>
                            <th className="px-6 py-3">Post Date</th>
                            <th className="px-6 py-3">Last Date</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.paginatedData.map(job => (
                            <tr key={job.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                <td className="px-6 py-4">{job.department}</td>
                                <td className="px-6 py-4">{job.postDate}</td>
                                <td className="px-6 py-4">{job.lastDate}</td>
                                <td className="px-6 py-4 flex items-center gap-4">
                                    <button onClick={() => openModal(job)} className="text-indigo-600 hover:text-indigo-900"><Icon name="edit" /></button>
                                    <button onClick={() => handleDelete(job.id, job.title)} className="text-red-600 hover:text-red-900"><Icon name="trash" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={paginated.currentPage} totalPages={paginated.totalPages} onPageChange={paginated.goToPage} />
            <JobFormModal isOpen={isModalOpen} onClose={closeModal} job={currentJob} addJob={addJob} updateJob={updateJob} />
        </div>
    );
};

interface JobFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    job: Job | null;
    addJob: (job: Omit<Job, 'id'>) => void;
    updateJob: (job: Job) => void;
}

const JobFormModal: React.FC<JobFormModalProps> = ({ isOpen, onClose, job, addJob, updateJob }) => {
    const [formData, setFormData] = useState<Omit<Job, 'id' | 'importantLinks' | 'tags'>>({
        title: '', department: '', postDate: '', lastDate: '', shortInfo: '', content: ''
    });
    
    React.useEffect(() => {
        if (job) {
            setFormData({
                title: job.title,
                department: job.department,
                postDate: job.postDate,
                lastDate: job.lastDate,
                shortInfo: job.shortInfo,
                content: job.content,
                isFeatured: job.isFeatured || false
            });
        } else {
             setFormData({
                title: '', department: '', postDate: '', lastDate: '', shortInfo: '', content: '', isFeatured: false
            });
        }
    }, [job, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const jobData = {
            ...formData,
            // These would be handled by a more complex form
            tags: ['tag1', 'tag2'],
            importantLinks: [{label: 'Official Website', url: '#'}],
        };
        if (job) {
            updateJob({ ...job, ...jobData });
        } else {
            addJob(jobData);
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={job ? 'Edit Job Post' : 'Add New Job Post'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Simplified form fields for brevity */}
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" className="w-full p-2 border rounded" required />
                <input name="department" value={formData.department} onChange={handleChange} placeholder="Department" className="w-full p-2 border rounded" />
                <input name="postDate" type="date" value={formData.postDate} onChange={handleChange} className="w-full p-2 border rounded" />
                <input name="lastDate" type="date" value={formData.lastDate} onChange={handleChange} className="w-full p-2 border rounded" />
                <textarea name="shortInfo" value={formData.shortInfo} onChange={handleChange} placeholder="Short Info" className="w-full p-2 border rounded" rows={3}></textarea>
                <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Full Content (HTML/Markdown)" className="w-full p-2 border rounded" rows={6}></textarea>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="isFeatured" checked={!!formData.isFeatured} onChange={handleChange} />
                  <span>Feature this job post</span>
                </label>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">{job ? 'Update' : 'Save'}</button>
                </div>
            </form>
        </Modal>
    );
};

export default JobManagement;
