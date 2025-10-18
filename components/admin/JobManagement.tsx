
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { Job } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';
import { getEffectiveJobStatus } from '../../utils/jobUtils';

const ITEMS_PER_PAGE = 10;

type SortKey = keyof Job;
type SortDirection = 'ascending' | 'descending';

const EmptyState: React.FC<{ message: string; buttonText?: string; onButtonClick?: () => void; }> = ({ message, buttonText, onButtonClick }) => (
    <div className="text-center py-16 border-t">
      <Icon name="folder-open" className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600">{message}</h3>
      {buttonText && onButtonClick && (
        <button onClick={onButtonClick} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 mx-auto">
          <Icon name="plus" /> {buttonText}
        </button>
      )}
    </div>
);

const JobForm: React.FC<{ job?: Job; onSave: (job: Omit<Job, 'id'>, id?: string) => void; onCancel: () => void }> = ({ job, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Job, 'id' | 'createdAt'>>(job ? { ...job } : {
        title: '',
        department: '',
        description: '',
        qualification: '',
        vacancies: '',
        postedDate: new Date().toISOString().split('T')[0],
        lastDate: '',
        applyLink: '',
        status: 'active',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { createdAt, ...saveData } = formData as any;
        onSave(saveData, job?.id);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Department *</label>
                    <input type="text" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Qualification *</label>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Vacancies *</label>
                    <input type="text" name="vacancies" value={formData.vacancies} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Apply Link *</label>
                    <input type="url" name="applyLink" value={formData.applyLink} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Posted Date *</label>
                    <input type="date" name="postedDate" value={formData.postedDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Date to Apply *</label>
                    <input type="date" name="lastDate" value={formData.lastDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white" required>
                    <option value="active">Active</option>
                    <option value="closing-soon">Closing Soon</option>
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

const BulkUploadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
    errorMessages: string[];
}> = ({ isOpen, onClose, onUpload, errorMessages }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (file) {
            onUpload(file);
        }
    };

    const handleDownloadSample = () => {
        const headers = ['title', 'department', 'description', 'qualification', 'vacancies', 'postedDate', 'lastDate', 'applyLink'];
        const exampleRow = [
            '"SSC CGL Recruitment, 2025"', // Example with comma
            'Staff Selection Commission',
            '"Combined Graduate Level Examination for various Group B and C posts."',
            'Graduate',
            '5000',
            '2025-12-01',
            '2026-01-15',
            'https://ssc.nic.in'
        ];
        
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(',') + '\n' 
            + exampleRow.join(',');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sample_jobs.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Bulk Upload Jobs">
            <div className="space-y-4">
                <p className="text-sm text-gray-600">
                    Upload a CSV file to add multiple job listings at once. Fields containing commas must be enclosed in double quotes (e.g., "Job description, with a comma"). To include a double quote within a field, escape it with another double quote (e.g., "The job is ""great""").
                </p>
                <button
                    type="button"
                    onClick={handleDownloadSample}
                    className="text-sm text-indigo-600 hover:underline inline-flex items-center"
                >
                    <Icon name="download" className="mr-2" />
                    Download Sample CSV Template
                </button>
                 {errorMessages.length > 0 && (
                    <div className="mt-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm rounded-md">
                        <p className="font-bold mb-2">Please fix the following errors in your CSV file:</p>
                        <ul className="list-disc list-inside space-y-1">
                            {errorMessages.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload CSV File</label>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
                    />
                </div>
                <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                    <button
                        type="button"
                        onClick={handleUpload}
                        disabled={!file}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                    >
                        <Icon name="upload" className="mr-2" />
                        Upload & Save
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const parseCsvLine = (line: string): string[] => {
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    // Escaped quote
                    currentField += '"';
                    i++; // Skip the next quote
                } else {
                    // End of quoted field
                    inQuotes = false;
                }
            } else {
                currentField += char;
            }
        } else {
            if (char === '"') {
                inQuotes = true;
            } else if (char === ',') {
                fields.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
    }
    fields.push(currentField);
    return fields;
};


const JobManagement: React.FC = () => {
    const { jobs, addJob, updateJob, deleteJob, addMultipleJobs, deleteMultipleJobs } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<'all' | Job['status']>('all');
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [bulkUploadErrors, setBulkUploadErrors] = useState<string[]>([]);
    const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
    const [sortKey, setSortKey] = useState<SortKey>('createdAt');
    const [sortDirection, setSortDirection] = useState<SortDirection>('descending');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'ascending' ? 'descending' : 'ascending');
        } else {
            setSortKey(key);
            setSortDirection('ascending');
        }
    };
    
    const sortedJobs = useMemo(() => {
        return [...jobs].sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (aValue === undefined || bValue === undefined) return 0;

            if (sortKey === 'lastDate' || sortKey === 'postedDate' || sortKey === 'createdAt') {
                const dateA = new Date(aValue as string).getTime();
                const dateB = new Date(bValue as string).getTime();
                return sortDirection === 'ascending' ? dateA - dateB : dateB - dateA;
            }
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                if (aValue.toLowerCase() < bValue.toLowerCase()) return sortDirection === 'ascending' ? -1 : 1;
                if (aValue.toLowerCase() > bValue.toLowerCase()) return sortDirection === 'ascending' ? 1 : -1;
            }
            
            return 0;
        });
    }, [jobs, sortKey, sortDirection]);
    
    const filteredJobs = useMemo(() => {
        if (statusFilter === 'all') {
            return sortedJobs;
        }
        return sortedJobs.filter(job => getEffectiveJobStatus(job) === statusFilter);
    }, [sortedJobs, statusFilter]);
    
    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(filteredJobs, { itemsPerPage: ITEMS_PER_PAGE });

    useEffect(() => {
        setSelectedJobIds([]);
    }, [currentPage, statusFilter, sortKey, sortDirection]);

    const handleSave = (jobData: Omit<Job, 'id'>, id?: string) => {
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
        if (window.confirm('Are you sure you want to delete this job?')) {
            deleteJob(jobId);
        }
    };
    
    const handleBulkUpload = (file: File) => {
        setBulkUploadErrors([]);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (!text) {
                setBulkUploadErrors(['File is empty or could not be read.']);
                return;
            }

            const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
            if (lines.length <= 1) {
                setBulkUploadErrors(['CSV file must contain a header and at least one data row.']);
                return;
            }
            
            const errors: string[] = [];
            const jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[] = [];
            const headerLine = lines[0];
            const headers = parseCsvLine(headerLine).map(h => h.trim());
            
            const requiredHeaders = ['title', 'department', 'description', 'qualification', 'vacancies', 'postedDate', 'lastDate', 'applyLink'];
            if (JSON.stringify(headers) !== JSON.stringify(requiredHeaders)) {
                 setBulkUploadErrors([`Invalid CSV header. Expected: ${requiredHeaders.join(',')}`]);
                 return;
            }

            lines.slice(1).forEach((line, index) => {
                const rowNum = index + 2;
                const values = parseCsvLine(line);

                if (values.length !== headers.length) {
                    errors.push(`Line ${rowNum}: Incorrect number of columns. Expected ${headers.length}, found ${values.length}.`);
                    return; // Skip this row
                }

                const jobEntry = headers.reduce((obj, header, i) => {
                    obj[header as keyof typeof obj] = values[i];
                    return obj;
                }, {} as any);
                
                // Validation
                if (!jobEntry.title) errors.push(`Line ${rowNum}: 'title' is required.`);
                if (!jobEntry.department) errors.push(`Line ${rowNum}: 'department' is required.`);
                if (!jobEntry.postedDate) errors.push(`Line ${rowNum}: 'postedDate' is required.`);
                if (jobEntry.postedDate && isNaN(new Date(jobEntry.postedDate).getTime())) {
                    errors.push(`Line ${rowNum}: Invalid format for 'postedDate'. Please use YYYY-MM-DD.`);
                }
                if (!jobEntry.lastDate) errors.push(`Line ${rowNum}: 'lastDate' is required.`);
                if (jobEntry.lastDate && isNaN(new Date(jobEntry.lastDate).getTime())) {
                    errors.push(`Line ${rowNum}: Invalid format for 'lastDate'. Please use YYYY-MM-DD.`);
                }

                if (errors.length === 0) {
                    jobsData.push(jobEntry);
                }
            });
            
            if (errors.length > 0) {
                setBulkUploadErrors(errors);
            } else {
                const addedCount = addMultipleJobs(jobsData);
                alert(`${addedCount} jobs have been successfully uploaded.`);
                setIsBulkUploadModalOpen(false);
            }
        };
        reader.onerror = () => {
             setBulkUploadErrors(['Failed to read the file.']);
        };
        reader.readAsText(file);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedJobIds(paginatedData.map(job => job.id));
        } else {
            setSelectedJobIds([]);
        }
    };

    const handleSelectOne = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        if (e.target.checked) {
            setSelectedJobIds(prev => [...prev, id]);
        } else {
            setSelectedJobIds(prev => prev.filter(jobId => jobId !== id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedJobIds.length === 0) {
            alert('Please select at least one job to delete.');
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${selectedJobIds.length} selected job(s)?`)) {
            deleteMultipleJobs(selectedJobIds);
            setSelectedJobIds([]);
        }
    };

    const SortableHeader: React.FC<{ columnKey: SortKey; title: string; className?: string }> = ({ columnKey, title, className }) => (
        <th className={`px-6 py-3 cursor-pointer ${className}`} onClick={() => handleSort(columnKey)}>
            <div className="flex items-center gap-2">
                {title}
                {sortKey === columnKey && (
                    <Icon name={sortDirection === 'ascending' ? 'sort-up' : 'sort-down'} />
                )}
            </div>
        </th>
    );

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                 <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-gray-700">Job Listings</h2>
                    {selectedJobIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-red-700 transition-colors"
                        >
                            <Icon name="trash" /> Delete ({selectedJobIds.length})
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    >
                        <option value="all">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="closing-soon">Closing Soon</option>
                        <option value="expired">Expired</option>
                    </select>
                    <button onClick={() => { setIsBulkUploadModalOpen(true); setBulkUploadErrors([]); }} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-green-700">
                        <Icon name="upload" /> Bulk Upload
                    </button>
                    <button onClick={() => { setEditingJob(undefined); setIsModalOpen(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700">
                        <Icon name="plus" /> Add New Job
                    </button>
                </div>
            </div>
            {paginatedData.length > 0 ? (
            <>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 responsive-table">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="p-4 w-4">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={paginatedData.length > 0 && selectedJobIds.length === paginatedData.length}
                                        className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                </th>
                                <SortableHeader columnKey="title" title="Title" />
                                <SortableHeader columnKey="department" title="Department" />
                                <SortableHeader columnKey="lastDate" title="Last Date" />
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map(job => {
                                const effectiveStatus = getEffectiveJobStatus(job);
                                return (
                                <tr key={job.id} className={`bg-white hover:bg-gray-50 ${selectedJobIds.includes(job.id) ? 'bg-indigo-50' : 'border-b'}`}>
                                    <td data-label="Select" className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedJobIds.includes(job.id)}
                                            onChange={(e) => handleSelectOne(e, job.id)}
                                            className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                    </td>
                                    <td data-label="Title" className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                    <td data-label="Department" className="px-6 py-4">{job.department}</td>
                                    <td data-label="Last Date" className="px-6 py-4">{job.lastDate}</td>
                                    <td data-label="Status" className="px-6 py-4">
                                         <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${effectiveStatus === 'active' ? 'bg-green-100 text-green-800' : effectiveStatus === 'closing-soon' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{effectiveStatus.replace('-', ' ')}</span>
                                    </td>
                                    <td data-label="Actions" className="px-6 py-4 flex gap-4 actions-cell">
                                        <button onClick={() => handleEdit(job)} className="text-yellow-500 hover:text-yellow-700" aria-label={`Edit job: ${job.title}`}><Icon name="edit" /></button>
                                        <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:text-red-700" aria-label={`Delete job: ${job.title}`}><Icon name="trash" /></button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            </>
            ) : (
                <EmptyState 
                    message="No jobs found."
                    buttonText="Add New Job"
                    onButtonClick={() => { setEditingJob(undefined); setIsModalOpen(true); }}
                />
            )}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingJob ? 'Edit Job' : 'Add New Job'}>
                <JobForm job={editingJob} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>
            <BulkUploadModal
                isOpen={isBulkUploadModalOpen}
                onClose={() => { setIsBulkUploadModalOpen(false); setBulkUploadErrors([]); }}
                onUpload={handleBulkUpload}
                errorMessages={bulkUploadErrors}
            />
        </div>
    );
};

export default JobManagement;
