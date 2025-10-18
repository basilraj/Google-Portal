import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Icon from '../components/Icon';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Admin Panel Access</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to manage the job portal</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="user" className="text-gray-400" />
                    </div>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)} 
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="admin"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                 <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon name="lock" className="text-gray-400" />
                    </div>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="sarkari2025"
                        required
                    />
                </div>
            </div>
            
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <div>
                <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Sign in
                </button>
            </div>
             <div className="text-xs text-center text-gray-500 bg-gray-100 p-2 rounded-md border">
                <p>Default credentials:</p>
                <p><strong>Username:</strong> admin / <strong>Password:</strong> sarkari2025</p>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
