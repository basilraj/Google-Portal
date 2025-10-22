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
                    <input type="text" placeholder="Administrator Email (for OTP)" required value={email} onChange={e => setEmail(e.target.value)} className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md" />
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
    const { login } = useAuth();
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
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {isLoading ? 'Verifying...' : 'Sign in'}
                </button>
            </form>
        </>
    );
};

const OtpForm: React.FC = () => {
    const { verifyOtp, cancelOtp, userEmail } = useAuth();
    const { smtpSettings } = useData();
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const otpInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        otpInputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const success = verifyOtp(otp);
        if (!success) {
            setError('Invalid OTP. Please try again.');
            setIsLoading(false);
            setOtp('');
        }
    };

    return (
        <>
            <div className="text-center">
                <Icon name="key" className="text-5xl text-indigo-600 mx-auto" />
                <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Two-Factor Authentication</h1>
                <p className="mt-2 text-sm text-gray-600">
                    An OTP is required to proceed. Please check the browser alert for your code.
                </p>
                 <div className={`mt-4 text-xs p-3 rounded-md ${smtpSettings.configured ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <Icon name={smtpSettings.configured ? "check-circle" : "exclamation-triangle"} className="mr-2"/>
                    {smtpSettings.configured 
                        ? "SMTP is configured. In a real application, this OTP would be sent to your email. For this demo, please use the code from the alert."
                        : "SMTP is not configured. Please complete setup in the admin panel to enable real email delivery."
                    }
                </div>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                    <input 
                        ref={otpInputRef}
                        type="text" 
                        placeholder="Enter 6-digit OTP" 
                        maxLength={6}
                        required 
                        value={otp} 
                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} 
                        className="appearance-none text-center tracking-[1rem] text-2xl font-bold relative block w-full px-3 py-2 border border-gray-300 rounded-md" 
                    />
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {isLoading ? 'Verifying...' : 'Verify'}
                </button>
                <button type="button" onClick={cancelOtp} className="w-full text-center text-sm text-gray-600 hover:underline">
                    Cancel and go back to login
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
            case 'otp': return <OtpForm />;
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