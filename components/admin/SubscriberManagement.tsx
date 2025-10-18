import React from 'react';
import { useData } from '../../contexts/DataContext';
import Icon from '../Icon';

const SubscriberManagement: React.FC = () => {
    const { subscribers, deleteSubscriber } = useData();

    const handleDelete = (id: string, email: string) => {
        if (window.confirm(`Are you sure you want to delete the subscriber "${email}"?`)) {
            deleteSubscriber(id);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-700 mb-4">All Subscribers</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Subscription Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subscribers.map(sub => (
                             <tr key={sub.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{sub.email}</td>
                                <td className="px-6 py-4">{sub.subscriptionDate}</td>
                                <td className="px-6 py-4"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">{sub.status}</span></td>
                                <td className="px-6 py-4">
                                     <button onClick={() => handleDelete(sub.id, sub.email)} className="text-red-500 hover:text-red-700">
                                        <Icon name="trash" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SubscriberManagement;
