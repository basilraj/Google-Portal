import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { ContactSubmission } from '../../types';
import Icon from '../Icon';
import Modal from '../Modal';
import Pagination from './Pagination';
import usePagination from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 10;

const EmptyState: React.FC<{ message: string; }> = ({ message }) => (
    <div className="text-center py-16 border-t">
      <Icon name="envelope-open-text" className="text-5xl text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600">{message}</h3>
    </div>
);

const ContactManagement: React.FC = () => {
    const { contacts, deleteContact } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);

    // Sort contacts by most recent first
    const sortedContacts = [...contacts].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(sortedContacts, { itemsPerPage: ITEMS_PER_PAGE });

    const handleViewMessage = (contact: ContactSubmission) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const handleDelete = (contactId: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            deleteContact(contactId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Contact Form Submissions</h2>
            {contacts.length > 0 ? (
            <>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 responsive-table">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Subject</th>
                            <th className="px-6 py-3">Submitted At</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map(contact => (
                            <tr key={contact.id} className="bg-white hover:bg-gray-50 border-b">
                                <td data-label="Name" className="px-6 py-4 font-medium text-gray-900">{contact.name}</td>
                                <td data-label="Email" className="px-6 py-4">{contact.email}</td>
                                <td data-label="Subject" className="px-6 py-4">{contact.subject}</td>
                                <td data-label="Submitted" className="px-6 py-4">{new Date(contact.submittedAt).toLocaleString()}</td>
                                <td data-label="Actions" className="px-6 py-4 flex gap-4 actions-cell">
                                    <button onClick={() => handleViewMessage(contact)} className="text-blue-500 hover:text-blue-700" title="View Message">
                                        <Icon name="eye" />
                                    </button>
                                    <button onClick={() => handleDelete(contact.id)} className="text-red-500 hover:text-red-700" title="Delete Message">
                                        <Icon name="trash" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
            </>
            ) : (
                <EmptyState message="No contact messages have been received yet." />
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Message from ${selectedContact?.name}`}>
                {selectedContact && (
                    <div className="space-y-4">
                        <div>
                            <strong className="block text-sm text-gray-500">From:</strong>
                            <p>{selectedContact.name} &lt;{selectedContact.email}&gt;</p>
                        </div>
                        <div>
                            <strong className="block text-sm text-gray-500">Date:</strong>
                            <p>{new Date(selectedContact.submittedAt).toLocaleString()}</p>
                        </div>
                        <div>
                            <strong className="block text-sm text-gray-500">Subject:</strong>
                            <p>{selectedContact.subject}</p>
                        </div>
                        <hr/>
                        <div>
                            <strong className="block text-sm text-gray-500">Message:</strong>
                            <p className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md mt-1">{selectedContact.message}</p>
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

export default ContactManagement;