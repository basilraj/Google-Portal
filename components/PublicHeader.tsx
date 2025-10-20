import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import Icon from './Icon.tsx';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { generalSettings, socialMediaSettings } = useData();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: 'About Us', path: '/about' },
        { name: 'Privacy Policy', path: '/privacy' }
    ];

    const NavLink: React.FC<{ path: string; name: string; isMobile?: boolean; }> = ({ path, name, isMobile = false }) => (
        <a
            href={path}
            onClick={(e) => {
                e.preventDefault();
                navigate(path);
                if (isMobile) setIsMenuOpen(false);
            }}
            className={isMobile
                ? "block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100"
                : "text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors"
            }
        >
            {name}
        </a>
    );

    return (
        <header className={`bg-white sticky top-0 z-40 transition-shadow duration-300 border-b ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="flex-shrink-0 flex items-center gap-3">
                            {generalSettings.siteIconUrl && <img className="h-8 w-auto" src={generalSettings.siteIconUrl} alt="Site Icon" />}
                            <span className="text-gray-800 text-xl font-bold">{generalSettings.siteTitle}</span>
                        </a>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map(link => <NavLink key={link.name} {...link} />)}
                            {socialMediaSettings.telegramGroup && (
                                <a
                                    href={socialMediaSettings.telegramGroup}
                                    target="_blank"
                                    rel="nofollow noopener noreferrer"
                                    className="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-600 flex items-center gap-2"
                                >
                                    <Icon name={socialMediaSettings.telegramGroupIcon || 'users'} /> Join Group
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                        >
                            <span className="sr-only">Open main menu</span>
                            <Icon name={isMenuOpen ? 'times' : 'bars'} />
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                         {navLinks.map(link => <NavLink key={link.name} {...link} isMobile />)}
                         {socialMediaSettings.telegramGroup && (
                            <a
                                href={socialMediaSettings.telegramGroup}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="bg-green-500 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-green-600 flex items-center gap-2"
                            >
                                <Icon name={socialMediaSettings.telegramGroupIcon || 'users'} /> Join Group
                            </a>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default PublicHeader;