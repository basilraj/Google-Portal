import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Job, QuickLink, ContentPost, Subscriber, ContactSubmission, BreakingNews, AdSettings, SEOSettings, GeneralSettings, SocialMediaSettings, EmailNotification, CustomEmail, BackupData } from '../types';
import { initialAdSettings, initialSeoSettings, initialGeneralSettings, initialSocialMediaSettings } from '../constants';

interface DataContextType {
    jobs: Job[];
    addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<void>;
    updateJob: (job: Job) => Promise<void>;
    deleteJob: (jobId: string) => Promise<void>;
    addMultipleJobs: (jobs: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => Promise<number>;
    deleteMultipleJobs: (jobIds: string[]) => Promise<void>;
    
    quickLinks: QuickLink[];
    addQuickLink: (link: Omit<QuickLink, 'id'>) => Promise<void>;
    updateQuickLink: (link: QuickLink) => Promise<void>;
    deleteQuickLink: (linkId: string) => Promise<void>;

    posts: ContentPost[];
    addPost: (post: Omit<ContentPost, 'id' | 'createdAt'>) => Promise<void>;
    updatePost: (post: ContentPost) => Promise<void>;
    deletePost: (postId: string) => Promise<void>;
    deleteMultiplePosts: (postIds: string[]) => Promise<void>;

    subscribers: Subscriber[];
    addSubscriber: (email: string) => Promise<boolean>;
    deleteSubscriber: (id: string) => Promise<void>;

    contacts: ContactSubmission[];
    addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => Promise<void>;
    deleteContact: (id: string) => Promise<void>;

    breakingNews: BreakingNews[];
    addNews: (news: Omit<BreakingNews, 'id'>) => Promise<void>;
    updateNews: (news: BreakingNews) => Promise<void>;
    deleteNews: (id: string) => Promise<void>;
    
    adSettings: AdSettings;
    updateAdSettings: (settings: AdSettings) => Promise<void>;

    seoSettings: SEOSettings;
    updateSEOSettings: (settings: SEOSettings) => Promise<void>;

    generalSettings: GeneralSettings;
    updateGeneralSettings: (settings: GeneralSettings) => Promise<void>;

    socialMediaSettings: SocialMediaSettings;
    updateSocialMediaSettings: (settings: SocialMediaSettings) => Promise<void>;
    
    emailNotifications: EmailNotification[];
    deleteEmailNotification: (id: string) => Promise<void>;
    clearAllEmailNotifications: () => Promise<void>;

    customEmails: CustomEmail[];
    sendCustomEmail: (subject: string, body: string) => Promise<void>;
    deleteCustomEmail: (id: string) => Promise<void>;

    createBackup: () => BackupData;
    restoreBackup: (data: BackupData) => boolean;

    isLoading: boolean;
    error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Helper function for API calls
async function apiCall<T>(url: string, method: string, body?: any): Promise<T> {
    const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API call failed');
    }
    return response.json();
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
    const [posts, setPosts] = useState<ContentPost[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
    const [adSettings, setAdSettings] = useState<AdSettings>(initialAdSettings);
    const [seoSettings, setSeoSettings] = useState<SEOSettings>(initialSeoSettings);
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(initialGeneralSettings);
    const [socialMediaSettings, setSocialMediaSettings] = useState<SocialMediaSettings>(initialSocialMediaSettings);
    const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);
    const [customEmails, setCustomEmails] = useState<CustomEmail[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await apiCall<any>('/api/data', 'GET');
            setJobs(data.jobs || []);
            setQuickLinks(data.quickLinks || []);
            setPosts(data.posts || []);
            setSubscribers(data.subscribers || []);
            setContacts(data.contacts || []);
            setBreakingNews(data.breakingNews || []);
            // Settings should have fallbacks to initial state
            setAdSettings(data.adSettings || initialAdSettings);
            setSeoSettings(data.seoSettings || initialSeoSettings);
            setGeneralSettings(data.generalSettings || initialGeneralSettings);
            setSocialMediaSettings(data.socialMediaSettings || initialSocialMediaSettings);
            setEmailNotifications(data.emailNotifications || []);
            setCustomEmails(data.customEmails || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApiAction = async <T,>(action: () => Promise<T>, successCallback: (result: T) => void) => {
        try {
            const result = await action();
            successCallback(result);
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    // Generic CRUD functions
    const createItem = async <T, U>(endpoint: string, itemData: T, stateSetter: React.Dispatch<React.SetStateAction<U[]>>) => {
        const newItem = await apiCall<U>(endpoint, 'POST', itemData);
        stateSetter(prev => [newItem, ...prev]);
    };
    
    const updateItem = async <T extends { id: string }>(endpoint: string, updatedItem: T, stateSetter: React.Dispatch<React.SetStateAction<T[]>>) => {
        const result = await apiCall<T>(`${endpoint}?id=${updatedItem.id}`, 'PUT', updatedItem);
        stateSetter(prev => prev.map(item => item.id === updatedItem.id ? result : item));
    };

    const deleteItem = async (endpoint: string, id: string, stateSetter: React.Dispatch<React.SetStateAction<any[]>>) => {
        await apiCall(`${endpoint}?id=${id}`, 'DELETE');
        stateSetter(prev => prev.filter(item => item.id !== id));
    };
    
    const deleteMultipleItems = async (endpoint: string, ids: string[], stateSetter: React.Dispatch<React.SetStateAction<any[]>>) => {
        await apiCall(endpoint, 'DELETE', { ids });
        stateSetter(prev => prev.filter(item => !ids.includes(item.id)));
    };


    // Job Management
    const addJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => createItem('/api/jobs', jobData, setJobs);
    const updateJob = (updatedJob: Job) => updateItem('/api/jobs', updatedJob, setJobs);
    const deleteJob = (jobId: string) => deleteItem('/api/jobs', jobId, setJobs);
    const deleteMultipleJobs = (jobIds: string[]) => deleteMultipleItems('/api/jobs', jobIds, setJobs);
    const addMultipleJobs = async (jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => {
        const { count, newJobs } = await apiCall<any>('/api/jobs', 'POST', { jobs: jobsData });
        setJobs(prev => [...newJobs, ...prev]);
        return count;
    };
    
    // QuickLink Management
    const addQuickLink = (linkData: Omit<QuickLink, 'id'>) => createItem('/api/quicklinks', linkData, setQuickLinks);
    const updateQuickLink = (updatedLink: QuickLink) => updateItem('/api/quicklinks', updatedLink, setQuickLinks);
    const deleteQuickLink = (linkId: string) => deleteItem('/api/quicklinks', linkId, setQuickLinks);
    
    // Post Management
    const addPost = (postData: Omit<ContentPost, 'id' | 'createdAt'>) => createItem('/api/posts', postData, setPosts);
    const updatePost = (updatedPost: ContentPost) => updateItem('/api/posts', updatedPost, setPosts);
    const deletePost = (postId: string) => deleteItem('/api/posts', postId, setPosts);
    const deleteMultiplePosts = (postIds: string[]) => deleteMultipleItems('/api/posts', postIds, setPosts);

    // Subscriber Management
    const addSubscriber = async (email: string) => {
       try {
            const { success, subscriber } = await apiCall<any>('/api/subscribers', 'POST', { email });
            if (success) {
                setSubscribers(prev => [subscriber, ...prev]);
            }
            return success;
        } catch (error) {
            console.error(error);
            return false;
        }
    };
    const deleteSubscriber = (id: string) => deleteItem('/api/subscribers', id, setSubscribers);

    // Contact Management
    const addContact = (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => createItem('/api/contacts', contactData, setContacts);
    const deleteContact = (id: string) => deleteItem('/api/contacts', id, setContacts);
    
    // Breaking News Management
    const addNews = (newsData: Omit<BreakingNews, 'id'>) => createItem('/api/breakingnews', newsData, setBreakingNews);
    const updateNews = (updatedNews: BreakingNews) => updateItem('/api/breakingnews', updatedNews, setBreakingNews);
    const deleteNews = (id: string) => deleteItem('/api/breakingnews', id, setBreakingNews);

    // Settings Management
    const updateAdSettings = (settings: AdSettings) => handleApiAction(() => apiCall('/api/settings', 'POST', { type: 'adSettings', data: settings }), setAdSettings);
    const updateSEOSettings = (settings: SEOSettings) => handleApiAction(() => apiCall('/api/settings', 'POST', { type: 'seoSettings', data: settings }), setSeoSettings);
    const updateGeneralSettings = (settings: GeneralSettings) => handleApiAction(() => apiCall('/api/settings', 'POST', { type: 'generalSettings', data: settings }), setGeneralSettings);
    const updateSocialMediaSettings = (settings: SocialMediaSettings) => handleApiAction(() => apiCall('/api/settings', 'POST', { type: 'socialMediaSettings', data: settings }), setSocialMediaSettings);
    
    // Notifications and Emails are not fully implemented on the backend for this example.
    // These functions will only update local state for now.
    const deleteEmailNotification = async (id: string) => { setEmailNotifications(prev => prev.filter(n => n.id !== id))};
    const clearAllEmailNotifications = async () => { setEmailNotifications([])};
    const sendCustomEmail = async (subject: string, body: string) => { alert("This functionality requires a backend email service."); };
    const deleteCustomEmail = async (id: string) => { setCustomEmails(prev => prev.filter(e => e.id !== id))};

    // Backup & Restore (Client-side implementation remains)
    const createBackup = (): BackupData => ({ jobs, quickLinks, posts, subscribers, contacts, breakingNews, adSettings, seoSettings, generalSettings, socialMediaSettings, emailNotifications, customEmails });
    const restoreBackup = (): boolean => { alert("Restoring from backup should be done via the database directly. This client-side function is disabled."); return false; };

    const value = {
        jobs, addJob, updateJob, deleteJob, addMultipleJobs, deleteMultipleJobs,
        quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
        posts, addPost, updatePost, deletePost, deleteMultiplePosts,
        subscribers, addSubscriber, deleteSubscriber,
        contacts, addContact, deleteContact,
        breakingNews, addNews, updateNews, deleteNews,
        adSettings, updateAdSettings,
        seoSettings, updateSEOSettings,
        generalSettings, updateGeneralSettings,
        socialMediaSettings, updateSocialMediaSettings,
        emailNotifications, deleteEmailNotification, clearAllEmailNotifications,
        customEmails, sendCustomEmail, deleteCustomEmail,
        createBackup, restoreBackup,
        isLoading, error,
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