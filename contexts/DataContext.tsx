import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Job, QuickLink, ContentPost, Subscriber, ContactSubmission, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, EmailNotification } from '../types';
import { INITIAL_JOBS, INITIAL_QUICK_LINKS, INITIAL_POSTS, INITIAL_SUBSCRIBERS, INITIAL_CONTACTS, INITIAL_BREAKING_NEWS, initialAdSettings, initialSeoSettings, initialGeneralSettings, initialSocialMediaSettings, INITIAL_EMAIL_NOTIFICATIONS } from '../constants';

// Define the shape of the context data
interface DataContextType {
    jobs: Job[];
    addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
    updateJob: (job: Job) => void;
    deleteJob: (jobId: string) => void;
    addMultipleJobs: (jobs: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => number;
    deleteMultipleJobs: (jobIds: string[]) => void;
    
    quickLinks: QuickLink[];
    addQuickLink: (link: Omit<QuickLink, 'id'>) => void;
    updateQuickLink: (link: QuickLink) => void;
    deleteQuickLink: (linkId: string) => void;

    posts: ContentPost[];
    addPost: (post: Omit<ContentPost, 'id' | 'createdAt'>) => void;
    updatePost: (post: ContentPost) => void;
    deletePost: (postId: string) => void;

    subscribers: Subscriber[];
    addSubscriber: (email: string) => boolean;
    deleteSubscriber: (id: string) => void;

    contacts: ContactSubmission[];
    addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => void;
    deleteContact: (id: string) => void;

    breakingNews: BreakingNews[];
    addNews: (news: Omit<BreakingNews, 'id'>) => void;
    updateNews: (news: BreakingNews) => void;
    deleteNews: (id: string) => void;
    
    adSettings: AdSettings;
    updateAdSettings: (settings: AdSettings) => void;

    seoSettings: SEOSettings;
    updateSEOSettings: (settings: SEOSettings) => void;

    generalSettings: GeneralSettings;
    updateGeneralSettings: (settings: GeneralSettings) => void;

    socialMediaSettings: SocialMediaSettings;
    updateSocialMediaSettings: (settings: SocialMediaSettings) => void;
    
    emailNotifications: EmailNotification[];
    deleteEmailNotification: (id: string) => void;
    clearAllEmailNotifications: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [jobs, setJobs] = useLocalStorage<Job[]>('jobs', INITIAL_JOBS);
    const [quickLinks, setQuickLinks] = useLocalStorage<QuickLink[]>('quickLinks', INITIAL_QUICK_LINKS);
    const [posts, setPosts] = useLocalStorage<ContentPost[]>('posts', INITIAL_POSTS);
    const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>('subscribers', INITIAL_SUBSCRIBERS);
    const [contacts, setContacts] = useLocalStorage<ContactSubmission[]>('contacts', INITIAL_CONTACTS);
    const [breakingNews, setBreakingNews] = useLocalStorage<BreakingNews[]>('breakingNews', INITIAL_BREAKING_NEWS);
    const [adSettings, setAdSettings] = useLocalStorage<AdSettings>('adSettings', initialAdSettings);
    const [seoSettings, setSeoSettings] = useLocalStorage<SEOSettings>('seoSettings', initialSeoSettings);
    const [generalSettings, setGeneralSettings] = useLocalStorage<GeneralSettings>('generalSettings', initialGeneralSettings);
    const [socialMediaSettings, setSocialMediaSettings] = useLocalStorage<SocialMediaSettings>('socialMediaSettings', initialSocialMediaSettings);
    const [emailNotifications, setEmailNotifications] = useLocalStorage<EmailNotification[]>('emailNotifications', INITIAL_EMAIL_NOTIFICATIONS);

    const generateId = () => Date.now().toString();

    const sendNewJobNotification = (job: Job) => {
        const activeSubscribers = subscribers.filter(s => s.status === 'active');
        if (activeSubscribers.length === 0) {
            return;
        }

        const basePath = '/Google-Portal'; // As used in vite.config.ts and other components
        const jobUrl = `${window.location.origin}${basePath}/job/${job.id}`;

        const subject = `New Job Posting: ${job.title}`;
        const body = `Hello,

A new job has been posted that might interest you.

Job Title: ${job.title}
Department: ${job.department}
Qualification: ${job.qualification}
Vacancies: ${job.vacancies}
Last Date to Apply: ${job.lastDate}

View more details and apply here: ${jobUrl}

Thank you for subscribing to Divine Computer Job Portal.

Regards,
The Team
        `.trim();

        const newNotifications: EmailNotification[] = activeSubscribers.map(subscriber => ({
            id: `${generateId()}-${subscriber.id}`, // More unique ID
            recipient: subscriber.email,
            subject,
            body,
            sentAt: new Date().toISOString(),
            jobId: job.id,
        }));
        
        setEmailNotifications(prev => [...newNotifications, ...prev]);
    };

    // Job Management
    const addJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
        const newJob: Job = { ...jobData, id: generateId(), createdAt: new Date().toISOString() };
        setJobs(prev => [newJob, ...prev]);
        sendNewJobNotification(newJob);
    };
    const updateJob = (updatedJob: Job) => {
        setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    };
    const deleteJob = (jobId: string) => {
        setJobs(prev => prev.filter(j => j.id !== jobId));
    };
    const addMultipleJobs = (jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => {
        const newJobs: Job[] = jobsData.map(job => ({
            ...job,
            id: generateId(),
            createdAt: new Date().toISOString(),
            status: 'active' // Default status for bulk upload
        }));
        setJobs(prev => [...newJobs, ...prev]);
        newJobs.forEach(sendNewJobNotification);
        return newJobs.length;
    };
    const deleteMultipleJobs = (jobIds: string[]) => {
        setJobs(prev => prev.filter(job => !jobIds.includes(job.id)));
    };

    // Quick Link Management
    const addQuickLink = (linkData: Omit<QuickLink, 'id'>) => {
        const newLink: QuickLink = { ...linkData, id: generateId() };
        setQuickLinks(prev => [newLink, ...prev]);
    };
    const updateQuickLink = (updatedLink: QuickLink) => {
        setQuickLinks(prev => prev.map(l => l.id === updatedLink.id ? updatedLink : l));
    };
    const deleteQuickLink = (linkId: string) => {
        setQuickLinks(prev => prev.filter(l => l.id !== linkId));
    };

    // Post Management
    const addPost = (postData: Omit<ContentPost, 'id' | 'createdAt'>) => {
        const newPost: ContentPost = { ...postData, id: generateId(), createdAt: new Date().toISOString() };
        setPosts(prev => [newPost, ...prev]);
    };
    const updatePost = (updatedPost: ContentPost) => {
        setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    };
    const deletePost = (postId: string) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };
    
    // Subscriber Management
    const addSubscriber = (email: string) => {
        if (subscribers.some(s => s.email === email)) {
            return false;
        }
        const newSubscriber: Subscriber = {
            id: generateId(),
            email,
            subscriptionDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        setSubscribers(prev => [newSubscriber, ...prev]);
        return true;
    };
    const deleteSubscriber = (id: string) => {
        setSubscribers(prev => prev.filter(s => s.id !== id));
    };

    // Contact Management
    const addContact = (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
        const newContact: ContactSubmission = {
            ...contactData,
            id: generateId(),
            submittedAt: new Date().toISOString()
        };
        setContacts(prev => [newContact, ...prev]);
    };
    const deleteContact = (id: string) => {
        setContacts(prev => prev.filter(c => c.id !== id));
    };
    
    // Breaking News Management
    const addNews = (newsData: Omit<BreakingNews, 'id'>) => {
        const newNews: BreakingNews = { ...newsData, id: generateId() };
        setBreakingNews(prev => [newNews, ...prev]);
    };
    const updateNews = (updatedNews: BreakingNews) => {
        setBreakingNews(prev => prev.map(n => n.id === updatedNews.id ? updatedNews : n));
    };
    const deleteNews = (id: string) => {
        setBreakingNews(prev => prev.filter(n => n.id !== id));
    };

    // Email Notification Management
    const deleteEmailNotification = (id: string) => {
        setEmailNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAllEmailNotifications = () => {
        if (window.confirm('Are you sure you want to clear the entire notification history? This action cannot be undone.')) {
            setEmailNotifications([]);
        }
    };

    // Settings Management
    const updateAdSettings = (settings: AdSettings) => setAdSettings(settings);
    const updateSEOSettings = (settings: SEOSettings) => setSeoSettings(settings);
    const updateGeneralSettings = (settings: GeneralSettings) => setGeneralSettings(settings);
    const updateSocialMediaSettings = (settings: SocialMediaSettings) => setSocialMediaSettings(settings);

    const value = {
        jobs, addJob, updateJob, deleteJob, addMultipleJobs, deleteMultipleJobs,
        quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
        posts, addPost, updatePost, deletePost,
        subscribers, addSubscriber, deleteSubscriber,
        contacts, addContact, deleteContact,
        breakingNews, addNews, updateNews, deleteNews,
        adSettings, updateAdSettings,
        seoSettings, updateSEOSettings,
        generalSettings, updateGeneralSettings,
        socialMediaSettings, updateSocialMediaSettings,
        emailNotifications, deleteEmailNotification, clearAllEmailNotifications,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
