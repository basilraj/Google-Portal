import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings,
  SEOSettings, GeneralSettings, SocialMediaSettings, ContactSubmission,
  EmailNotification, CustomEmail, ActivityLog, SMTPSettings, RSSSettings, BackupData
} from '../types';
import { initialAdSettings, initialGeneralSettings, initialSeoSettings, initialSocialMediaSettings, initialSmtpSettings, initialRssSettings } from '../constants';
import useLocalStorage from '../hooks/useLocalStorage';

// Define the shape of the context data
interface DataContextType {
  // Data state
  jobs: Job[];
  quickLinks: QuickLink[];
  posts: ContentPost[];
  subscribers: Subscriber[];
  breakingNews: BreakingNews[];
  contacts: ContactSubmission[];
  emailNotifications: EmailNotification[];
  customEmails: CustomEmail[];
  activityLogs: ActivityLog[];
  adSettings: AdSettings;
  seoSettings: SEOSettings;
  generalSettings: GeneralSettings;
  socialMediaSettings: SocialMediaSettings;
  smtpSettings: SMTPSettings;
  rssSettings: RSSSettings;

  isLoading: boolean;
  error: string | null;

  // Functions to update data
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<Job | null>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addMultipleJobs: (jobs: Omit<Job, 'id'|'status'|'createdAt'>[]) => Promise<number>;
  deleteMultipleJobs: (ids: string[]) => Promise<void>;

  addQuickLink: (link: Omit<QuickLink, 'id'>) => Promise<void>;
  updateQuickLink: (link: QuickLink) => Promise<void>;
  deleteQuickLink: (id: string) => Promise<void>;
  
  addPost: (post: Omit<ContentPost, 'id' | 'createdAt'>) => Promise<void>;
  updatePost: (post: ContentPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  deleteMultiplePosts: (ids: string[]) => Promise<void>;

  addSubscriber: (email: string) => Promise<{success: boolean, message: string}>;
  deleteSubscriber: (id: string) => Promise<void>;

  addNews: (news: Omit<BreakingNews, 'id'>) => Promise<void>;
  updateNews: (news: BreakingNews) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  
  addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  updateAdSettings: (settings: AdSettings) => Promise<void>;
  updateSEOSettings: (settings: SEOSettings) => Promise<void>;
  updateGeneralSettings: (settings: GeneralSettings) => Promise<void>;
  updateSocialMediaSettings: (settings: SocialMediaSettings) => Promise<void>;
  updateSmtpSettings: (settings: SMTPSettings) => Promise<void>;
  updateRssSettings: (settings: RSSSettings) => Promise<void>;

  // Activity Logs
  addActivityLog: (action: string, details: string) => Promise<void>;
  clearActivityLogs: () => Promise<void>;

  // Backup & Restore
  createBackup: () => BackupData;
  restoreBackup: (data: BackupData) => boolean;

  // Email Marketing
  sendCustomEmail: (subject: string, body: string) => Promise<void>;
  deleteCustomEmail: (id: string) => Promise<void>;

  // Notification History
  deleteEmailNotification: (id: string) => Promise<void>;
  clearAllEmailNotifications: () => Promise<void>;
}

// Create the context with a default undefined value
const DataContext = createContext<DataContextType | undefined>(undefined);

// The provider component
export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useLocalStorage for data persistence during development/offline
  const [jobs, setJobs] = useLocalStorage<Job[]>('data-jobs', []);
  const [quickLinks, setQuickLinks] = useLocalStorage<QuickLink[]>('data-quickLinks', []);
  const [posts, setPosts] = useLocalStorage<ContentPost[]>('data-posts', []);
  const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>('data-subscribers', []);
  const [breakingNews, setBreakingNews] = useLocalStorage<BreakingNews[]>('data-breakingNews', []);
  const [contacts, setContacts] = useLocalStorage<ContactSubmission[]>('data-contacts', []);
  const [emailNotifications, setEmailNotifications] = useLocalStorage<EmailNotification[]>('data-emailNotifications', []);
  const [customEmails, setCustomEmails] = useLocalStorage<CustomEmail[]>('data-customEmails', []);
  const [activityLogs, setActivityLogs] = useLocalStorage<ActivityLog[]>('data-activityLogs', []);
  const [adSettings, setAdSettings] = useLocalStorage<AdSettings>('data-adSettings', initialAdSettings);
  const [seoSettings, setSeoSettings] = useLocalStorage<SEOSettings>('data-seoSettings', initialSeoSettings);
  const [generalSettings, setGeneralSettings] = useLocalStorage<GeneralSettings>('data-generalSettings', initialGeneralSettings);
  const [socialMediaSettings, setSocialMediaSettings] = useLocalStorage<SocialMediaSettings>('data-socialMediaSettings', initialSocialMediaSettings);
  const [smtpSettings, setSmtpSettings] = useLocalStorage<SMTPSettings>('data-smtpSettings', initialSmtpSettings);
  const [rssSettings, setRssSettings] = useLocalStorage<RSSSettings>('data-rssSettings', initialRssSettings);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch data from server.');
        const data = await response.json();
        setJobs(data.jobs || []);
        setQuickLinks(data.quickLinks || []);
        setPosts(data.posts || []);
        setSubscribers(data.subscribers || []);
        setBreakingNews(data.breakingNews || []);
        setContacts(data.contacts || []);
        setEmailNotifications(data.emailNotifications || []);
        setCustomEmails(data.customEmails || []);
        setAdSettings(data.adSettings || initialAdSettings);
        setSeoSettings(data.seoSettings || initialSeoSettings);
        setGeneralSettings(data.generalSettings || initialGeneralSettings);
        setSocialMediaSettings(data.socialMediaSettings || initialSocialMediaSettings);
        setSmtpSettings(data.smtpSettings || initialSmtpSettings);
        setRssSettings(data.rssSettings || initialRssSettings);
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch initial data:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount
  
  const addActivityLog = useCallback(async (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  }, [setActivityLogs]);

  // Generic function to update settings
  const updateSettings = useCallback(async <T,>(type: string, settings: T) => {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data: settings }),
    });
    // Dynamically call the correct state setter
    const setters: { [key: string]: React.Dispatch<React.SetStateAction<any>> } = {
      'adSettings': setAdSettings,
      'seoSettings': setSeoSettings,
      'generalSettings': setGeneralSettings,
      'socialMediaSettings': setSocialMediaSettings,
      'smtpSettings': setSmtpSettings,
      'rssSettings': setRssSettings,
    };
    setters[type](settings);
    await addActivityLog(`${type.replace('Settings', '')} Settings Updated`, 'Configuration saved.');
  }, [addActivityLog, setAdSettings, setSeoSettings, setGeneralSettings, setSocialMediaSettings, setSmtpSettings, setRssSettings]);
  
  // Job Functions
  const addJob = useCallback(async (job: Omit<Job, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    const newJob = await response.json();
    setJobs(prev => [newJob, ...prev]);
    await addActivityLog('Job Created', `New job added: ${newJob.title}`);
    return newJob;
  }, [setJobs, addActivityLog]);
  
  const addMultipleJobs = useCallback(async (jobsData: Omit<Job, 'id'|'status'|'createdAt'>[]) => {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobs: jobsData }),
    });
    const { count, newJobs } = await response.json();
    setJobs(prev => [...newJobs, ...prev]);
    await addActivityLog('Bulk Jobs Uploaded', `${count} new jobs added via bulk upload.`);
    return count;
  }, [setJobs, addActivityLog]);

  const updateJob = useCallback(async (job: Job) => {
    await fetch(`/api/jobs?id=${job.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    setJobs(prev => prev.map(j => j.id === job.id ? job : j));
    await addActivityLog('Job Updated', `Job details updated for: ${job.title}`);
  }, [setJobs, addActivityLog]);

  const deleteJob = useCallback(async (id: string) => {
    await fetch(`/api/jobs?id=${id}`, { method: 'DELETE' });
    const jobTitle = jobs.find(j => j.id === id)?.title || 'Unknown Job';
    setJobs(prev => prev.filter(j => j.id !== id));
    await addActivityLog('Job Deleted', `Job deleted: ${jobTitle}`);
  }, [jobs, setJobs, addActivityLog]);

  const deleteMultipleJobs = useCallback(async (ids: string[]) => {
    await fetch(`/api/jobs`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    setJobs(prev => prev.filter(j => !ids.includes(j.id)));
    await addActivityLog('Bulk Jobs Deleted', `${ids.length} jobs deleted.`);
  }, [setJobs, addActivityLog]);
  
  // QuickLink Functions
  const addQuickLink = useCallback(async (link: Omit<QuickLink, 'id'>) => {
    const response = await fetch('/api/quicklinks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    const newLink = await response.json();
    setQuickLinks(prev => [newLink, ...prev]);
    await addActivityLog('Quick Link Created', `New link added: ${newLink.title}`);
  }, [setQuickLinks, addActivityLog]);

  const updateQuickLink = useCallback(async (link: QuickLink) => {
    await fetch(`/api/quicklinks?id=${link.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(link),
    });
    setQuickLinks(prev => prev.map(l => l.id === link.id ? link : l));
    await addActivityLog('Quick Link Updated', `Link updated: ${link.title}`);
  }, [setQuickLinks, addActivityLog]);

  const deleteQuickLink = useCallback(async (id: string) => {
    await fetch(`/api/quicklinks?id=${id}`, { method: 'DELETE' });
    const linkTitle = quickLinks.find(l => l.id === id)?.title || 'Unknown Link';
    setQuickLinks(prev => prev.filter(l => l.id !== id));
    await addActivityLog('Quick Link Deleted', `Link deleted: ${linkTitle}`);
  }, [quickLinks, setQuickLinks, addActivityLog]);
  
  // ContentPost Functions
  const addPost = useCallback(async (post: Omit<ContentPost, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    const newPost = await response.json();
    setPosts(prev => [newPost, ...prev]);
    await addActivityLog('Post Created', `New post added: ${newPost.title}`);
  }, [setPosts, addActivityLog]);

  const updatePost = useCallback(async (post: ContentPost) => {
    await fetch(`/api/posts?id=${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post),
    });
    setPosts(prev => prev.map(p => p.id === post.id ? post : p));
    await addActivityLog('Post Updated', `Post updated: ${post.title}`);
  }, [setPosts, addActivityLog]);

  const deletePost = useCallback(async (id: string) => {
    await fetch(`/api/posts?id=${id}`, { method: 'DELETE' });
    const postTitle = posts.find(p => p.id === id)?.title || 'Unknown Post';
    setPosts(prev => prev.filter(p => p.id !== id));
    await addActivityLog('Post Deleted', `Post deleted: ${postTitle}`);
  }, [posts, setPosts, addActivityLog]);

  const deleteMultiplePosts = useCallback(async (ids: string[]) => {
    await fetch(`/api/posts`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    setPosts(prev => prev.filter(p => !ids.includes(p.id)));
    await addActivityLog('Bulk Posts Deleted', `${ids.length} posts deleted.`);
  }, [setPosts, addActivityLog]);
  
  // Other data type functions...
  const addSubscriber = useCallback(async (email: string) => {
    const response = await fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if(data.success){
      setSubscribers(prev => [data.subscriber, ...prev]);
      await addActivityLog('New Subscriber', `New subscription from: ${email}`);
    }
    return data;
  }, [setSubscribers, addActivityLog]);

  const deleteSubscriber = useCallback(async (id: string) => {
    await fetch(`/api/subscribers?id=${id}`, { method: 'DELETE' });
    const subEmail = subscribers.find(s => s.id === id)?.email || 'Unknown';
    setSubscribers(prev => prev.filter(s => s.id !== id));
    await addActivityLog('Subscriber Deleted', `Unsubscribed: ${subEmail}`);
  }, [subscribers, setSubscribers, addActivityLog]);

  const addNews = useCallback(async (news: Omit<BreakingNews, 'id'>) => {
    const response = await fetch('/api/breakingnews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(news),
    });
    const newNews = await response.json();
    setBreakingNews(prev => [newNews, ...prev]);
    await addActivityLog('Breaking News Added', `New item: ${newNews.text}`);
  }, [setBreakingNews, addActivityLog]);

  const updateNews = useCallback(async (news: BreakingNews) => {
    await fetch(`/api/breakingnews?id=${news.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(news),
    });
    setBreakingNews(prev => prev.map(n => n.id === news.id ? news : n));
    await addActivityLog('Breaking News Updated', `Updated item: ${news.text}`);
  }, [setBreakingNews, addActivityLog]);
  
  const deleteNews = useCallback(async (id: string) => {
    await fetch(`/api/breakingnews?id=${id}`, { method: 'DELETE' });
    const newsText = breakingNews.find(n => n.id === id)?.text || 'Unknown';
    setBreakingNews(prev => prev.filter(n => n.id !== id));
    await addActivityLog('Breaking News Deleted', `Deleted item: ${newsText}`);
  }, [breakingNews, setBreakingNews, addActivityLog]);
  
  const addContact = useCallback(async (contact: Omit<ContactSubmission, 'id'|'submittedAt'>) => {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    const newContact = await response.json();
    setContacts(prev => [newContact, ...prev]);
    await addActivityLog('Contact Form Submitted', `New message from ${contact.name}`);
  }, [setContacts, addActivityLog]);

  const deleteContact = useCallback(async (id: string) => {
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
    const contactName = contacts.find(c => c.id === id)?.name || 'Unknown';
    setContacts(prev => prev.filter(c => c.id !== id));
    await addActivityLog('Contact Message Deleted', `Deleted message from ${contactName}`);
  }, [contacts, setContacts, addActivityLog]);
  
  const clearActivityLogs = useCallback(async () => {
      setActivityLogs([]);
      // In a real app, you might want to call an API endpoint to clear server-side logs as well.
      await addActivityLog('Logs Cleared', 'Activity log history has been cleared.');
  }, [setActivityLogs, addActivityLog]);

  const createBackup = useCallback((): BackupData => {
    return {
      jobs, quickLinks, posts, subscribers, breakingNews,
      adSettings, seoSettings, generalSettings, socialMediaSettings,
      activityLogs, smtpSettings, rssSettings
    };
  }, [jobs, quickLinks, posts, subscribers, breakingNews, adSettings, seoSettings, generalSettings, socialMediaSettings, activityLogs, smtpSettings, rssSettings]);

  const restoreBackup = useCallback((data: BackupData): boolean => {
    try {
      // Basic validation
      if (!data.jobs || !data.generalSettings || !data.posts) {
        return false;
      }
      setJobs(data.jobs);
      setQuickLinks(data.quickLinks);
      setPosts(data.posts);
      setSubscribers(data.subscribers);
      setBreakingNews(data.breakingNews);
      setAdSettings(data.adSettings);
      setSeoSettings(data.seoSettings);
      setGeneralSettings(data.generalSettings);
      setSocialMediaSettings(data.socialMediaSettings);
      setActivityLogs(data.activityLogs);
      setSmtpSettings(data.smtpSettings);
      setRssSettings(data.rssSettings);
      addActivityLog('System Restore', 'Data restored from a backup file.');
      return true;
    } catch (e) {
      console.error("Backup restore failed", e);
      return false;
    }
  }, [setJobs, setQuickLinks, setPosts, setSubscribers, setBreakingNews, setAdSettings, setSeoSettings, setGeneralSettings, setSocialMediaSettings, setActivityLogs, setSmtpSettings, setRssSettings, addActivityLog]);

  const sendCustomEmail = useCallback(async (subject: string, body: string) => {
    const newEmail: CustomEmail = { id: Date.now().toString(), subject, body, sentAt: new Date().toISOString() };
    setCustomEmails(prev => [newEmail, ...prev]);
    // SIMULATION: In a real app, this would call a backend service to send emails.
    // We will just log it.
    await addActivityLog('Email Campaign Sent', `Sent campaign "${subject}" to ${subscribers.filter(s => s.status === 'active').length} subscribers.`);
  }, [addActivityLog, setCustomEmails, subscribers]);

  const deleteCustomEmail = useCallback(async (id: string) => {
    setCustomEmails(prev => prev.filter(e => e.id !== id));
    await addActivityLog('Campaign Deleted', 'A sent email campaign record was deleted.');
  }, [setCustomEmails, addActivityLog]);

  const deleteEmailNotification = useCallback(async (id: string) => {
      setEmailNotifications(prev => prev.filter(e => e.id !== id));
  }, [setEmailNotifications]);

  const clearAllEmailNotifications = useCallback(async () => {
      setEmailNotifications([]);
      await addActivityLog('Notification History Cleared', 'All email notification records have been deleted.');
  }, [setEmailNotifications, addActivityLog]);

  const contextValue: DataContextType = {
    jobs, quickLinks, posts, subscribers, breakingNews, contacts, emailNotifications, customEmails, activityLogs,
    adSettings, seoSettings, generalSettings, socialMediaSettings, smtpSettings, rssSettings,
    isLoading, error,
    addJob, updateJob, deleteJob, addMultipleJobs, deleteMultipleJobs,
    addQuickLink, updateQuickLink, deleteQuickLink,
    addPost, updatePost, deletePost, deleteMultiplePosts,
    addSubscriber, deleteSubscriber,
    addNews, updateNews, deleteNews,
    addContact, deleteContact,
    updateAdSettings: (s) => updateSettings('adSettings', s),
    updateSEOSettings: (s) => updateSettings('seoSettings', s),
    updateGeneralSettings: (s) => updateSettings('generalSettings', s),
    updateSocialMediaSettings: (s) => updateSettings('socialMediaSettings', s),
    updateSmtpSettings: (s) => updateSettings('smtpSettings', s),
    updateRssSettings: (s) => updateSettings('rssSettings', s),
    addActivityLog,
    clearActivityLogs,
    createBackup,
    restoreBackup,
    sendCustomEmail,
    deleteCustomEmail,
    deleteEmailNotification,
    clearAllEmailNotifications,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

// Custom hook to use the data context
export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
