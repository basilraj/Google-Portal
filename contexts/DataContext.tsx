

import React, { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Job, QuickLink, ContentPost, Subscriber, ContactSubmission, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings } from '../types';
import { 
    INITIAL_JOBS, 
    INITIAL_QUICK_LINKS, 
    INITIAL_POSTS, 
    INITIAL_SUBSCRIBERS, 
    INITIAL_CONTACTS, 
    INITIAL_BREAKING_NEWS,
    initialAdSettings,
    initialSeoSettings,
    initialGeneralSettings,
    initialSocialMediaSettings
} from '../constants';

interface DataContextType {
    // Data
    jobs: Job[];
    quickLinks: QuickLink[];
    posts: ContentPost[];
    subscribers: Subscriber[];
    contacts: ContactSubmission[];
    breakingNews: BreakingNews[];
    adSettings: AdSettings;
    seoSettings: SEOSettings;
    generalSettings: GeneralSettings;
    socialMediaSettings: SocialMediaSettings;

    // Mutators
    addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
    updateJob: (job: Job) => void;
    deleteJob: (id: string) => void;
    addMultipleJobs: (jobs: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => number;
    deleteMultipleJobs: (ids: string[]) => void;

    addQuickLink: (link: Omit<QuickLink, 'id'>) => void;
    updateQuickLink: (link: QuickLink) => void;
    deleteQuickLink: (id: string) => void;

    addPost: (post: Omit<ContentPost, 'id' | 'createdAt'>) => void;
    updatePost: (post: ContentPost) => void;
    deletePost: (id: string) => void;

    addSubscriber: (email: string) => boolean;
    deleteSubscriber: (id: string) => void;

    addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => void;
    deleteContact: (id: string) => void;

    addNews: (news: Omit<BreakingNews, 'id'>) => void;
    updateNews: (news: BreakingNews) => void;
    deleteNews: (id: string) => void;

    updateAdSettings: (settings: AdSettings) => void;
    updateSEOSettings: (settings: SEOSettings) => void;
    updateGeneralSettings: (settings: GeneralSettings) => void;
    updateSocialMediaSettings: (settings: SocialMediaSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const createId = () => new Date().getTime().toString() + Math.random().toString(36).substring(2, 9);

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
    
    const value: DataContextType = {
        jobs,
        quickLinks,
        posts,
        subscribers,
        contacts,
        breakingNews,
        adSettings,
        seoSettings,
        generalSettings,
        socialMediaSettings,

        addJob: (jobData) => setJobs(prev => [{ ...jobData, id: createId(), createdAt: new Date().toISOString() }, ...prev]),
        updateJob: (updatedJob) => setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j)),
        deleteJob: (id) => setJobs(prev => prev.filter(j => j.id !== id)),
        addMultipleJobs: (jobsData) => {
            const newJobs: Job[] = jobsData.map(j => ({ ...j, id: createId(), status: 'active', createdAt: new Date().toISOString() }));
            setJobs(prev => [...newJobs, ...prev]);
            return newJobs.length;
        },
        deleteMultipleJobs: (ids) => setJobs(prev => prev.filter(j => !ids.includes(j.id))),

        addQuickLink: (linkData) => setQuickLinks(prev => [{ ...linkData, id: createId() }, ...prev]),
        updateQuickLink: (updatedLink) => setQuickLinks(prev => prev.map(l => l.id === updatedLink.id ? updatedLink : l)),
        deleteQuickLink: (id) => setQuickLinks(prev => prev.filter(l => l.id !== id)),

        addPost: (postData) => setPosts(prev => [{ ...postData, id: createId(), createdAt: new Date().toISOString() }, ...prev]),
        updatePost: (updatedPost) => setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p)),
        deletePost: (id) => setPosts(prev => prev.filter(p => p.id !== id)),

        addSubscriber: (email) => {
            let success = false;
            setSubscribers(prev => {
                if (prev.some(s => s.email === email)) {
                    return prev;
                }
                success = true;
                return [...prev, { id: createId(), email, subscriptionDate: new Date().toISOString().split('T')[0], status: 'active' }];
            });
            return success;
        },
        deleteSubscriber: (id) => setSubscribers(prev => prev.filter(s => s.id !== id)),

        addContact: (contactData) => setContacts(prev => [{ ...contactData, id: createId(), submittedAt: new Date().toISOString() }, ...prev]),
        deleteContact: (id) => setContacts(prev => prev.filter(c => c.id !== id)),

        addNews: (newsData) => setBreakingNews(prev => [{ ...newsData, id: createId() }, ...prev]),
        updateNews: (updatedNews) => setBreakingNews(prev => prev.map(n => n.id === updatedNews.id ? updatedNews : n)),
        deleteNews: (id) => setBreakingNews(prev => prev.filter(n => n.id !== id)),

        updateAdSettings: (settings) => setAdSettings(settings),
        updateSEOSettings: (settings) => setSeoSettings(settings),
        updateGeneralSettings: (settings) => setGeneralSettings(settings),
        updateSocialMediaSettings: (settings) => setSocialMediaSettings(settings),
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
