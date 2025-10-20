import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import {
  Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings,
  SEOSettings, GeneralSettings, SocialMediaSettings, ContactSubmission,
  EmailNotification, CustomEmail, ActivityLog, SMTPSettings, RSSSettings, BackupData
} from '../types.ts';
import { 
    INITIAL_JOBS, INITIAL_POSTS, INITIAL_QUICK_LINKS, INITIAL_SUBSCRIBERS, INITIAL_BREAKING_NEWS, 
    initialAdSettings, initialGeneralSettings, initialSeoSettings, initialSocialMediaSettings, 
    initialSmtpSettings, initialRssSettings, INITIAL_ACTIVITY_LOGS 
} from '../constants.ts';
import useLocalStorage from '../hooks/useLocalStorage.ts';

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

  // Functions to update data
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<Job>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addMultipleJobs: (jobs: Omit<Job, 'id'|'status'|'createdAt'>[]) => Promise<number>;
  deleteMultipleJobs: (ids: string[]) => Promise<void>;
  trackSponsoredAdClick: (adId: string) => Promise<void>;

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

  // Use useLocalStorage for all data to ensure persistence
  const [jobs, setJobs] = useLocalStorage<Job[]>('data-jobs', INITIAL_JOBS);
  const [quickLinks, setQuickLinks] = useLocalStorage<QuickLink[]>('data-quickLinks', INITIAL_QUICK_LINKS);
  const [posts, setPosts] = useLocalStorage<ContentPost[]>('data-posts', INITIAL_POSTS);
  const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>('data-subscribers', INITIAL_SUBSCRIBERS);
  const [breakingNews, setBreakingNews] = useLocalStorage<BreakingNews[]>('data-breakingNews', INITIAL_BREAKING_NEWS);
  const [contacts, setContacts] = useLocalStorage<ContactSubmission[]>('data-contacts', []);
  const [emailNotifications, setEmailNotifications] = useLocalStorage<EmailNotification[]>('data-emailNotifications', []);
  const [customEmails, setCustomEmails] = useLocalStorage<CustomEmail[]>('data-customEmails', []);
  const [activityLogs, setActivityLogs] = useLocalStorage<ActivityLog[]>('data-activityLogs', INITIAL_ACTIVITY_LOGS);
  
  const [adSettings, setAdSettings] = useLocalStorage<AdSettings>('data-adSettings', initialAdSettings);
  const [seoSettings, setSeoSettings] = useLocalStorage<SEOSettings>('data-seoSettings', initialSeoSettings);
  const [generalSettings, setGeneralSettings] = useLocalStorage<GeneralSettings>('data-generalSettings', initialGeneralSettings);
  const [socialMediaSettings, setSocialMediaSettings] = useLocalStorage<SocialMediaSettings>('data-socialMediaSettings', initialSocialMediaSettings);
  const [smtpSettings, setSmtpSettings] = useLocalStorage<SMTPSettings>('data-smtpSettings', initialSmtpSettings);
  const [rssSettings, setRssSettings] = useLocalStorage<RSSSettings>('data-rssSettings', initialRssSettings);

  const addActivityLog = useCallback(async (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  }, [setActivityLogs]);
  
  // Automated job status sync and cleanup
  useEffect(() => {
    const syncAllJobStatuses = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);

        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(today.getDate() - 10);

        let jobsToDelete: string[] = [];
        let statusChangedCount = 0;

        const updatedJobs = jobs.map(job => {
            const lastDate = new Date(job.lastDate);
            let newStatus = job.status;

            if (lastDate < today) {
                newStatus = 'expired';
                if (lastDate < tenDaysAgo) {
                    jobsToDelete.push(job.id);
                }
            } else if (lastDate <= sevenDaysFromNow) {
                newStatus = 'closing-soon';
            } else {
                newStatus = 'active';
            }
            
            if (newStatus !== job.status) {
                statusChangedCount++;
                return { ...job, status: newStatus };
            }
            return job;
        });
        
        const finalJobs = updatedJobs.filter(job => !jobsToDelete.includes(job.id));
        setJobs(finalJobs);

        if (jobsToDelete.length > 0) {
            addActivityLog('System Cleanup', `Automatically deleted ${jobsToDelete.length} expired job(s).`);
        }
        if (statusChangedCount > 0) {
            addActivityLog('System Sync', `Automatically updated status for ${statusChangedCount} job(s).`);
        }
    };
    syncAllJobStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on initial load

  // --- CRUD Functions (Client-Side) ---

  const addJob = useCallback(async (job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> => {
    const newJob: Job = { ...job, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setJobs(prev => [newJob, ...prev]);
    await addActivityLog('Job Created', `New job added: ${newJob.title}`);
    return newJob;
  }, [setJobs, addActivityLog]);

  const updateJob = useCallback(async (job: Job) => {
    setJobs(prev => prev.map(j => (j.id === job.id ? job : j)));
    await addActivityLog('Job Updated', `Job details updated for: ${job.title}`);
  }, [setJobs, addActivityLog]);

  const deleteJob = useCallback(async (id: string) => {
    const jobTitle = jobs.find(j => j.id === id)?.title || 'Unknown Job';
    setJobs(prev => prev.filter(j => j.id !== id));
    await addActivityLog('Job Deleted', `Job deleted: ${jobTitle}`);
  }, [jobs, setJobs, addActivityLog]);
  
  const addMultipleJobs = useCallback(async (jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => {
      const newJobs = jobsData.map(job => ({
          ...job,
          id: `${Date.now()}-${Math.random()}`,
          status: 'active' as const,
          createdAt: new Date().toISOString()
      }));
      setJobs(prev => [...newJobs, ...prev]);
      await addActivityLog('Bulk Jobs Uploaded', `${newJobs.length} new jobs added via bulk upload.`);
      return newJobs.length;
  }, [setJobs, addActivityLog]);

  const deleteMultipleJobs = useCallback(async (ids: string[]) => {
    setJobs(prev => prev.filter(j => !ids.includes(j.id)));
    await addActivityLog('Bulk Jobs Deleted', `${ids.length} jobs deleted.`);
  }, [setJobs, addActivityLog]);
  
  const trackSponsoredAdClick = useCallback(async (adId: string) => {
    setAdSettings(prev => ({
        ...prev,
        sponsoredAds: prev.sponsoredAds.map(ad => 
            ad.id === adId ? { ...ad, clicks: (ad.clicks || 0) + 1 } : ad
        )
    }));
  }, [setAdSettings]);

  const addQuickLink = useCallback(async (link: Omit<QuickLink, 'id'>) => {
    const newLink = { ...link, id: Date.now().toString() };
    setQuickLinks(prev => [newLink, ...prev]);
    await addActivityLog('Quick Link Created', `New link added: ${newLink.title}`);
  }, [setQuickLinks, addActivityLog]);

  const updateQuickLink = useCallback(async (link: QuickLink) => {
    setQuickLinks(prev => prev.map(l => (l.id === link.id ? link : l)));
    await addActivityLog('Quick Link Updated', `Link updated: ${link.title}`);
  }, [setQuickLinks, addActivityLog]);

  const deleteQuickLink = useCallback(async (id: string) => {
    const linkTitle = quickLinks.find(l => l.id === id)?.title || 'Unknown Link';
    setQuickLinks(prev => prev.filter(l => l.id !== id));
    await addActivityLog('Quick Link Deleted', `Link deleted: ${linkTitle}`);
  }, [quickLinks, setQuickLinks, addActivityLog]);

  const addPost = useCallback(async (post: Omit<ContentPost, 'id' | 'createdAt'>) => {
    const newPost = { ...post, id: Date.now().toString(), createdAt: new Date().toISOString() };
    setPosts(prev => [newPost, ...prev]);
    await addActivityLog('Post Created', `New post added: ${newPost.title}`);
  }, [setPosts, addActivityLog]);

  const updatePost = useCallback(async (post: ContentPost) => {
    setPosts(prev => prev.map(p => (p.id === post.id ? post : p)));
    await addActivityLog('Post Updated', `Post updated: ${post.title}`);
  }, [setPosts, addActivityLog]);

  const deletePost = useCallback(async (id: string) => {
    const postTitle = posts.find(p => p.id === id)?.title || 'Unknown Post';
    setPosts(prev => prev.filter(p => p.id !== id));
    await addActivityLog('Post Deleted', `Post deleted: ${postTitle}`);
  }, [posts, setPosts, addActivityLog]);

  const deleteMultiplePosts = useCallback(async (ids: string[]) => {
    setPosts(prev => prev.filter(p => !ids.includes(p.id)));
    await addActivityLog('Bulk Posts Deleted', `${ids.length} posts deleted.`);
  }, [setPosts, addActivityLog]);

  const addSubscriber = useCallback(async (email: string) => {
    if (subscribers.some(s => s.email === email)) {
        return { success: false, message: 'Email already subscribed' };
    }
    const newSubscriber: Subscriber = {
        id: Date.now().toString(),
        email,
        subscriptionDate: new Date().toISOString().split('T')[0],
        status: 'active',
    };
    setSubscribers(prev => [newSubscriber, ...prev]);
    await addActivityLog('New Subscriber', `New subscription from: ${email}`);
    return { success: true, message: 'Subscribed successfully!' };
  }, [subscribers, setSubscribers, addActivityLog]);
  
  const deleteSubscriber = useCallback(async (id: string) => {
    const subEmail = subscribers.find(s => s.id === id)?.email || 'Unknown';
    setSubscribers(prev => prev.filter(s => s.id !== id));
    await addActivityLog('Subscriber Deleted', `Unsubscribed: ${subEmail}`);
  }, [subscribers, setSubscribers, addActivityLog]);

  const addNews = useCallback(async (news: Omit<BreakingNews, 'id'>) => {
    const newNews = { ...news, id: Date.now().toString() };
    setBreakingNews(prev => [newNews, ...prev]);
    await addActivityLog('Breaking News Added', `New item: ${newNews.text}`);
  }, [setBreakingNews, addActivityLog]);

  const updateNews = useCallback(async (news: BreakingNews) => {
    setBreakingNews(prev => prev.map(n => (n.id === news.id ? news : n)));
    await addActivityLog('Breaking News Updated', `Updated item: ${news.text}`);
  }, [setBreakingNews, addActivityLog]);

  const deleteNews = useCallback(async (id: string) => {
    const newsText = breakingNews.find(n => n.id === id)?.text || 'Unknown';
    setBreakingNews(prev => prev.filter(n => n.id !== id));
    await addActivityLog('Breaking News Deleted', `Deleted item: ${newsText}`);
  }, [breakingNews, setBreakingNews, addActivityLog]);

  const addContact = useCallback(async (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
    const newContact = { ...contact, id: Date.now().toString(), submittedAt: new Date().toISOString() };
    setContacts(prev => [newContact, ...prev]);
    await addActivityLog('Contact Form Submitted', `New message from ${contact.name}`);
  }, [setContacts, addActivityLog]);

  const deleteContact = useCallback(async (id: string) => {
    const contactName = contacts.find(c => c.id === id)?.name || 'Unknown';
    setContacts(prev => prev.filter(c => c.id !== id));
    await addActivityLog('Contact Message Deleted', `Deleted message from ${contactName}`);
  }, [contacts, setContacts, addActivityLog]);
  
  const updateAdSettings = useCallback(async (s: AdSettings) => { setAdSettings(s); await addActivityLog('Settings Updated', 'Advertisement settings were modified.'); }, [setAdSettings, addActivityLog]);
  const updateSEOSettings = useCallback(async (s: SEOSettings) => { setSeoSettings(s); await addActivityLog('Settings Updated', 'SEO settings were modified.'); }, [setSeoSettings, addActivityLog]);
  const updateGeneralSettings = useCallback(async (s: GeneralSettings) => { setGeneralSettings(s); await addActivityLog('Settings Updated', 'General settings were modified.'); }, [setGeneralSettings, addActivityLog]);
  const updateSocialMediaSettings = useCallback(async (s: SocialMediaSettings) => { setSocialMediaSettings(s); await addActivityLog('Settings Updated', 'Social Media settings were modified.'); }, [setSocialMediaSettings, addActivityLog]);
  const updateSmtpSettings = useCallback(async (s: SMTPSettings) => { setSmtpSettings(s); await addActivityLog('Settings Updated', 'SMTP settings were modified.'); }, [setSmtpSettings, addActivityLog]);
  const updateRssSettings = useCallback(async (s: RSSSettings) => { setRssSettings(s); await addActivityLog('Settings Updated', 'RSS settings were modified.'); }, [setRssSettings, addActivityLog]);

  const clearActivityLogs = useCallback(async () => {
      setActivityLogs([]);
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
      if (!data.jobs || !data.generalSettings) return false;
      setJobs(data.jobs || []);
      setQuickLinks(data.quickLinks || []);
      setPosts(data.posts || []);
      setSubscribers(data.subscribers || []);
      setBreakingNews(data.breakingNews || []);
      // Merge settings to prevent errors with older backups
      setAdSettings(prev => ({ ...prev, ...data.adSettings }));
      setSeoSettings(prev => ({ ...prev, ...data.seoSettings }));
      setGeneralSettings(prev => ({ ...prev, ...data.generalSettings }));
      setSocialMediaSettings(prev => ({ ...prev, ...data.socialMediaSettings }));
      setActivityLogs(data.activityLogs || []);
      setSmtpSettings(prev => ({ ...prev, ...data.smtpSettings }));
      setRssSettings(prev => ({ ...prev, ...data.rssSettings }));
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
    await addActivityLog('Email Campaign Sent', `Sent campaign "${subject}" to ${subscribers.filter(s => s.status === 'active').length} subscribers (Simulated).`);
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
    addJob, updateJob, deleteJob, addMultipleJobs, deleteMultipleJobs, trackSponsoredAdClick,
    addQuickLink, updateQuickLink, deleteQuickLink,
    addPost, updatePost, deletePost, deleteMultiplePosts,
    addSubscriber, deleteSubscriber,
    addNews, updateNews, deleteNews,
    addContact, deleteContact,
    updateAdSettings, updateSEOSettings, updateGeneralSettings, updateSocialMediaSettings, updateSmtpSettings, updateRssSettings,
    addActivityLog, clearActivityLogs,
    createBackup, restoreBackup,
    sendCustomEmail, deleteCustomEmail,
    deleteEmailNotification, clearAllEmailNotifications,
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