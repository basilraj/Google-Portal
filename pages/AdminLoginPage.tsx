import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import Icon from '../components/Icon.tsx';
import { useData } from '../contexts/DataContext.tsx';

const SignupForm: React.FC = () => {
    const { createAdmin } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await createAdmin({ username, password, email });
            // The AuthContext will handle navigation to the login stage.
        } catch (err) {
            setError('Failed to create admin account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="text-center">
                <Icon name="user-plus" className="text-5xl text-indigo-600 mx-auto" />
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Create Admin Account</h1>
                <p className="mt-2 text-sm text-gray-600">This is a one-time setup to secure your admin panel.</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="rounded-md shadow-sm space-y-3">
                    <input type="email" placeholder="Administrator Email (for password recovery)" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="text" placeholder="Choose a Username" required value={username} onChange={e => setUsername(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="password" placeholder="Choose a Secure Password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {isLoading ? 'Creating...' : 'Create Account'}
                </button>
            </form>
        </>
    );
};

const LoginForm: React.FC = () => {
    const { login, goToForgotPassword } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await login(username, password);
        if (!success) {
            setError('Invalid username or password.');
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="text-center">
                <Icon name="user-shield" className="text-5xl text-indigo-600 mx-auto" />
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Admin Login</h1>
                <p className="mt-2 text-sm text-gray-600">Please sign in to access the dashboard.</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                 <div className="rounded-md shadow-sm space-y-3">
                    <input type="text" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <div className="flex items-center justify-end">
                    <div className="text-sm">
                        <button type="button" onClick={goToForgotPassword} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </button>
                    </div>
                </div>
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {isLoading ? 'Verifying...' : 'Sign in'}
                </button>
            </form>
        </>
    );
};

const ForgotPasswordForm: React.FC = () => {
    const { requestPasswordReset, backToLogin } = useAuth();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = await requestPasswordReset(email);
        if (!success) {
            setError('The provided email does not match the registered admin email.');
            setIsLoading(false);
        }
        // On success, auth context handles stage change.
    };

    return (
        <>
            <div className="text-center">
                <Icon name="question-circle" className="text-5xl text-indigo-600 mx-auto" />
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Forgot Password</h1>
                <p className="mt-2 text-sm text-gray-600">Enter your admin email to begin the reset process.</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="email" placeholder="Administrator Email" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {isLoading ? 'Verifying...' : 'Request Reset'}
                </button>
                <button type="button" onClick={backToLogin} className="w-full text-center text-sm text-gray-600 hover:underline">
                    Back to login
                </button>
            </form>
        </>
    );
};

const ResetPasswordForm: React.FC = () => {
    const { resetPassword, backToLogin, userEmail } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);
        await resetPassword(newPassword);
        // Auth context will navigate away on success.
    };
    
    return (
         <>
            <div className="text-center">
                <Icon name="key" className="text-5xl text-indigo-600 mx-auto" />
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Reset Your Password</h1>
                <p className="mt-2 text-sm text-gray-600">Enter a new password for your account associated with <strong>{userEmail}</strong>.</p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <input type="password" placeholder="Enter new password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
                {message && <p className="text-sm text-green-600 text-center">{message}</p>}
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {isLoading ? 'Resetting...' : 'Set New Password'}
                </button>
                 <button type="button" onClick={backToLogin} className="w-full text-center text-sm text-gray-600 hover:underline">
                    Back to login
                </button>
            </form>
        </>
    );
};

const AdminLoginPage: React.FC = () => {
    const { authStage } = useAuth();

    const renderForm = () => {
        switch (authStage) {
            case 'signup': return <SignupForm />;
            case 'login': return <LoginForm />;
            case 'forgotPassword': return <ForgotPasswordForm />;
            case 'resetPassword': return <ResetPasswordForm />;
            default: return null; // Should not happen
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                {renderForm()}
            </div>
        </div>
    );
};

export default AdminLoginPage;
