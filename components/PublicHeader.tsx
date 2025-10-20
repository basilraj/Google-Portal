// Fix: Implemented the full component which was previously a placeholder.
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import Icon from './Icon.tsx';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { generalSettings } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/blog', label: 'Blog' },
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo and Site Title */}
                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-3">
                        {generalSettings.siteIconUrl && <img src={generalSettings.siteIconUrl} alt="Site Icon" className="h-10 w-10 object-contain" />}
                        <span className="text-2xl font-bold text-[#1e3c72]">{generalSettings.siteTitle}</span>
                    </a>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navLinks.map(link => (
                            <a 
                                key={link.path}
                                href={link.path} 
                                onClick={(e) => { e.preventDefault(); navigate(link.path); }} 
                                className="text-gray-600 hover:text-indigo-600 font-semibold transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden text-gray-700 hover:text-indigo-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        <Icon name={isMenuOpen ? 'times' : 'bars'} className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <nav className="flex flex-col p-4 space-y-2">
                         {navLinks.map(link => (
                            <a 
                                key={link.path}
                                href={link.path} 
                                onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate(link.path); }} 
                                className="text-gray-700 hover:bg-gray-100 p-2 rounded-md font-semibold"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default PublicHeader;
