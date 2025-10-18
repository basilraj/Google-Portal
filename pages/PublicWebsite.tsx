import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import Icon from '../components/Icon';
import { QUICK_LINK_CATEGORIES } from '../constants';
import { Job } from '../types';

const PublicHeader: React.FC<{ generalSettings: any, navigate: (path: string) => void }> = ({ generalSettings, navigate }) => (
    <header className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
            <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-center md:text-left mb-4 md:mb-0 cursor-pointer">
                <h1 className="text-2xl font-bold">{generalSettings.siteTitle}</h1>
                <p className="text-sm opacity-90">{generalSettings.siteDescription}</p>
            </a>
            <nav>
                <a href="#jobs" className="hover:bg-white/20 px-3 py-2 rounded-md transition-colors">All Jobs</a>
                <a href="#contact" className="hover:bg-white/20 px-3 py-2 rounded-md transition-colors">Contact</a>
            </nav>
        </div>
    </header>
);

const PublicFooter: React.FC<{ generalSettings: any, navigate: (path: string) => void }> = ({ generalSettings, navigate }) => (
     <footer className="bg-[#1e3c72] text-white text-center py-8" id="contact">
        <div className="container mx-auto px-4">
            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
                <a href="/Google-Portal/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="hover:underline text-sm">Privacy Policy</a>
                <a href="/Google-Portal/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:underline text-sm">About Us</a>
                <a href="/Google-Portal/disclaimer" onClick={(e) => { e.preventDefault(); navigate('/disclaimer'); }} className="hover:underline text-sm">Disclaimer</a>
                <a href="/Google-Portal/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="hover:underline text-sm">Terms and Conditions</a>
            </div>
            <p className="mb-2">Contact us: <a href={`mailto:${generalSettings.contactEmail}`} className="hover:underline">{generalSettings.contactEmail}</a></p>
            <p className="text-xs text-gray-400">{generalSettings.footerText}</p>
        </div>
    </footer>
);

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border-l-4 border-purple-500">
        <h3 className="text-lg font-bold text-indigo-800">{job.title}</h3>
        <p className="text-sm font-semibold text-gray-600 mb-2">{job.department}</p>
        <p className="text-gray-700 text-sm mb-3">{job.shortInfo}</p>
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
            <div>
                <p><strong>Post Date:</strong> {job.postDate}</p>
                <p><strong>Last Date:</strong> {job.lastDate}</p>
            </div>
            <a href="#" className="bg-indigo-600 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-indigo-700">View Details</a>
        </div>
    </div>
);

const PublicWebsite: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { jobs, quickLinks, breakingNews, addSubscriber, generalSettings } = useData();
    const [email, setEmail] = useState('');

    const handleSubscription = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            addSubscriber(email);
            alert(`Thank you for subscribing with ${email}!`);
            setEmail('');
        }
    };
    
    const activeBreakingNews = breakingNews.filter(n => n.isActive);

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            <PublicHeader generalSettings={generalSettings} navigate={navigate} />

            {activeBreakingNews.length > 0 && (
                <div className="bg-yellow-100 border-b-2 border-yellow-300">
                    <div className="container mx-auto px-4 py-2 flex items-center">
                        <span className="font-bold text-yellow-800 mr-2 text-sm uppercase">Breaking:</span>
                        <div className="overflow-hidden flex-1">
                             <p className="animate-marquee whitespace-nowrap text-yellow-900 text-sm">
                                {activeBreakingNews.map(news => (
                                    <a key={news.id} href={news.link} className="hover:underline mr-8">{news.text}</a>
                                ))}{' '}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6" id="jobs">
                         <h2 className="text-3xl font-bold text-[#1e3c72] border-b-4 border-purple-500 pb-2">Latest Jobs</h2>
                        {jobs.map(job => <JobCard key={job.id} job={job} />)}
                    </div>
                    
                    {/* Sidebar */}
                    <aside className="space-y-6">
                         <div className="bg-white p-5 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg text-indigo-800 mb-3 border-b pb-2">Subscribe for Updates</h3>
                            <form onSubmit={handleSubscription}>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Enter your email" 
                                    className="w-full px-3 py-2 border rounded-md mb-2" 
                                    required 
                                />
                                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700">Subscribe Now</button>
                            </form>
                        </div>

                        {QUICK_LINK_CATEGORIES.map(category => {
                            const links = quickLinks.filter(link => link.category === category);
                            if (links.length === 0) return null;
                            return (
                                <div key={category} className="bg-white p-5 rounded-lg shadow-md">
                                    <h3 className="font-bold text-lg text-indigo-800 mb-3 border-b pb-2">{category}</h3>
                                    <ul className="space-y-2 text-sm">
                                        {links.map(link => (
                                            <li key={link.id}>
                                                <a href={link.url} className="text-blue-600 hover:text-blue-800 hover:underline flex items-start">
                                                    <Icon name="chevron-right" className="text-xs mr-2 mt-1" />
                                                    <span>{link.title}</span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </aside>
                </div>
            </main>

            <PublicFooter generalSettings={generalSettings} navigate={navigate} />
        </div>
    );
};

export default PublicWebsite;
