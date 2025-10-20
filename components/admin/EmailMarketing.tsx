import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { CustomEmail } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 5;

const EmailMarketing: React.FC = () => {
    const { customEmails, sendCustomEmail, deleteCustomEmail, subscribers, smtpSettings } = useData();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<CustomEmail | null>(null);
    
    const sortedEmails = [...customEmails].sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(sortedEmails, { itemsPerPage: ITEMS_PER_PAGE });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !body) {
            alert('Please fill in both subject and body.');
            return;
        }
        if (window.confirm(`Are you sure you want to send this email to all ${subscribers.filter(s => s.status === 'active').length} active subscribers?`)) {
            sendCustomEmail(subject, body);
            setSubject('');
            setBody('');
        }
    };

    const handleViewEmail = (email: CustomEmail) => {
        setSelectedEmail(email);
        setIsModalOpen(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Composer */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Compose Email Campaign</h2>
                {!smtpSettings.configured && (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                        <p className="text-sm text-yellow-700">
                            <strong>Warning:</strong> Email server is not configured. Emails will be simulated and added to history but <strong className="font-semibold">will not be sent</strong>.
                        </p>
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Email Subject</label>
                        <input
                            type="text"
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-gray-700">Email Body</label>
                        <textarea
                            id="body"
                            rows={10}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Write your email content here. HTML is not supported."
                            required
                        />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                            <Icon name="paper-plane" /> Send to All Subscribers
                        </button>
                    </div>
                </form>
            </div>

            {/* Sent Emails History */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold text-gray-700 mb-4">Sent Campaigns History</h2>
                 {paginatedData.length > 0 ? (
                    <>
                        <div className="space-y-3">
                            {paginatedData.map(email => (
                                <div key={email.id} className="border p-3 rounded-md hover:bg-gray-50 flex justify-between items-center gap-2">
                                    <div>
                                        <p className="font-semibold text-gray-800">{email.subject}</p>
                                        <p className="text-xs text-gray-500">Sent: {new Date(email.sentAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex-shrink-0 flex gap-3">
                                        <button onClick={() => handleViewEmail(email)} className="text-blue-500 hover:text-blue-700" title="View Email"><Icon name="eye" /></button>
                                        <button onClick={() => deleteCustomEmail(email.id)} className="text-red-500 hover:text-red-700" title="Delete Record"><Icon name="trash" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
                    </>
                 ) : (
                    <div className="text-center py-10">
                        <Icon name="history" className="text-4xl text-gray-300 mb-3" />
                        <p className="text-sm text-gray-500">No custom emails have been sent yet.</p>
                    </div>
                 )}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sent Email Details">
                {selectedEmail && (
                    <div className="space-y-4">
                        <div>
                            <strong className="block text-sm text-gray-500">Subject:</strong>
                            <p>{selectedEmail.subject}</p>
                        </div>
                        <div>
                            <strong className="block text-sm text-gray-500">Sent:</strong>
                            <p>{new Date(selectedEmail.sentAt).toLocaleString()}</p>
                        </div>
                        <hr/>
                        <div>
                            <strong className="block text-sm text-gray-500">Email Body:</strong>
                            <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md mt-1">{selectedEmail.body}</p>
                        </div>
                         <div className="flex justify-end pt-4">
                             <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default EmailMarketing;