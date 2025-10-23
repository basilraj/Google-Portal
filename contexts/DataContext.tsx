import React, { createContext, useContext, ReactNode, useCallback, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.ts';
import { 
    Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, 
    SocialMediaSettings, SMTPSettings, ActivityLog, ContactSubmission, EmailNotification, CustomEmail, 
    BackupData, RSSSettings, AlertSettings, SponsoredAd, PlacementKey, PopupAdSettings, ThemeSettings,
    SecuritySettings, DemoUserSettings, EmailTemplate, GoogleSearchConsoleSettings, PreparationCourse, PreparationBook, UpcomingExam
} from '../types.ts';
import { 
    INITIAL_JOBS, INITIAL_QUICK_LINKS, INITIAL_POSTS, INITIAL_SUBSCRIBERS, INITIAL_BREAKING_NEWS, 
    initialAdSettings, initialSeoSettings, initialGeneralSettings, initialSocialMediaSettings, 
    initialSmtpSettings, INITIAL_ACTIVITY_LOGS, initialRssSettings, initialAlertSettings, INITIAL_SPONSORED_ADS,
    initialPopupAdSettings, initialThemeSettings, initialSecuritySettings, initialDemoUserSettings, INITIAL_EMAIL_TEMPLATES, initialGoogleSearchConsoleSettings,
    INITIAL_PREPARATION_COURSES, INITIAL_PREPARATION_BOOKS, INITIAL_UPCOMING_EXAMS
} from '../constants.ts';
import { isLocalStorageAvailable } from '../utils/storage.ts';
import { slugify } from '../utils/slugify.ts';
import { basePath } from '../App.tsx';

const getNameFromEmail = (email: string): string => {
    if (!email || !email.includes('@')) return 'Subscriber';
    const namePart = email.split('@')[0];
    // Replace dots/underscores/hyphens with spaces and capitalize each word
    return namePart
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};


interface DataContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'createdAt'>) => Promise<Job | null>;
  updateJob: (job: Job) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  addMultipleJobs: (jobs: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => Promise<Job[]>;
  deleteMultipleJobs: (ids: string[]) => Promise<void>;

  quickLinks: QuickLink[];
  addQuickLink: (link: Omit<QuickLink, 'id'>) => Promise<void>;
  updateQuickLink: (link: QuickLink) => Promise<void>;
  deleteQuickLink: (id: string) => Promise<void>;

  posts: ContentPost[];
  addPost: (post: Omit<ContentPost, 'id' | 'createdAt'>) => Promise<void>;
  updatePost: (post: ContentPost) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  deleteMultiplePosts: (ids: string[]) => Promise<void>;
  
  subscribers: Subscriber[];
  addSubscriber: (email: string) => Promise<{ success: boolean; message?: string; }>;
  deleteSubscriber: (id: string) => Promise<void>;

  breakingNews: BreakingNews[];
  addNews: (news: Omit<BreakingNews, 'id'>) => Promise<void>;
  updateNews: (news: BreakingNews) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;

  sponsoredAds: SponsoredAd[];
  addSponsoredAd: (ad: Omit<SponsoredAd, 'id'>) => Promise<void>;
  updateSponsoredAd: (ad: SponsoredAd) => Promise<void>;
  deleteSponsoredAd: (id: string) => Promise<void>;

  adSettings: AdSettings;
  updateAdSettings: (settings: AdSettings) => Promise<void>;
  trackSponsoredAdClick: (adId: string) => void;
  toggleAdTest: (placement: PlacementKey) => void;

  seoSettings: SEOSettings;
  updateSEOSettings: (settings: SEOSettings) => Promise<void>;

  generalSettings: GeneralSettings;
  updateGeneralSettings: (settings: GeneralSettings) => Promise<void>;

  socialMediaSettings: SocialMediaSettings;
  updateSocialMediaSettings: (settings: SocialMediaSettings) => Promise<void>;

  smtpSettings: SMTPSettings;
  updateSmtpSettings: (settings: SMTPSettings) => Promise<void>;
  
  rssSettings: RSSSettings;
  updateRssSettings: (settings: RSSSettings) => Promise<void>;

  alertSettings: AlertSettings;
  updateAlertSettings: (settings: AlertSettings) => Promise<void>;
  
  popupAdSettings: PopupAdSettings;
  updatePopupAdSettings: (settings: PopupAdSettings) => Promise<void>;

  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: ThemeSettings) => Promise<void>;

  securitySettings: SecuritySettings;
  updateSecuritySettings: (settings: SecuritySettings) => Promise<void>;

  demoUserSettings: DemoUserSettings;
  updateDemoUserSettings: (settings: DemoUserSettings) => Promise<void>;

  googleSearchConsoleSettings: GoogleSearchConsoleSettings;
  updateGoogleSearchConsoleSettings: (settings: GoogleSearchConsoleSettings) => Promise<void>;

  activityLogs: ActivityLog[];
  addActivityLog: (action: string, details: string) => Promise<void>;
  clearActivityLogs: () => void;
  
  contacts: ContactSubmission[];
  addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  emailNotifications: EmailNotification[];
  deleteEmailNotification: (id: string) => void;
  clearAllEmailNotifications: () => void;

  customEmails: CustomEmail[];
  sendCustomEmail: (subject: string, body: string) => void;
  deleteCustomEmail: (id: string) => void;

  emailTemplates: EmailTemplate[];
  addEmailTemplate: (template: Omit<EmailTemplate, 'id'>) => Promise<void>;
  updateEmailTemplate: (template: EmailTemplate) => Promise<void>;
  deleteEmailTemplate: (id: string) => Promise<void>;
  
  sendNewJobAlert: (job: Job) => Promise<void>;
  sendBulkJobAlerts: (jobs: Job[]) => Promise<void>;

  preparationCourses: PreparationCourse[];
  addPreparationCourse: (course: Omit<PreparationCourse, 'id'>) => Promise<void>;
  updatePreparationCourse: (course: PreparationCourse) => Promise<void>;
  deletePreparationCourse: (id: string) => Promise<void>;

  preparationBooks: PreparationBook[];
  addPreparationBook: (book: Omit<PreparationBook, 'id'>) => Promise<void>;
  updatePreparationBook: (book: PreparationBook) => Promise<void>;
  deletePreparationBook: (id: string) => Promise<void>;

  upcomingExams: UpcomingExam[];
  addUpcomingExam: (exam: Omit<UpcomingExam, 'id'>) => Promise<void>;
  updateUpcomingExam: (exam: UpcomingExam) => Promise<void>;
  deleteUpcomingExam: (id: string) => Promise<void>;

  isPersistenceActive: boolean;
  
  createBackup: () => BackupData;
  restoreBackup: (data: BackupData) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jobs, setJobs] = useLocalStorage<Job[]>('jobs', INITIAL_JOBS);
    const [quickLinks, setQuickLinks] = useLocalStorage<QuickLink[]>('quick-links', INITIAL_QUICK_LINKS);
    const [posts, setPosts] = useLocalStorage<ContentPost[]>('posts', INITIAL_POSTS);
    const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>('subscribers', INITIAL_SUBSCRIBERS);
    const [breakingNews, setBreakingNews] = useLocalStorage<BreakingNews[]>('breaking-news', INITIAL_BREAKING_NEWS);
    const [adSettings, setAdSettings] = useLocalStorage<AdSettings>('ad-settings', initialAdSettings);
    const [seoSettings, setSeoSettings] = useLocalStorage<SEOSettings>('seo-settings', initialSeoSettings);
    const [generalSettings, setGeneralSettings] = useLocalStorage<GeneralSettings>('general-settings', initialGeneralSettings);
    const [socialMediaSettings, setSocialMediaSettings] = useLocalStorage<SocialMediaSettings>('social-media-settings', initialSocialMediaSettings);
    const [smtpSettings, setSmtpSettings] = useLocalStorage<SMTPSettings>('smtp-settings', initialSmtpSettings);
    const [rssSettings, setRssSettings] = useLocalStorage<RSSSettings>('rss-settings', initialRssSettings);
    const [alertSettings, setAlertSettings] = useLocalStorage<AlertSettings>('alert-settings', initialAlertSettings);
    const [popupAdSettings, setPopupAdSettings] = useLocalStorage<PopupAdSettings>('popup-ad-settings', initialPopupAdSettings);
    const [themeSettings, setThemeSettings] = useLocalStorage<ThemeSettings>('theme-settings', initialThemeSettings);
    const [securitySettings, setSecuritySettings] = useLocalStorage<SecuritySettings>('security-settings', initialSecuritySettings);
    const [demoUserSettings, setDemoUserSettings] = useLocalStorage<DemoUserSettings>('demo-user-settings', initialDemoUserSettings);
    const [googleSearchConsoleSettings, setGoogleSearchConsoleSettings] = useLocalStorage<GoogleSearchConsoleSettings>('gsc-settings', initialGoogleSearchConsoleSettings);
    const [activityLogs, setActivityLogs] = useLocalStorage<ActivityLog[]>('activity-logs', INITIAL_ACTIVITY_LOGS);
    const [contacts, setContacts] = useLocalStorage<ContactSubmission[]>('contacts', []);
    const [emailNotifications, setEmailNotifications] = useLocalStorage<EmailNotification[]>('email-notifications', []);
    const [customEmails, setCustomEmails] = useLocalStorage<CustomEmail[]>('custom-emails', []);
    const [sponsoredAds, setSponsoredAds] = useLocalStorage<SponsoredAd[]>('sponsored-ads', INITIAL_SPONSORED_ADS);
    const [emailTemplates, setEmailTemplates] = useLocalStorage<EmailTemplate[]>('email-templates', INITIAL_EMAIL_TEMPLATES);
    const [preparationCourses, setPreparationCourses] = useLocalStorage<PreparationCourse[]>('prep-courses', INITIAL_PREPARATION_COURSES);
    const [preparationBooks, setPreparationBooks] = useLocalStorage<PreparationBook[]>('prep-books', INITIAL_PREPARATION_BOOKS);
    const [upcomingExams, setUpcomingExams] = useLocalStorage<UpcomingExam[]>('upcoming-exams', INITIAL_UPCOMING_EXAMS);

    const addActivityLog = useCallback(async (action: string, details: string) => {
        const newLog: ActivityLog = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            action,
            details,
        };
        setActivityLogs(prev => [newLog, ...prev.slice(0, 499)]); // Keep max 500 logs
    }, [setActivityLogs]);

    // Automated job status sync and cleanup effect
    useEffect(() => {
        const syncAllJobStatuses = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const sevenDaysFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);

            let changed = false;
            let jobsToKeep: Job[] = [];

            jobs.forEach(job => {
                const lastDate = new Date(job.lastDate);
                lastDate.setHours(0, 0, 0, 0);

                // Auto-delete old expired jobs
                if (job.status === 'expired' && lastDate < tenDaysAgo) {
                    addActivityLog('Job Auto-Deleted', `Expired job removed: "${job.title}"`);
                    changed = true;
                    return; // Skip adding to jobsToKeep
                }
                
                let newStatus = job.status;
                if (lastDate < today) {
                    newStatus = 'expired';
                } else if (lastDate <= sevenDaysFromNow) {
                    newStatus = 'closing-soon';
                } else {
                    newStatus = 'active';
                }

                if (newStatus !== job.status) {
                    jobsToKeep.push({ ...job, status: newStatus });
                    changed = true;
                } else {
                    jobsToKeep.push(job);
                }
            });

            if (changed) {
                setJobs(jobsToKeep);
            }
        };

        syncAllJobStatuses();
        // This effect should only run once on initial load.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const updateRssSettings = useCallback(async (settings: RSSSettings) => {
        setRssSettings(settings);
        await addActivityLog('Settings Updated', 'RSS settings were updated.');
    }, [setRssSettings, addActivityLog]);

    const updateAlertSettings = useCallback(async (settings: AlertSettings) => {
        setAlertSettings(settings);
        await addActivityLog('Settings Updated', 'Alert settings were updated.');
    }, [setAlertSettings, addActivityLog]);

    const updatePopupAdSettings = useCallback(async (settings: PopupAdSettings) => {
        setPopupAdSettings(settings);
        await addActivityLog('Settings Updated', 'Popup ad settings were updated.');
    }, [setPopupAdSettings, addActivityLog]);

    const updateThemeSettings = useCallback(async (settings: ThemeSettings) => {
        setThemeSettings(settings);
        await addActivityLog('Settings Updated', 'Theme settings were updated.');
    }, [setThemeSettings, addActivityLog]);

    const updateSecuritySettings = useCallback(async (settings: SecuritySettings) => {
        setSecuritySettings(settings);
        await addActivityLog('Settings Updated', 'Security settings were updated.');
    }, [setSecuritySettings, addActivityLog]);
    
    const updateDemoUserSettings = useCallback(async (settings: DemoUserSettings) => {
        setDemoUserSettings(settings);
        await addActivityLog('Settings Updated', 'Demo user permissions were updated.');
    }, [setDemoUserSettings, addActivityLog]);

    const updateGoogleSearchConsoleSettings = useCallback(async (settings: GoogleSearchConsoleSettings) => {
        setGoogleSearchConsoleSettings(settings);
        await addActivityLog('Settings Updated', 'Google Search Console settings were updated.');
    }, [setGoogleSearchConsoleSettings, addActivityLog]);

    const addJob = useCallback(async (job: Omit<Job, 'id' | 'createdAt'>) => {
        const newJob = { ...job, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setJobs(prev => [...prev, newJob]);
        await addActivityLog('Job Created', `New job added: "${job.title}"`);
        return newJob;
    }, [setJobs, addActivityLog]);

    const updateJob = useCallback(async (job: Job) => {
        setJobs(prev => prev.map(j => j.id === job.id ? job : j));
        await addActivityLog('Job Updated', `Job updated: "${job.title}"`);
    }, [setJobs, addActivityLog]);

    const deleteJob = useCallback(async (id: string) => {
        const jobToDelete = jobs.find(j => j.id === id);
        setJobs(prev => prev.filter(j => j.id !== id));
        if (jobToDelete) {
            await addActivityLog('Job Deleted', `Job deleted: "${jobToDelete.title}"`);
        }
    }, [jobs, setJobs, addActivityLog]);

    const addMultipleJobs = useCallback(async (jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[]) => {
        const newJobs = jobsData.map(job => ({ ...job, id: crypto.randomUUID(), status: 'active' as const, createdAt: new Date().toISOString() }));
        setJobs(prev => [...prev, ...newJobs]);
        await addActivityLog('Bulk Job Upload', `${newJobs.length} jobs added via bulk upload.`);
        return newJobs;
    }, [setJobs, addActivityLog]);

    const deleteMultipleJobs = useCallback(async (ids: string[]) => {
        setJobs(prev => prev.filter(j => !ids.includes(j.id)));
        await addActivityLog('Bulk Job Deletion', `${ids.length} jobs deleted.`);
    }, [setJobs, addActivityLog]);

    const addQuickLink = useCallback(async (link: Omit<QuickLink, 'id'>) => {
        const newLink = { ...link, id: crypto.randomUUID() };
        setQuickLinks(prev => [...prev, newLink]);
        await addActivityLog('Quick Link Created', `Link added: "${link.title}"`);
    }, [setQuickLinks, addActivityLog]);

    const updateQuickLink = useCallback(async (link: QuickLink) => {
        setQuickLinks(prev => prev.map(l => l.id === link.id ? link : l));
        await addActivityLog('Quick Link Updated', `Link updated: "${link.title}"`);
    }, [setQuickLinks, addActivityLog]);

    const deleteQuickLink = useCallback(async (id: string) => {
        const linkToDelete = quickLinks.find(l => l.id === id);
        setQuickLinks(prev => prev.filter(l => l.id !== id));
        if (linkToDelete) {
            await addActivityLog('Quick Link Deleted', `Link deleted: "${linkToDelete.title}"`);
        }
    }, [quickLinks, setQuickLinks, addActivityLog]);
    
    const addPost = useCallback(async (post: Omit<ContentPost, 'id' | 'createdAt'>) => {
        const newPost = { ...post, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setPosts(prev => [...prev, newPost]);
        await addActivityLog('Post Created', `Post created: "${post.title}"`);
    }, [setPosts, addActivityLog]);

    const updatePost = useCallback(async (post: ContentPost) => {
        setPosts(prev => prev.map(p => p.id === post.id ? post : p));
        await addActivityLog('Post Updated', `Post updated: "${post.title}"`);
    }, [setPosts, addActivityLog]);

    const deletePost = useCallback(async (id: string) => {
        const postToDelete = posts.find(p => p.id === id);
        setPosts(prev => prev.filter(p => p.id !== id));
        if (postToDelete) {
            await addActivityLog('Post Deleted', `Post deleted: "${postToDelete.title}"`);
        }
    }, [posts, setPosts, addActivityLog]);

    const deleteMultiplePosts = useCallback(async (ids: string[]) => {
        setPosts(prev => prev.filter(p => !ids.includes(p.id)));
        await addActivityLog('Bulk Post Deletion', `${ids.length} posts deleted.`);
    }, [setPosts, addActivityLog]);

    const addSubscriber = useCallback(async (email: string) => {
        if (subscribers.some(s => s.email === email)) {
            return { success: false, message: 'This email is already subscribed.' };
        }
        const newSubscriber: Subscriber = {
            id: crypto.randomUUID(),
            email,
            subscriptionDate: new Date().toISOString().split('T')[0],
            status: 'active'
        };
        setSubscribers(prev => [...prev, newSubscriber]);
        await addActivityLog('New Subscriber', `New subscription from: ${email}`);

        // Automatically send welcome email
        if (generalSettings.emailNotificationsEnabled) {
            const template = emailTemplates.find(t => t.id === 'template-welcome');
            if (!template) {
                console.error("Welcome Email template not found.");
            } else {
                const subscriberName = getNameFromEmail(email);
                const subject = template.subject
                    .replace(/{{siteName}}/g, generalSettings.siteTitle)
                    .replace(/{{subscriberName}}/g, subscriberName)
                    .replace(/{{subscriberEmail}}/g, email);
                const body = template.body
                    .replace(/{{siteName}}/g, generalSettings.siteTitle)
                    .replace(/{{subscriberName}}/g, subscriberName)
                    .replace(/{{subscriberEmail}}/g, email);

                const newNotification: EmailNotification = {
                    id: crypto.randomUUID(),
                    recipient: email,
                    subject,
                    body,
                    sentAt: new Date().toISOString(),
                };

                setEmailNotifications(prev => [newNotification, ...prev]);
                await addActivityLog('Welcome Email Sent', `Welcome email queued for new subscriber: ${email}`);
            }
        }
        
        return { success: true };
    }, [subscribers, setSubscribers, addActivityLog, generalSettings, emailTemplates, setEmailNotifications]);

    const deleteSubscriber = useCallback(async (id: string) => {
        const subToDelete = subscribers.find(s => s.id === id);
        setSubscribers(prev => prev.filter(s => s.id !== id));
        if (subToDelete) {
            await addActivityLog('Subscriber Deleted', `Subscriber removed: ${subToDelete.email}`);
        }
    }, [subscribers, setSubscribers, addActivityLog]);

    const addNews = useCallback(async (news: Omit<BreakingNews, 'id'>) => {
        const newNews = { ...news, id: crypto.randomUUID() };
        setBreakingNews(prev => [...prev, newNews]);
        await addActivityLog('Breaking News Added', `News added: "${news.text}"`);
    }, [setBreakingNews, addActivityLog]);

    const updateNews = useCallback(async (news: BreakingNews) => {
        setBreakingNews(prev => prev.map(n => n.id === news.id ? news : n));
        await addActivityLog('Breaking News Updated', `News updated: "${news.text}"`);
    }, [setBreakingNews, addActivityLog]);

    const deleteNews = useCallback(async (id: string) => {
        const newsToDelete = breakingNews.find(n => n.id === id);
        setBreakingNews(prev => prev.filter(n => n.id !== id));
        if (newsToDelete) {
            await addActivityLog('Breaking News Deleted', `News deleted: "${newsToDelete.text}"`);
        }
    }, [breakingNews, setBreakingNews, addActivityLog]);

    const addSponsoredAd = useCallback(async (ad: Omit<SponsoredAd, 'id'>) => {
        const newAd = { ...ad, id: crypto.randomUUID() };
        setSponsoredAds(prev => [...prev, newAd]);
        await addActivityLog('Sponsored Ad Created', `New sponsored ad added.`);
    }, [setSponsoredAds, addActivityLog]);

    const updateSponsoredAd = useCallback(async (ad: SponsoredAd) => {
        setSponsoredAds(prev => prev.map(a => a.id === ad.id ? ad : a));
        await addActivityLog('Sponsored Ad Updated', `Sponsored ad updated.`);
    }, [setSponsoredAds, addActivityLog]);

    const deleteSponsoredAd = useCallback(async (id: string) => {
        setSponsoredAds(prev => prev.filter(a => a.id !== id));
        await addActivityLog('Sponsored Ad Deleted', `Sponsored ad deleted.`);
    }, [setSponsoredAds, addActivityLog]);

    const updateAdSettings = useCallback(async (settings: AdSettings) => {
        setAdSettings(settings);
        await addActivityLog('Settings Updated', 'Advertisement settings were updated.');
    }, [setAdSettings, addActivityLog]);

    const trackSponsoredAdClick = useCallback((adId: string) => {
        setSponsoredAds(prev => {
            const adIndex = prev.findIndex(ad => ad.id === adId);
            if (adIndex > -1) {
                const updatedAd: SponsoredAd = {
                    ...prev[adIndex],
                    clicks: (prev[adIndex].clicks || 0) + 1,
                };
                return [
                    ...prev.slice(0, adIndex),
                    updatedAd,
                    ...prev.slice(adIndex + 1),
                ];
            }
            return prev;
        });
    }, [setSponsoredAds]);

    const toggleAdTest = useCallback((placement: PlacementKey) => {
        setAdSettings(prev => {
            const currentTests = prev.activeTests || [];
            const newActiveTests = currentTests.includes(placement)
                ? currentTests.filter(p => p !== placement)
                : [...currentTests, placement];
            return { ...prev, activeTests: newActiveTests };
        });
    }, [setAdSettings]);

    const updateSEOSettings = useCallback(async (settings: SEOSettings) => {
        setSeoSettings(settings);
        await addActivityLog('Settings Updated', 'SEO settings were updated.');
    }, [setSeoSettings, addActivityLog]);

    const updateGeneralSettings = useCallback(async (settings: GeneralSettings) => {
        setGeneralSettings(settings);
        await addActivityLog('Settings Updated', 'General settings were updated.');
    }, [setGeneralSettings, addActivityLog]);

    const updateSocialMediaSettings = useCallback(async (settings: SocialMediaSettings) => {
        setSocialMediaSettings(settings);
        await addActivityLog('Settings Updated', 'Social media settings were updated.');
    }, [setSocialMediaSettings, addActivityLog]);
    
    const updateSmtpSettings = useCallback(async (settings: SMTPSettings) => {
        setSmtpSettings(settings);
        await addActivityLog('Settings Updated', 'SMTP settings were updated.');
    }, [setSmtpSettings, addActivityLog]);

    const clearActivityLogs = useCallback(async () => {
        setActivityLogs([]);
        await addActivityLog('Logs Cleared', 'All activity logs were cleared.');
    }, [setActivityLogs, addActivityLog]);
    
    const addContact = useCallback(async (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
        const newContact: ContactSubmission = {
            ...contact,
            id: crypto.randomUUID(),
            submittedAt: new Date().toISOString(),
        };
        setContacts(prev => [newContact, ...prev]);
    }, [setContacts]);

    const deleteContact = useCallback(async (id: string) => {
        setContacts(prev => prev.filter(c => c.id !== id));
    }, [setContacts]);

    const deleteEmailNotification = useCallback((id: string) => {
        setEmailNotifications(prev => prev.filter(n => n.id !== id));
    }, [setEmailNotifications]);

    const clearAllEmailNotifications = useCallback(() => {
        setEmailNotifications([]);
    }, [setEmailNotifications]);

    const sendCustomEmail = useCallback(async (subject: string, body: string) => {
        const newEmail: CustomEmail = {
            id: crypto.randomUUID(),
            subject,
            body,
            sentAt: new Date().toISOString(),
        };
        setCustomEmails(prev => [newEmail, ...prev]);

        // Simulate sending to all active subscribers
        const activeSubscribers = subscribers.filter(s => s.status === 'active');
        const notifications: EmailNotification[] = activeSubscribers.map(sub => {
            const subscriberName = getNameFromEmail(sub.email);
            const finalSubject = subject
                .replace(/{{siteName}}/g, generalSettings.siteTitle)
                .replace(/{{subscriberName}}/g, subscriberName)
                .replace(/{{subscriberEmail}}/g, sub.email);
            const finalBody = body
                .replace(/{{siteName}}/g, generalSettings.siteTitle)
                .replace(/{{subscriberName}}/g, subscriberName)
                .replace(/{{subscriberEmail}}/g, sub.email);

            return {
                id: crypto.randomUUID(),
                recipient: sub.email,
                subject: finalSubject,
                body: finalBody,
                sentAt: new Date().toISOString(),
            };
        });
        setEmailNotifications(prev => [...notifications, ...prev]);
        await addActivityLog('Email Campaign Sent', `Campaign "${subject}" sent to ${activeSubscribers.length} subscribers.`);

    }, [subscribers, setCustomEmails, setEmailNotifications, addActivityLog, generalSettings]);

    const deleteCustomEmail = useCallback((id: string) => {
        setCustomEmails(prev => prev.filter(e => e.id !== id));
    }, [setCustomEmails]);

    const addEmailTemplate = useCallback(async (template: Omit<EmailTemplate, 'id'>) => {
        const newTemplate = { ...template, id: crypto.randomUUID() };
        setEmailTemplates(prev => [...prev, newTemplate]);
        await addActivityLog('Email Template Created', `New template created: "${template.name}"`);
    }, [setEmailTemplates, addActivityLog]);

    const updateEmailTemplate = useCallback(async (template: EmailTemplate) => {
        setEmailTemplates(prev => prev.map(t => t.id === template.id ? template : t));
        await addActivityLog('Email Template Updated', `Template updated: "${template.name}"`);
    }, [setEmailTemplates, addActivityLog]);

    const deleteEmailTemplate = useCallback(async (id: string) => {
        const templateToDelete = emailTemplates.find(t => t.id === id);
        setEmailTemplates(prev => prev.filter(t => t.id !== id));
        if (templateToDelete) {
            await addActivityLog('Email Template Deleted', `Template deleted: "${templateToDelete.name}"`);
        }
    }, [emailTemplates, setEmailTemplates, addActivityLog]);

    const sendNewJobAlert = useCallback(async (job: Job) => {
        if (!generalSettings.emailNotificationsEnabled) return;

        const template = emailTemplates.find(t => t.id === 'template-new-job');
        if (!template) {
            console.error("New Job Alert email template not found.");
            return;
        }

        const activeSubscribers = subscribers.filter(s => s.status === 'active');
        if (activeSubscribers.length === 0) return;

        const jobLink = `${window.location.origin}${basePath}/job/${slugify(job.title)}`.replace(/([^:]\/)\/+/g, "$1");

        const newNotifications: EmailNotification[] = activeSubscribers.map(sub => {
            const subscriberName = getNameFromEmail(sub.email);
            const subject = template.subject
                .replace(/{{siteName}}/g, generalSettings.siteTitle)
                .replace(/{{jobTitle}}/g, job.title)
                .replace(/{{jobDepartment}}/g, job.department)
                .replace(/{{subscriberName}}/g, subscriberName)
                .replace(/{{subscriberEmail}}/g, sub.email);
            
            const body = template.body
                .replace(/{{siteName}}/g, generalSettings.siteTitle)
                .replace(/{{jobTitle}}/g, job.title)
                .replace(/{{jobDepartment}}/g, job.department)
                .replace(/{{jobLastDate}}/g, job.lastDate)
                .replace(/{{jobLink}}/g, jobLink)
                .replace(/{{subscriberName}}/g, subscriberName)
                .replace(/{{subscriberEmail}}/g, sub.email);

            return {
                id: crypto.randomUUID(),
                recipient: sub.email,
                subject,
                body,
                sentAt: new Date().toISOString(),
            };
        });
        
        setEmailNotifications(prev => [...newNotifications, ...prev]);
        await addActivityLog('Job Alert Sent', `New job alert for "${job.title}" sent to ${activeSubscribers.length} subscribers.`);

    }, [generalSettings, emailTemplates, subscribers, setEmailNotifications, addActivityLog]);

    const sendBulkJobAlerts = useCallback(async (jobs: Job[]) => {
        if (!generalSettings.emailNotificationsEnabled) return;

        let allNotifications: EmailNotification[] = [];

        for (const job of jobs) {
            const template = emailTemplates.find(t => t.id === 'template-new-job');
            if (!template) continue;

            const activeSubscribers = subscribers.filter(s => s.status === 'active');
            if (activeSubscribers.length === 0) continue;
            
            const jobLink = `${window.location.origin}${basePath}/job/${slugify(job.title)}`.replace(/([^:]\/)\/+/g, "$1");

            const notificationsForThisJob: EmailNotification[] = activeSubscribers.map(sub => {
                const subscriberName = getNameFromEmail(sub.email);
                const subject = template.subject
                    .replace(/{{siteName}}/g, generalSettings.siteTitle)
                    .replace(/{{jobTitle}}/g, job.title)
                    .replace(/{{jobDepartment}}/g, job.department)
                    .replace(/{{subscriberName}}/g, subscriberName)
                    .replace(/{{subscriberEmail}}/g, sub.email);
                
                const body = template.body
                    .replace(/{{siteName}}/g, generalSettings.siteTitle)
                    .replace(/{{jobTitle}}/g, job.title)
                    .replace(/{{jobDepartment}}/g, job.department)
                    .replace(/{{jobLastDate}}/g, job.lastDate)
                    .replace(/{{jobLink}}/g, jobLink)
                    .replace(/{{subscriberName}}/g, subscriberName)
                    .replace(/{{subscriberEmail}}/g, sub.email);

                return {
                    id: crypto.randomUUID(),
                    recipient: sub.email,
                    subject,
                    body,
                    sentAt: new Date().toISOString(),
                };
            });
            allNotifications = [...allNotifications, ...notificationsForThisJob];
        }

        if(allNotifications.length > 0) {
            setEmailNotifications(prev => [...allNotifications, ...prev]);
            await addActivityLog('Bulk Job Alerts Sent', `${jobs.length} new job alerts sent to ${subscribers.filter(s => s.status === 'active').length} subscribers.`);
        }
    }, [generalSettings, emailTemplates, subscribers, setEmailNotifications, addActivityLog]);

    const addPreparationCourse = useCallback(async (course: Omit<PreparationCourse, 'id'>) => {
        const newCourse = { ...course, id: crypto.randomUUID() };
        setPreparationCourses(prev => [...prev, newCourse]);
        await addActivityLog('Preparation Course Added', `New course: "${course.title}"`);
    }, [setPreparationCourses, addActivityLog]);

    const updatePreparationCourse = useCallback(async (course: PreparationCourse) => {
        setPreparationCourses(prev => prev.map(c => c.id === course.id ? course : c));
        await addActivityLog('Preparation Course Updated', `Course updated: "${course.title}"`);
    }, [setPreparationCourses, addActivityLog]);

    const deletePreparationCourse = useCallback(async (id: string) => {
        const courseToDelete = preparationCourses.find(c => c.id === id);
        setPreparationCourses(prev => prev.filter(c => c.id !== id));
        if (courseToDelete) {
            await addActivityLog('Preparation Course Deleted', `Course deleted: "${courseToDelete.title}"`);
        }
    }, [preparationCourses, setPreparationCourses, addActivityLog]);

    const addPreparationBook = useCallback(async (book: Omit<PreparationBook, 'id'>) => {
        const newBook = { ...book, id: crypto.randomUUID() };
        setPreparationBooks(prev => [...prev, newBook]);
        await addActivityLog('Preparation Book Added', `New book: "${book.title}"`);
    }, [setPreparationBooks, addActivityLog]);

    const updatePreparationBook = useCallback(async (book: PreparationBook) => {
        setPreparationBooks(prev => prev.map(b => b.id === book.id ? book : b));
        await addActivityLog('Preparation Book Updated', `Book updated: "${book.title}"`);
    }, [setPreparationBooks, addActivityLog]);

    const deletePreparationBook = useCallback(async (id: string) => {
        const bookToDelete = preparationBooks.find(b => b.id === id);
        setPreparationBooks(prev => prev.filter(b => b.id !== id));
        if (bookToDelete) {
            await addActivityLog('Preparation Book Deleted', `Book deleted: "${bookToDelete.title}"`);
        }
    }, [preparationBooks, setPreparationBooks, addActivityLog]);

    const addUpcomingExam = useCallback(async (exam: Omit<UpcomingExam, 'id'>) => {
        const newExam = { ...exam, id: crypto.randomUUID() };
        setUpcomingExams(prev => [...prev, newExam]);
        await addActivityLog('Upcoming Exam Added', `New exam: "${exam.name}"`);
    }, [setUpcomingExams, addActivityLog]);

    const updateUpcomingExam = useCallback(async (exam: UpcomingExam) => {
        setUpcomingExams(prev => prev.map(e => e.id === exam.id ? exam : e));
        await addActivityLog('Upcoming Exam Updated', `Exam updated: "${exam.name}"`);
    }, [setUpcomingExams, addActivityLog]);

    const deleteUpcomingExam = useCallback(async (id: string) => {
        const examToDelete = upcomingExams.find(e => e.id === id);
        setUpcomingExams(prev => prev.filter(e => e.id !== id));
        if (examToDelete) {
            await addActivityLog('Upcoming Exam Deleted', `Exam deleted: "${examToDelete.name}"`);
        }
    }, [upcomingExams, setUpcomingExams, addActivityLog]);


    const isPersistenceActive = isLocalStorageAvailable;

    const createBackup = useCallback((): BackupData => {
        return {
            jobs, quickLinks, posts, subscribers, breakingNews, adSettings, seoSettings, 
            generalSettings, socialMediaSettings, activityLogs, smtpSettings, rssSettings,
            alertSettings, sponsoredAds, popupAdSettings, themeSettings, securitySettings,
            demoUserSettings, emailTemplates, googleSearchConsoleSettings,
            preparationCourses, preparationBooks, upcomingExams
        };
    }, [
        jobs, quickLinks, posts, subscribers, breakingNews, adSettings, seoSettings, 
        generalSettings, socialMediaSettings, activityLogs, smtpSettings, rssSettings,
        alertSettings, sponsoredAds, popupAdSettings, themeSettings, securitySettings,
        demoUserSettings, emailTemplates, googleSearchConsoleSettings,
        preparationCourses, preparationBooks, upcomingExams
    ]);

    const restoreBackup = useCallback((data: BackupData): boolean => {
        // Basic validation
        if (!data.jobs || !data.generalSettings || !data.seoSettings) {
            return false;
        }
        
        setJobs(data.jobs || INITIAL_JOBS);
        setQuickLinks(data.quickLinks || INITIAL_QUICK_LINKS);
        setPosts(data.posts || INITIAL_POSTS);
        setSubscribers(data.subscribers || INITIAL_SUBSCRIBERS);
        setBreakingNews(data.breakingNews || INITIAL_BREAKING_NEWS);
        setAdSettings(data.adSettings || initialAdSettings);
        setSeoSettings(data.seoSettings || initialSeoSettings);
        setGeneralSettings(data.generalSettings || initialGeneralSettings);
        setSocialMediaSettings(data.socialMediaSettings || initialSocialMediaSettings);
        setActivityLogs(data.activityLogs || INITIAL_ACTIVITY_LOGS);
        setSmtpSettings(data.smtpSettings || initialSmtpSettings);
        setRssSettings(data.rssSettings || initialRssSettings);
        setAlertSettings(data.alertSettings || initialAlertSettings);
        setSponsoredAds(data.sponsoredAds || INITIAL_SPONSORED_ADS);
        setPopupAdSettings(data.popupAdSettings || initialPopupAdSettings);
        setThemeSettings(data.themeSettings || initialThemeSettings);
        setSecuritySettings(data.securitySettings || initialSecuritySettings);
        setDemoUserSettings(data.demoUserSettings || initialDemoUserSettings);
        setEmailTemplates(data.emailTemplates || INITIAL_EMAIL_TEMPLATES);
        setGoogleSearchConsoleSettings(data.googleSearchConsoleSettings || initialGoogleSearchConsoleSettings);
        setPreparationCourses(data.preparationCourses || INITIAL_PREPARATION_COURSES);
        setPreparationBooks(data.preparationBooks || INITIAL_PREPARATION_BOOKS);
        setUpcomingExams(data.upcomingExams || INITIAL_UPCOMING_EXAMS);
        setContacts([]); // Don't restore contact submissions
        setEmailNotifications([]); // Don't restore notification history
        setCustomEmails([]); // Don't restore custom email history
        
        addActivityLog('System Restored', 'Data was restored from a backup file.');
        return true;
    }, [
        setJobs, setQuickLinks, setPosts, setSubscribers, setBreakingNews, setAdSettings, setSeoSettings,
        setGeneralSettings, setSocialMediaSettings, setActivityLogs, setSmtpSettings, setRssSettings,
        setAlertSettings, setSponsoredAds, setPopupAdSettings, setThemeSettings, setSecuritySettings,
        setDemoUserSettings, setEmailTemplates, setGoogleSearchConsoleSettings,
        setPreparationCourses, setPreparationBooks, setUpcomingExams, addActivityLog,
        setContacts, setEmailNotifications, setCustomEmails
    ]);

    const value = {
        jobs, addJob, updateJob, deleteJob, addMultipleJobs, deleteMultipleJobs,
        quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
        posts, addPost, updatePost, deletePost, deleteMultiplePosts,
        subscribers, addSubscriber, deleteSubscriber,
        breakingNews, addNews, updateNews, deleteNews,
        sponsoredAds, addSponsoredAd, updateSponsoredAd, deleteSponsoredAd,
        adSettings, updateAdSettings, trackSponsoredAdClick, toggleAdTest,
        seoSettings, updateSEOSettings,
        generalSettings, updateGeneralSettings,
        socialMediaSettings, updateSocialMediaSettings,
        smtpSettings, updateSmtpSettings,
        rssSettings, updateRssSettings,
        alertSettings, updateAlertSettings,
        popupAdSettings, updatePopupAdSettings,
        themeSettings, updateThemeSettings,
        securitySettings, updateSecuritySettings,
        demoUserSettings, updateDemoUserSettings,
        googleSearchConsoleSettings, updateGoogleSearchConsoleSettings,
        activityLogs, addActivityLog, clearActivityLogs,
        contacts, addContact, deleteContact,
        emailNotifications, deleteEmailNotification, clearAllEmailNotifications,
        customEmails, sendCustomEmail, deleteCustomEmail,
        emailTemplates, addEmailTemplate, updateEmailTemplate, deleteEmailTemplate,
        sendNewJobAlert, sendBulkJobAlerts,
        preparationCourses, addPreparationCourse, updatePreparationCourse, deletePreparationCourse,
        preparationBooks, addPreparationBook, updatePreparationBook, deletePreparationBook,
        upcomingExams, addUpcomingExam, updateUpcomingExam, deleteUpcomingExam,
        isPersistenceActive,
        createBackup, restoreBackup
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};