import React, { useState } from 'react';
import Icon from './Icon';
import { basePath } from '../App';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { label: 'Home', path: `${basePath}/` },
        { label: 'Latest Jobs', path: `${basePath}/#latest-jobs` },
        { label: 'Blog', path: `${basePath}/blog` },
        { label: 'Exam Notices', path: `${basePath}/#exam-notices` },
        { label: 'Results', path: `${basePath}/#results` },
        { label: 'Contact Us', path: `${basePath}/#contact-us` },
    ];

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        // For SPA routing, prevent default browser navigation for client-side handled routes
        const [target, anchor] = path.split('#');
        const currentTarget = `${basePath}${window.location.pathname.replace(basePath, '')}`;
        
        // If it's a pure anchor link on the same page, let the default behavior handle scrolling
        if (target === currentTarget && anchor) {
            setIsMenuOpen(false);
            return;
        }

        e.preventDefault();
        setIsMenuOpen(false);
        navigate(path.replace(basePath, ''));
    };


    return (
        <header className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
                <a href={`${basePath}/`} onClick={(e) => handleLinkClick(e, `${basePath}/`)} className="text-center md:text-left cursor-pointer">
                    <h1 className="text-2xl font-bold">Divine Computer Job Portal</h1>
                    <p className="text-sm opacity-90">Your Gateway to Government Jobs</p>
                </a>
                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                    <Icon name={isMenuOpen ? "times" : "bars"} className="text-2xl" />
                </button>
                <nav className={`w-full md:w-auto md:flex ${isMenuOpen ? 'block mt-4' : 'hidden'}`}>
                    <ul className="flex flex-col md:flex-row md:space-x-4">
                         {navItems.map(item => (
                            <li key={item.label} className="w-full">
                                <a 
                                    href={item.path} 
                                    onClick={(e) => handleLinkClick(e, item.path)}
                                    className="block md:inline-block hover:bg-white/20 px-3 py-2 rounded-md transition-colors w-full"
                                >
                                    {item.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default PublicHeader;