import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import Icon from '../components/Icon';
import { ContactSubmission } from '../types';

const PublicHeader: React.FC = () => (
    <header className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
            <div className="text-center md:text-left mb-4 md:mb-0">
                <h1 className="text-2xl font-bold">Divine Computer Job Portal</h1>
                <p className="text-sm opacity-90">Your Gateway to Government Jobs</p>
            </div>
            <nav>
                <ul className="flex space-x-4 sm:space-x-6">
                    {['Home', 'Latest Jobs', 'Exam Notices', 'Results', 'Contact Us'].map(item => (
                        <li key={item}><a href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="hover:bg-white/20 px-3 py-2 rounded-md transition-colors">{item}</a></li>
                    ))}
                </ul>
            </nav>
        </div>
    </header>
);

const JobCard: React.FC<{ job: import('../types').Job }> = ({ job }) => {
    const getBadge = () => {
        switch (job.status) {
            case 'active': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">Active</span>;
            case 'closing-soon': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">Closing Soon</span>;
            case 'expired': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">Expired</span>;
        }
    }
    return (
        <div className="border bg-white p-6 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-bold text-[#1e3c72] mb-2">{job.title}</h3>
            <div className="text-sm text-gray-600 mb-3 flex flex-wrap gap-x-4 gap-y-2">
                <span><Icon name="building" className="mr-2 text-gray-400" />{job.department}</span>
                <span><Icon name="graduation-cap" className="mr-2 text-gray-400" />{job.qualification}</span>
                <span><Icon name="briefcase" className="mr-2 text-gray-400" />{job.vacancies} Vacancies</span>
                <span><Icon name="calendar-check" className="mr-2 text-gray-400" />Posted: {job.postedDate}</span>
                <span><Icon name="calendar-alt" className="mr-2 text-gray-400" />Last Date: {job.lastDate}</span>
            </div>
            <p className="text-gray-700 mb-4">{job.description}</p>
            <div className="flex justify-between items-center">
                {getBadge()}
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:opacity-90 transition-opacity">Apply Now</a>
            </div>
        </div>
    );
};

const PostCard: React.FC<{ post: import('../types').ContentPost }> = ({ post }) => (
    <div className="border bg-white p-4 rounded-lg flex items-center justify-between">
        <div>
            <h4 className="font-semibold text-gray-800">{post.title}</h4>
            <p className="text-sm text-gray-500">
                Published: {post.publishedDate} 
                {post.examDate && ` | Exam: ${post.examDate}`}
            </p>
        </div>
        <a href="#" className="text-indigo-600 hover:underline text-sm font-semibold">View Details</a>
    </div>
);


const PublicWebsite: React.FC = () => {
    const { jobs, quickLinks, posts, addSubscriber, addContact } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const [subscriberEmail, setSubscriberEmail] = useState('');
    const [subscriptionMessage, setSubscriptionMessage] = useState('');
    const [contactForm, setContactForm] = useState<Omit<ContactSubmission, 'id' | 'submittedAt'>>({ name: '', email: '', subject: '', message: ''});
    const [contactMessage, setContactMessage] = useState('');

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

    const filteredJobs = useMemo(() => {
        return jobs.filter(job => 
            job.status !== 'expired' &&
            (job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
             job.department.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [jobs, searchQuery]);
    
    return (
        <div className="public-website bg-gray-50">
            <PublicHeader />
            <section id="home" className="hero bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-extrabold mb-4">Find Your Dream Government Job</h2>
                    <p className="text-lg opacity-90 mb-8">Latest Government Job Openings, Exam Notifications and Results</p>
                    <div className="search-box max-w-2xl mx-auto flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Search jobs by title or department..." 
                            className="w-full p-3 rounded-md border-0 text-gray-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                         />
                    </div>
                </div>
            </section>
            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        <section id="latest-jobs">
                             <h2 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">Latest Job Openings</h2>
                             <div className="space-y-6">
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map(job => <JobCard key={job.id} job={job} />)
                                ) : (
                                    <p className="text-gray-500 bg-gray-100 p-4 rounded-md">No jobs found matching your search criteria.</p>
                                )}
                             </div>
                        </section>
                        <section id="exam-notices">
                           <h2 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">Exam Notices & Admit Cards</h2>
                           <div className="space-y-4">
                                {posts.filter(p => p.type === 'exam-notices' && p.status === 'published').map(post => <PostCard key={post.id} post={post} />)}
                           </div>
                        </section>
                        <section id="results">
                           <h2 className="text-3xl font-bold text-[#1e3c72] mb-6 pb-2 border-b-4 border-purple-500">Latest Results</h2>
                           <div className="space-y-4">
                                {posts.filter(p => p.type === 'results' && p.status === 'published').map(post => <PostCard key={post.id} post={post} />)}
                           </div>
                        </section>
                        <section id="contact-us" className="bg-white p-8 rounded-lg shadow-md">
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
            <footer className="bg-[#1e3c72] text-white text-center py-8 mt-8">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
                        <a href="#" className="hover:underline text-sm">Privacy Policy</a>
                        <a href="#" className="hover:underline text-sm">About Us</a>
                        <a href="#" className="hover:underline text-sm">Disclaimer</a>
                        <a href="#" className="hover:underline text-sm">Terms and Conditions</a>
                    </div>
                    <p className="text-xs text-gray-400">&copy; 2025 Divine Computer Job Portal. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default PublicWebsite;
