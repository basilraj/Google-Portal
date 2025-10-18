import React from 'react';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
    <header className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-center md:text-left mb-4 md:mb-0 cursor-pointer">
                <h1 className="text-2xl font-bold">Divine Computer Job Portal</h1>
                <p className="text-sm opacity-90">Your Gateway to Government Jobs</p>
            </a>
            <nav>
                 <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:bg-white/20 px-3 py-2 rounded-md transition-colors">Back to Home</a>
            </nav>
        </div>
    </header>
);

const PublicFooter: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
     <footer className="bg-[#1e3c72] text-white text-center py-8 mt-8">
        <div className="container mx-auto px-4">
            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
                <a href="/Google-Portal/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="hover:underline text-sm">Privacy Policy</a>
                <a href="/Google-Portal/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:underline text-sm">About Us</a>
                <a href="/Google-Portal/disclaimer" onClick={(e) => { e.preventDefault(); navigate('/disclaimer'); }} className="hover:underline text-sm">Disclaimer</a>
                <a href="/Google-Portal/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="hover:underline text-sm">Terms and Conditions</a>
            </div>
            <p className="text-xs text-gray-400">&copy; 2025 Divine Computer Job Portal. All Rights Reserved.</p>
        </div>
    </footer>
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
                <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">{title}</h1>
                    <div className="prose max-w-none">
                        {children}
                    </div>
                </div>
            </main>
            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default StaticPage;
