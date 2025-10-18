
import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import Icon from '../components/Icon';
// FIX: Add explicit type imports
import { ContactSubmission, ContentPost, Job } from '../types';
import Modal from '../components/Modal';
import Pagination from '../components/admin/Pagination';
import usePagination from '../hooks/usePagination';
import PublicFooter from '../components/PublicFooter';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
                <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-center md:text-left cursor-pointer">
                    <h1 className="text-2xl font-bold">Divine Computer Job Portal</h1>
                    <p className="text-sm opacity-90">Your Gateway to Government Jobs</p>
                </a>
                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Icon name={isMenuOpen ? "times" : "bars"} className="text-2xl" />
                </button>
                <nav className={`w-full md:w-auto md:flex ${isMenuOpen ? 'block mt-4' : 'hidden'}`}>
                    <ul className="flex flex-col md:flex-row md:space-x-4">
                        {['Home', 'Latest Jobs', 'Blog', 'Exam Notices', 'Results', 'Contact Us'].map(item => (
                             <li key={item} className="w-full">
                                {item === 'Home' 
                                 ? <a href="/Google-Portal/" onClick={(e) => { e.preventDefault(); navigate('/'); setIsMenuOpen(false); }} className="block md:inline-block hover:bg-white/20 px-3 py-2 rounded-md transition-colors w-full">{item}</a>
                                 : item === 'Blog' 
                                 ? <a href="/Google-Portal/blog" onClick={(e) => {e.preventDefault(); navigate('/blog'); setIsMenuOpen(false);}} className="block md:inline-block hover:bg-white/20 px-3 py-2 rounded-md transition-colors w-full">{item}</a>
                                 : <a href={`#${item.toLowerCase().replace(/ /g, '-')}`} onClick={() => setIsMenuOpen(false)} className="block md:inline-block hover:bg-white/20 px-3 py-2 rounded-md transition-colors w-full">{item}</a>
                                }
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

// FIX: Update prop type to use imported Job type
const JobCard: React.FC<{ job: Job }> = ({ job }) => {
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    const getBadge = () => {
        switch (job.status) {
            case 'active': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">Active</span>;
            case 'closing-soon': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">Closing Soon</span>;
            case 'expired': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">Expired</span>;
        }
    };

    const shareUrl = window.location.href.split('#')[0]; // Get URL without hash
    const shareTitle = `Check out this job: ${job.title}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + "\n\n" + shareUrl)}`;

    return (
        <div className="border bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
            <div className="flex-grow">
                <h3 className="text-xl font-bold text-[#1e3c72] mb-2">{job.title}</h3>
                <div className="text-sm text-gray-600 mb-3 flex flex-wrap gap-x-4 gap-y-2">
                    <span><Icon name="building" className="mr-2 text-gray-400" />{job.department}</span>
                    <span><Icon name="graduation-cap" className="mr-2 text-gray-400" />{job.qualification}</span>
                    <span><Icon name="briefcase" className="mr-2 text-gray-400" />{job.vacancies} Vacancies</span>
                    <span><Icon name="calendar-check" className="mr-2 text-gray-400" />Posted: {job.postedDate}</span>
                    <span><Icon name="calendar-alt" className="mr-2 text-gray-400" />Last Date: {job.lastDate}</span>
                </div>
                
                {isDetailsOpen && (
                    <div className="mt-4 pt-4 border-t border-gray-200 animate-fade-in">
                        <h4 className="font-semibold text-gray-800 mb-2">Job Details:</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                    </div>
                )}
            </div>

            <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t">
                 <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    {getBadge()}
                    <div className="flex items-center gap-3 text-gray-500">
                        <span className="text-sm font-semibold">Share:</span>
                        <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="hover:text-blue-600 transition-colors">
                            <Icon prefix="fab" name="facebook-f" className="text-lg" />
                        </a>
                        <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="hover:text-green-500 transition-colors">
                            <Icon prefix="fab" name="whatsapp" className="text-lg" />
                        </a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsDetailsOpen(!isDetailsOpen)} className="text-sm font-semibold text-indigo-600 hover:underline">
                        {isDetailsOpen ? 'Hide Details' : 'More Details'}
                    </button>
                    <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
                        Apply Now
                    </a>
                </div>
            </div>
        </div>
    );
};

const PostCard: React.FC<{ post: ContentPost; onViewDetails: (post: ContentPost) => void; }> = ({ post, onViewDetails }) => (
    <div className="border bg-white p-4 rounded-lg flex items-center justify-between gap-4 flex-wrap">
        <div>
            <h4 className="font-semibold text-gray-800">{post.title}</h4>
            <p className="text-sm text-gray-500">
                Published: {post.publishedDate} 
                {post.examDate && ` | Exam: ${post.examDate}`}
            </p>
        </div>
        <button onClick={() => onViewDetails(post)} className="text-indigo-600 hover:underline text-sm font-semibold flex-shrink-0">View Details</button>
    </div>
);

const AdComponent: React.FC<{ code: string }> = ({ code }) => (
    <div className="my-6" dangerouslySetInnerHTML={{ __html: code }} />
);

const BreakingNewsTicker: React.FC = () => {
    const { breakingNews } = useData();
    const activeNews = breakingNews.filter(n => n.status === 'active');

    if (activeNews.length === 0) return null;

    const newsItems = activeNews.map(n => (
        <a key={n.id} href={n.link} className="text-white hover:underline mx-4">{n.text}</a>
    ));

    return (
        <div className="bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block">
                {newsItems}
                {/* Duplicate for seamless scroll */}
                {newsItems} 
            </div>
             <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
        </div>
    );
};

const PublicWebsite: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { jobs, quickLinks, posts, addSubscriber, addContact, adSettings } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [qualificationFilter, setQualificationFilter] = useState('all');
    const [subscriberEmail, setSubscriberEmail] = useState('');
    const [subscriptionMessage, setSubscriptionMessage] = useState('');
    const [contactForm, setContactForm] = useState<Omit<ContactSubmission, 'id' | 'submittedAt'>>({ name: '', email: '', subject: '', message: ''});
    const [contactMessage, setContactMessage] = useState('');
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);

    const departments = useMemo(() => {
        const uniqueDepts = new Set(jobs.map(job => job.department));
        return ['all', ...Array.from(uniqueDepts).sort()];
    }, [jobs]);

    const qualifications = useMemo(() => {
        const uniqueQuals = new Set(jobs.map(job => job.qualification));
        return ['all', ...Array.from(uniqueQuals).sort()];
    }, [jobs]);

    const handleViewPostDetails = (post: ContentPost) => {
        setSelectedPost(post);
        setIsPostModalOpen(true);
    };

    const handleSubscription = (e: React.FormEvent) => {
        e.preventDefault();
        if (subscriberEmail) {
            const success = addSubscriber(subscriberEmail);
            if(success) {
                setSubscriptionMessage('Thank you for subscribing!');
                setSubscriberEmail('');
                setTimeout(() => setSubscriptionMessage(''), 5000);
            }
        }
    }

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setContactForm({...contactForm, [e.target.name]: e.target.value });
    }

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addContact(contactForm);
        setContactMessage('Your message has been sent successfully! We will get back to you soon.');
        setContactForm({ name: '', email: '', subject: '', message: ''});
        setTimeout(() => setContactMessage(''), 8000);
    }
    
    const handleClearFilters = () => {
        setSearchQuery('');
        setDepartmentFilter('all');
        setQualificationFilter('all');
    };

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => 
            job.status !== 'expired' &&
            (searchQuery === '' || 
             job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             job.department.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (departmentFilter === 'all' || job.department === departmentFilter) &&
            (qualificationFilter === 'all' || job.qualification === qualificationFilter)
        );
    }, [jobs, searchQuery, departmentFilter, qualificationFilter]);

    const { 
        currentPage: jobsCurrentPage, 
        totalPages: jobsTotalPages, 
        paginatedData: paginatedJobs, 
        goToPage: goToJobsPage 
    } = usePagination(filteredJobs, { itemsPerPage: 5 });
    
    return (
        <div className="public-website bg-gray-50">
            <PublicHeader navigate={navigate} />
            <BreakingNewsTicker />
            {adSettings.headerAdEnabled && <AdComponent code={adSettings.headerAdCode} />}

            <section id="home" className="hero bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-extrabold mb-4">Find Your Dream Government Job</h2>
                    <p className="text-lg opacity-90 mb-8">Latest Government Job Openings, Exam Notifications and Results</p>
                    <div className="search-box max-w-2xl mx-auto flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Search jobs by title or keyword..." 
                            className="w-full p-3 rounded-md border-0 text-gray-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                         />
                    </div>
                </div>
            </section>
            
            <section className="advanced-search bg-white p-6 rounded-lg shadow-md -mt-8 mx-4 md:mx-auto max-w-4xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="departmentFilter" className="block text-sm font-medium text-gray-700">Department</label>
                        <select id="departmentFilter" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
                            ))}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="qualificationFilter" className="block text-sm font-medium text-gray-700">Qualification</label>
                        <select id="qualificationFilter" value={qualificationFilter} onChange={(e) => setQualificationFilter(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white">
                            {qualifications.map(qual => (
                                <option key={qual} value={qual}>{qual === 'all' ? 'All Qualifications' : qual}</option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleClearFilters} className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md hover:bg-gray-300 transition-colors w-full md:w-auto">
                        Clear Filters
                    </button>
                </div>
            </section>
            
            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                         <section id="latest-jobs">
                             <h2 className="text-3xl font-bold text-[#1e3c72] my-6 pb-2 border-b-4 border-purple-500">Latest Job Openings</h2>
                             <div className="space-y-6">
                                {paginatedJobs.length > 0 ? (
                                    paginatedJobs.map(job => <JobCard key={job.id} job={job} />)
                                ) : (
                                    <p className="text-gray-500 bg-gray-100 p-4 rounded-md">No jobs found matching your search criteria.</p>
                                )}
                             </div>
                             <div className="mt-8">
                                <Pagination
                                    currentPage={jobsCurrentPage}
                                    totalPages={jobsTotalPages}
                                    onPageChange={goToJobsPage}
                                />
                            </div>
                        </section>
                        <section id="exam-notices">
                           <h2 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">Exam Notices & Admit Cards</h2>
                           <div className="space-y-4">
                                {posts.filter(p => p.type === 'exam-notices' && p.status === 'published').map(post => <PostCard key={post.id} post={post} onViewDetails={handleViewPostDetails} />)}
                           </div>
                        </section>
                        <section id="results">
                           <h2 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">Latest Results</h2>
                           <div className="space-y-4">
                                {posts.filter(p => p.type === 'results' && p.status === 'published').map(post => <PostCard key={post.id} post={post} onViewDetails={handleViewPostDetails} />)}
                           </div>
                        </section>
                        <section id="contact-us" className="bg-white p-6 md:p-8 rounded-lg shadow-md">
                            <h2 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">Contact Us</h2>
                            <form onSubmit={handleContactSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                                        <input type="text" name="name" id="name" value={contactForm.name} onChange={handleContactChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                                        <input type="email" name="email" id="email" value={contactForm.email} onChange={handleContactChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject *</label>
                                    <input type="text" name="subject" id="subject" value={contactForm.subject} onChange={handleContactChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message *</label>
                                    <textarea name="message" id="message" rows={5} value={contactForm.message} onChange={handleContactChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                </div>
                                <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:opacity-90 transition-opacity">Send Message</button>
                                {contactMessage && <p className="text-green-600 bg-green-100 p-3 rounded-md mt-4 text-center">{contactMessage}</p>}
                            </form>
                        </section>
                    </div>
                    <aside className="space-y-8 sticky top-24 h-fit">
                        {adSettings.sidebarAdEnabled && <AdComponent code={adSettings.sidebarAdCode} />}
                        <div className="widget bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-[#1e3c72] mb-4 pb-2 border-b-2 border-purple-500">Quick Links</h3>
                            <ul className="space-y-2">
                                {quickLinks.map(link => (
                                    <li key={link.id} className="border-b last:border-b-0 pb-2">
                                        <a href={link.url} className="text-gray-700 hover:text-purple-600 transition-colors flex items-center">
                                            <Icon name="chevron-right" className="mr-2 text-xs text-purple-500"/>{link.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="widget bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-bold mb-4 pb-2 border-b-2 border-white/50">Get Daily Updates</h3>
                            <p className="mb-4 text-sm">Subscribe to receive latest job notifications directly to your email!</p>
                            <form onSubmit={handleSubscription}>
                                <input 
                                    type="email" 
                                    placeholder="Enter your email" 
                                    value={subscriberEmail}
                                    onChange={(e) => setSubscriberEmail(e.target.value)}
                                    className="w-full p-2 rounded-md border-0 text-gray-800 mb-2" required/>
                                <button type="submit" className="w-full bg-white text-purple-600 font-bold py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">Subscribe Now</button>
                            </form>
                            {subscriptionMessage && <p className="text-white bg-white/20 p-2 rounded-md mt-4 text-center text-sm">{subscriptionMessage}</p>}
                        </div>
                    </aside>
                </div>
            </main>
             {adSettings.footerAdEnabled && (
                <div className="container mx-auto px-4">
                    <AdComponent code={adSettings.footerAdCode} />
                </div>
            )}
            <PublicFooter navigate={navigate} />

            <Modal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} title={selectedPost?.title || 'Details'}>
                {selectedPost && (
                    <div className="static-content">
                        {selectedPost.imageUrl && (
                            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-auto max-h-72 object-cover rounded-lg mb-6" />
                        )}
                        <div className="text-sm text-gray-500 mb-4">
                            <span><strong>Published:</strong> {selectedPost.publishedDate}</span>
                            {selectedPost.examDate && <span className="ml-4"><strong>Exam Date:</strong> {selectedPost.examDate}</span>}
                        </div>
                        <hr/>
                        <p>{selectedPost.content}</p>
                        <div className="flex justify-end pt-4 mt-4">
                            <button onClick={() => setIsPostModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default PublicWebsite;
