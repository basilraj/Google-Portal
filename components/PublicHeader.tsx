import React, { useState } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import Icon from './Icon.tsx';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { generalSettings, socialMediaSettings } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'About Us', path: '/about' },
    ];

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="bg-[#1e3c72] text-white text-xs py-1">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <span>Welcome to your #1 Government Job Portal</span>
                    <div className="flex items-center gap-4">
                         {socialMediaSettings.telegram && <a href={socialMediaSettings.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">Telegram</a>}
                         {socialMediaSettings.whatsapp && <a href={socialMediaSettings.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-green-400">WhatsApp</a>}
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-3">
                    <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex items-center gap-3">
                        {generalSettings.siteIconUrl ? 
                            <img src={generalSettings.siteIconUrl} alt="Site Logo" className="h-16 w-auto" />
                            :
                             <span className="text-3xl font-bold text-[#1e3c72]">{generalSettings.siteTitle}</span>
                        }
                    </a>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <a 
                                key={link.name} 
                                href={link.path} 
                                onClick={(e) => { e.preventDefault(); navigate(link.path); }}
                                className="text-lg font-bold text-blue-900 hover:text-indigo-600 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-3xl text-gray-700">
                        <Icon name={isMenuOpen ? 'times' : 'bars'} />
                    </button>
                </div>
            </div>
            
            {/* Mobile Menu */}
            {isMenuOpen && (
                 <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t">
                     <nav className="flex flex-col p-4">
                         {navLinks.map(link => (
                            <a 
                                key={link.name} 
                                href={link.path} 
                                onClick={(e) => { e.preventDefault(); navigate(link.path); setIsMenuOpen(false); }}
                                className="text-gray-700 font-semibold py-3 hover:bg-gray-100 rounded-md text-center text-lg"
                            >
                                {link.name}
                            </a>
                        ))}
                     </nav>
                 </div>
            )}
        </header>
    );
};

export default PublicHeader;