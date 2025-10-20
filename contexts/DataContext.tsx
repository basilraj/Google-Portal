import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Job, QuickLink, ContentPost, Subscriber, ContactSubmission, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, EmailNotification, CustomEmail, BackupData, SMTPSettings } from '../types';
import { INITIAL_JOBS, INITIAL_QUICK_LINKS, INITIAL_POSTS, INITIAL_SUBSCRIBERS, INITIAL_BREAKING_NEWS, initialAdSettings, initialSeoSettings, initialGeneralSettings, initialSocialMediaSettings, INITIAL_CONTACTS, INITIAL_EMAIL_NOTIFICATIONS, INITIAL_CUSTOM_EMAILS, initialSmtpSettings } from '../constants';
import { getEffectiveJobStatus } from '../utils/jobUtils';
import useLocalStorage from '../hooks/useLocalStorage';

interface DataContextType {
    // State
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
    emailNotifications: EmailNotification[];
    customEmails: CustomEmail[];
    smtpSettings: SMTPSettings;
    loading: boolean;
    error: string | null;

    // Mutators
    // Jobs
    addJob: (jobData: Omit<Job, 'id' | 'createdAt'>) => Promise<Job>;
    updateJob: (jobData: Job) => Promise<Job>;
    deleteJob: (jobId: string) => Promise<void>;
    addMultipleJobs: (jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => Promise<number>;
    deleteMultipleJobs: (jobIds: string[]) => Promise<void>;

    // Quick Links
    addQuickLink: (linkData: Omit<QuickLink, 'id'>) => Promise<void>;
    updateQuickLink: (linkData: QuickLink) => Promise<void>;
    deleteQuickLink: (linkId: string) => Promise<void>;

    // Posts
    addPost: (postData: Omit<ContentPost, 'id' | 'createdAt'>) => Promise<void>;
    updatePost: (postData: ContentPost) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
    deleteMultiplePosts: (postIds: string[]) => Promise<void>;

    // Subscribers
    addSubscriber: (email: string) => Promise<boolean>;
    deleteSubscriber: (subscriberId: string) => Promise<void>;
    
    // Contacts
    addContact: (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => Promise<void>;
    deleteContact: (contactId: string) => Promise<void>;

    // Breaking News
    addNews: (newsData: Omit<BreakingNews, 'id'>) => Promise<void>;
    updateNews: (newsData: BreakingNews) => Promise<void>;
    deleteNews: (newsId: string) => Promise<void>;

    // Settings
    updateAdSettings: (settings: AdSettings) => Promise<void>;
    updateSEOSettings: (settings: SEOSettings) => Promise<void>;
    updateGeneralSettings: (settings: GeneralSettings) => Promise<void>;
    updateSocialMediaSettings: (settings: SocialMediaSettings) => Promise<void>;
    updateSmtpSettings: (settings: SMTPSettings) => Promise<void>;

    // Email
    sendCustomEmail: (subject: string, body: string) => Promise<void>;
    deleteCustomEmail: (emailId: string) => Promise<void>;
    deleteEmailNotification: (notificationId: string) => Promise<void>;
    clearAllEmailNotifications: () => Promise<void>;

    // Backup
    createBackup: () => BackupData;
    restoreBackup: (data: BackupData) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function to simulate API calls
const simulateApiCall = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const usePersistentState = <T,>(key: string, initialValue: T) => useLocalStorage(key, initialValue);

const syncAllJobStatuses = (jobsToSync: Job[]): Job[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    sevenDaysFromNow.setHours(23, 59, 59, 999);

    return jobsToSync.map(job => {
        const lastDate = new Date(job.lastDate);
        let correctStatus: Job['status'];

        if (lastDate < today) {
            correctStatus = 'expired';
        } else if (lastDate <= sevenDaysFromNow) {
            correctStatus = 'closing-soon';
        } else {
            correctStatus = 'active';
        }

        if (job.status !== correctStatus) {
            return { ...job, status: correctStatus };
        }
        return job;
    });
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [jobs, setJobs] = usePersistentState<Job[]>('jobs', INITIAL_JOBS);
    const [quickLinks, setQuickLinks] = usePersistentState<QuickLink[]>('quickLinks', INITIAL_QUICK_LINKS);
    const [posts, setPosts] = usePersistentState<ContentPost[]>('posts', INITIAL_POSTS);
    const [subscribers, setSubscribers] = usePersistentState<Subscriber[]>('subscribers', INITIAL_SUBSCRIBERS);
    const [contacts, setContacts] = usePersistentState<ContactSubmission[]>('contacts', INITIAL_CONTACTS);
    const [breakingNews, setBreakingNews] = usePersistentState<BreakingNews[]>('breakingNews', INITIAL_BREAKING_NEWS);
    const [adSettings, setAdSettings] = usePersistentState<AdSettings>('adSettings', initialAdSettings);
    const [seoSettings, setSeoSettings] = usePersistentState<SEOSettings>('seoSettings', initialSeoSettings);
    const [generalSettings, setGeneralSettings] = usePersistentState<GeneralSettings>('generalSettings', initialGeneralSettings);
    const [socialMediaSettings, setSocialMediaSettings] = usePersistentState<SocialMediaSettings>('socialMediaSettings', initialSocialMediaSettings);
    const [emailNotifications, setEmailNotifications] = usePersistentState<EmailNotification[]>('emailNotifications', INITIAL_EMAIL_NOTIFICATIONS);
    const [customEmails, setCustomEmails] = usePersistentState<CustomEmail[]>('customEmails', INITIAL_CUSTOM_EMAILS);
    const [smtpSettings, setSmtpSettings] = usePersistentState<SMTPSettings>('smtpSettings', initialSmtpSettings);

    useEffect(() => {
        // This effect runs on initial load to sync job statuses.
        // It prevents jobs from having stale statuses (e.g., being 'active' when their lastDate has passed).
        const initialSyncedJobs = syncAllJobStatuses(jobs);
        if (JSON.stringify(initialSyncedJobs) !== JSON.stringify(jobs)) {
            console.log('Automated job status synchronization completed on load.');
            setJobs(initialSyncedJobs);
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const addJob = async (jobData: Omit<Job, 'id' | 'createdAt'>) => {
        await simulateApiCall();
        const newJob: Job = { ...jobData, id: Date.now().toString(), createdAt: new Date().toISOString() };
        setJobs(prev => [newJob, ...prev]);
        if (generalSettings.emailNotificationsEnabled && getEffectiveJobStatus(newJob) !== 'expired') {
            const newNotifications = subscribers.map(sub => ({
                id: `${newJob.id}-${sub.id}`, recipient: sub.email, subject: `New Job Alert: ${newJob.title}`,
                body: `A new job has been posted: ${newJob.title} at ${newJob.department}. Last date to apply is ${newJob.lastDate}.`,
                sentAt: new Date().toISOString(), jobId: newJob.id,
            }));
            setEmailNotifications(prev => [...prev, ...newNotifications]);
        }
        return newJob;
    };

    const updateJob = async (jobData: Job) => { await simulateApiCall(); setJobs(prev => prev.map(j => j.id === jobData.id ? jobData : j)); return jobData; };
    const deleteJob = async (jobId: string) => { await simulateApiCall(); setJobs(prev => prev.filter(j => j.id !== jobId)); };
    const addMultipleJobs = async (jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => {
        await simulateApiCall();
        const newJobs = jobsData.map(job => ({ ...job, id: `${job.title.slice(0, 10)}-${Math.random()}`, status: 'active' as const, createdAt: new Date().toISOString() }));
        setJobs(prev => [...newJobs, ...prev]); return newJobs.length;
    };
    const deleteMultipleJobs = async (jobIds: string[]) => { await simulateApiCall(); setJobs(prev => prev.filter(j => !jobIds.includes(j.id))); };

    const addQuickLink = async (linkData: Omit<QuickLink, 'id'>) => { await simulateApiCall(); setQuickLinks(prev => [{ ...linkData, id: Date.now().toString() }, ...prev]); };
    const updateQuickLink = async (linkData: QuickLink) => { await simulateApiCall(); setQuickLinks(prev => prev.map(l => l.id === linkData.id ? linkData : l)); };
    const deleteQuickLink = async (linkId: string) => { await simulateApiCall(); setQuickLinks(prev => prev.filter(l => l.id !== linkId)); };

    const addPost = async (postData: Omit<ContentPost, 'id' | 'createdAt'>) => { await simulateApiCall(); setPosts(prev => [{ ...postData, id: Date.now().toString(), createdAt: new Date().toISOString() }, ...prev]); };
    const updatePost = async (postData: ContentPost) => { await simulateApiCall(); setPosts(prev => prev.map(p => p.id === postData.id ? postData : p)); };
    const deletePost = async (postId: string) => { await simulateApiCall(); setPosts(prev => prev.filter(p => p.id !== postId)); };
    const deleteMultiplePosts = async (postIds: string[]) => { await simulateApiCall(); setPosts(prev => prev.filter(p => !postIds.includes(p.id))); };

    const addSubscriber = async (email: string) => {
        await simulateApiCall(); if (subscribers.some(s => s.email === email)) return false;
        const newSubscriber: Subscriber = { id: Date.now().toString(), email, subscriptionDate: new Date().toISOString().split('T')[0], status: 'active' };
        setSubscribers(prev => [newSubscriber, ...prev]); return true;
    };
    const deleteSubscriber = async (subscriberId: string) => { await simulateApiCall(); setSubscribers(prev => prev.filter(s => s.id !== subscriberId)); };
    const addContact = async (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
        await simulateApiCall();
        const newContact: ContactSubmission = { ...contactData, id: Date.now().toString(), submittedAt: new Date().toISOString() };
        setContacts(prev => [newContact, ...prev]);
    };
    const deleteContact = async (contactId: string) => { await simulateApiCall(); setContacts(prev => prev.filter(c => c.id !== contactId)); };

    const addNews = async (newsData: Omit<BreakingNews, 'id'>) => { await simulateApiCall(); setBreakingNews(prev => [{ ...newsData, id: Date.now().toString() }, ...prev]); };
    const updateNews = async (newsData: BreakingNews) => { await simulateApiCall(); setBreakingNews(prev => prev.map(n => n.id === newsData.id ? newsData : n)); };
    const deleteNews = async (newsId: string) => { await simulateApiCall(); setBreakingNews(prev => prev.filter(n => n.id !== newsId)); };

    const updateAdSettings = async (settings: AdSettings) => { await simulateApiCall(); setAdSettings(settings); };
    const updateSEOSettings = async (settings: SEOSettings) => { await simulateApiCall(); setSeoSettings(settings); };
    const updateGeneralSettings = async (settings: GeneralSettings) => { await simulateApiCall(); setGeneralSettings(settings); };
    const updateSocialMediaSettings = async (settings: SocialMediaSettings) => { await simulateApiCall(); setSocialMediaSettings(settings); };
    const updateSmtpSettings = async (settings: SMTPSettings) => { await simulateApiCall(); setSmtpSettings(settings); };

    const sendCustomEmail = async (subject: string, body: string) => {
        await simulateApiCall();
        const newEmail: CustomEmail = { id: Date.now().toString(), recipients: 'all', subject, body, sentAt: new Date().toISOString() };
        setCustomEmails(prev => [newEmail, ...prev]);
    };
    const deleteCustomEmail = async (emailId: string) => { await simulateApiCall(); setCustomEmails(prev => prev.filter(e => e.id !== emailId)); };
    const deleteEmailNotification = async (notificationId: string) => { await simulateApiCall(); setEmailNotifications(prev => prev.filter(n => n.id !== notificationId)); };
    const clearAllEmailNotifications = async () => {
        await simulateApiCall();
        if (window.confirm("Are you sure you want to clear all notification history? This cannot be undone.")) setEmailNotifications([]);
    };

    const createBackup = useCallback((): BackupData => ({ jobs, quickLinks, posts, subscribers, contacts, breakingNews, adSettings, seoSettings, generalSettings, socialMediaSettings, emailNotifications, customEmails, smtpSettings }), [jobs, quickLinks, posts, subscribers, contacts, breakingNews, adSettings, seoSettings, generalSettings, socialMediaSettings, emailNotifications, customEmails, smtpSettings]);

    const restoreBackup = (data: BackupData): boolean => {
        try {
            if (!data.jobs || !data.seoSettings) return false;
            
            const syncedJobs = syncAllJobStatuses(data.jobs);
            
            setJobs(syncedJobs); setQuickLinks(data.quickLinks); setPosts(data.posts); setSubscribers(data.subscribers);
            setContacts(data.contacts); setBreakingNews(data.breakingNews); setAdSettings(data.adSettings);
            setSeoSettings(data.seoSettings); setGeneralSettings(data.generalSettings); setSocialMediaSettings(data.socialMediaSettings);
            setEmailNotifications(data.emailNotifications); setCustomEmails(data.customEmails);
            setSmtpSettings(data.smtpSettings || initialSmtpSettings);
            return true;
        } catch (e) { console.error("Restore failed:", e); return false; }
    };

    const value = {
        jobs, quickLinks, posts, subscribers, contacts, breakingNews, adSettings, seoSettings, generalSettings, socialMediaSettings, emailNotifications, customEmails, smtpSettings, loading, error,
        addJob, updateJob, deleteJob, addMultipleJobs, deleteMultipleJobs, addQuickLink, updateQuickLink, deleteQuickLink, addPost, updatePost, deletePost, deleteMultiplePosts,
        addSubscriber, deleteSubscriber, addContact, deleteContact, addNews, updateNews, deleteNews, updateAdSettings, updateSEOSettings, updateGeneralSettings, updateSocialMediaSettings,
        updateSmtpSettings, sendCustomEmail, deleteCustomEmail, deleteEmailNotification, clearAllEmailNotifications, createBackup, restoreBackup
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error('useData must be used within a DataProvider');
    return context;
};