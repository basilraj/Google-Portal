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
            <div className="container mx-auto px-4 py-3 flex justify-between items-center flex-wrap">
                <a href={`${basePath}/`} onClick={(e) => handleLinkClick(e, `${basePath}/`)} className="flex items-center cursor-pointer">
                    <img 
                        src="data:image/png;base64,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"
                        alt="Jobtica Logo" 
                        className="h-12 w-auto"
                    />
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