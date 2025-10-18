import React from 'react';
import Icon from './Icon';
import PublicFooter from './PublicFooter';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
    <header className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-center md:text-left cursor-pointer">
                <h1 className="text-2xl font-bold">Divine Computer Job Portal</h1>
                <p className="text-sm opacity-90">Your Gateway to Government Jobs</p>
            </a>
            <nav>
                 <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:bg-white/20 px-3 py-2 rounded-md transition-colors">Back to Home</a>
            </nav>
        </div>
    </header>
);

interface StaticPageProps {
    title: string;
    children: React.ReactNode;
    navigate: (path: string) => void;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, children, navigate }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PublicHeader navigate={navigate} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">{title}</h1>
                    <div className="static-content">
                        {children}
                    </div>
                </div>
            </main>
            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default StaticPage;