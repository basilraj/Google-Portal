import React, { createContext, useContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { 
    Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, 
    SocialMediaSettings, SMTPSettings, ActivityLog, ContactSubmission, EmailNotification, CustomEmail, 
    RSSSettings, AlertSettings, SponsoredAd, PlacementKey, PopupAdSettings, ThemeSettings,
    SecuritySettings, DemoUserSettings, EmailTemplate, GoogleSearchConsoleSettings, PreparationCourse, PreparationBook, UpcomingExam
} from '../types.ts';
import { 
    INITIAL_JOBS, INITIAL_QUICK_LINKS, INITIAL_POSTS, INITIAL_SUBSCRIBERS, INITIAL_BREAKING_NEWS, 
    initialAdSettings, initialSeoSettings, initialGeneralSettings, initialSocialMediaSettings, 
    initialSmtpSettings, INITIAL_ACTIVITY_LOGS, initialRssSettings, initialAlertSettings, INITIAL_SPONSORED_ADS,
    initialPopupAdSettings, initialThemeSettings, initialSecuritySettings, initialDemoUserSettings, INITIAL_EMAIL_TEMPLATES, initialGoogleSearchConsoleSettings,
    INITIAL_PREPARATION_COURSES, INITIAL_PREPARATION_BOOKS, INITIAL_UPCOMING_EXAMS
} from '../constants.ts';
import { slugify } from '../utils/slugify.ts';
import { basePath } from '../App.tsx';

const getNameFromEmail = (email: string): string => {
    if (!email || !email.includes('@')) return 'Subscriber';
    const namePart = email.split('@')[0];
    return namePart
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

// API helper function
const api = async (model: string, action: string, payload?: any) => {
    const response = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, action, ...payload }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API call failed: ${model}.${action}`);
    }
    return response.json();
};

interface DataContextType {
  isLoading: boolean;
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
  clearActivityLogs: () => Promise<void>;
  contacts: ContactSubmission[];
  addContact: (contact: Omit<ContactSubmission, 'id' | 'submittedAt'>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  emailNotifications: EmailNotification[];
  deleteEmailNotification: (id: string) => Promise<void>;
  clearAllEmailNotifications: () => Promise<void>;
  customEmails: CustomEmail[];
  sendCustomEmail: (subject: string, body: string) => Promise<void>;
  deleteCustomEmail: (id: string) => Promise<void>;
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
    const [posts, setPosts] = useState<ContentPost[]>([]);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
    const [sponsoredAds, setSponsoredAds] = useState<SponsoredAd[]>([]);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [contacts, setContacts] = useState<ContactSubmission[]>([]);
    const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);
    const [customEmails, setCustomEmails] = useState<CustomEmail[]>([]);
    const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
    const [preparationCourses, setPreparationCourses] = useState<PreparationCourse[]>([]);
    const [preparationBooks, setPreparationBooks] = useState<PreparationBook[]>([]);
    const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([]);
    
    // Settings are a single object
    const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(initialGeneralSettings);
    const [seoSettings, setSeoSettings] = useState<SEOSettings>(initialSeoSettings);
    const [socialMediaSettings, setSocialMediaSettings] = useState<SocialMediaSettings>(initialSocialMediaSettings);
    const [smtpSettings, setSmtpSettings] = useState<SMTPSettings>(initialSmtpSettings);
    const [adSettings, setAdSettings] = useState<AdSettings>(initialAdSettings);
    const [rssSettings, setRssSettings] = useState<RSSSettings>(initialRssSettings);
    const [alertSettings, setAlertSettings] = useState<AlertSettings>(initialAlertSettings);
    const [popupAdSettings, setPopupAdSettings] = useState<PopupAdSettings>(initialPopupAdSettings);
    const [themeSettings, setThemeSettings] = useState<ThemeSettings>(initialThemeSettings);
    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(initialSecuritySettings);
    const [demoUserSettings, setDemoUserSettings] = useState<DemoUserSettings>(initialDemoUserSettings);
    const [googleSearchConsoleSettings, setGoogleSearchConsoleSettings] = useState<GoogleSearchConsoleSettings>(initialGoogleSearchConsoleSettings);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                const models = [
                    'job', 'quickLink', 'contentPost', 'subscriber', 'breakingNews', 'sponsoredAd', 
                    'activityLog', 'contactSubmission', 'emailNotification', 'customEmail', 
                    'emailTemplate', 'preparationCourse', 'preparationBook', 'upcomingExam', 'settings'
                ];
                const requests = models.map(model => fetch(`/api/data?model=${model}`).then(res => res.json()));
                const [
                    jobsData, quickLinksData, postsData, subscribersData, breakingNewsData, sponsoredAdsData,
                    activityLogsData, contactsData, emailNotificationsData, customEmailsData, emailTemplatesData,
                    prepCoursesData, prepBooksData, upcomingExamsData, settingsData
                ] = await Promise.all(requests);

                setJobs(jobsData || []);
                setQuickLinks(quickLinksData || []);
                setPosts(postsData || []);
                setSubscribers(subscribersData || []);
                setBreakingNews(breakingNewsData || []);
                setSponsoredAds(sponsoredAdsData || []);
                setActivityLogs(activityLogsData || []);
                setContacts(contactsData || []);
                setEmailNotifications(emailNotificationsData || []);
                setCustomEmails(customEmailsData || []);
                setEmailTemplates(emailTemplatesData || []);
                setPreparationCourses(prepCoursesData || []);
                setPreparationBooks(prepBooksData || []);
                setUpcomingExams(upcomingExamsData || []);

                if (settingsData) {
                    setGeneralSettings(settingsData.generalSettings || initialGeneralSettings);
                    setSeoSettings(settingsData.seoSettings || initialSeoSettings);
                    setSocialMediaSettings(settingsData.socialMediaSettings || initialSocialMediaSettings);
                    setSmtpSettings(settingsData.smtpSettings || initialSmtpSettings);
                    setAdSettings(settingsData.adSettings || initialAdSettings);
                    setRssSettings(settingsData.rssSettings || initialRssSettings);
                    setAlertSettings(settingsData.alertSettings || initialAlertSettings);
                    setPopupAdSettings(settingsData.popupAdSettings || initialPopupAdSettings);
                    setThemeSettings(settingsData.themeSettings || initialThemeSettings);
                    setSecuritySettings(settingsData.securitySettings || initialSecuritySettings);
                    setDemoUserSettings(settingsData.demoUserSettings || initialDemoUserSettings);
                    setGoogleSearchConsoleSettings(settingsData.googleSearchConsoleSettings || initialGoogleSearchConsoleSettings);
                }
            } catch (error) {
                console.error("Failed to fetch initial data from server:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const addActivityLog = useCallback(async (action: string, details: string) => {
        const newLog = await api('activityLog', 'create', { data: { action, details } });
        setActivityLogs(prev => [newLog, ...prev.slice(0, 499)]);
    }, []);

    // All setter functions now become wrappers around the `api` helper
    // FIX: Rewriting generic arrow function to a function declaration to avoid TSX parsing issues.
    function createSetter<T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, model: string, logName: string) {
        return {
            add: async (data: any) => { const newItem = await api(model, 'create', { data }); setter(prev => [...prev, newItem]); await addActivityLog(`${logName} Created`, `New ${logName.toLowerCase()} added.`); return newItem; },
            update: async (data: any) => { const updated = await api(model, 'update', { where: { id: data.id }, data }); setter(prev => prev.map(item => item.id === data.id ? updated : item)); await addActivityLog(`${logName} Updated`, `${logName} updated.`); },
            delete: async (id: string) => { await api(model, 'delete', { where: { id } }); setter(prev => prev.filter(item => item.id !== id)); await addActivityLog(`${logName} Deleted`, `${logName} deleted.`); },
            deleteMany: async (ids: string[]) => { await api(model, 'deleteMany', { where: { id: { in: ids } } }); setter(prev => prev.filter(item => !ids.includes(item.id))); await addActivityLog(`Bulk ${logName} Deletion`, `${ids.length} ${logName.toLowerCase()}s deleted.`); },
            set: setter,
        }
    };
    
    // FIX: Rewriting generic arrow function to a function declaration to avoid TSX parsing issues.
    function createSettingsSetter<T>(setter: React.Dispatch<React.SetStateAction<T>>, settingsKey: string) {
        return async (data: T) => {
            const payload = { [settingsKey]: data };
            await api('settings', 'update', { data: payload }); // Simplified for single settings object
            setter(data);
            await addActivityLog('Settings Updated', `${settingsKey} were updated.`);
        };
    };

    const jobActions = createSetter(setJobs, 'job', 'Job');
    const quickLinkActions = createSetter(setQuickLinks, 'quickLink', 'Quick Link');
    const postActions = createSetter(setPosts, 'contentPost', 'Post');
    const subscriberActions = createSetter(setSubscribers, 'subscriber', 'Subscriber');
    const newsActions = createSetter(setBreakingNews, 'breakingNews', 'Breaking News');
    const adActions = createSetter(setSponsoredAds, 'sponsoredAd', 'Sponsored Ad');
    const courseActions = createSetter(setPreparationCourses, 'preparationCourse', 'Preparation Course');
    const bookActions = createSetter(setPreparationBooks, 'preparationBook', 'Preparation Book');
    const examActions = createSetter(setUpcomingExams, 'upcomingExam', 'Upcoming Exam');
    const templateActions = createSetter(setEmailTemplates, 'emailTemplate', 'Email Template');
    const contactActions = createSetter(setContacts, 'contactSubmission', 'Contact');
    const customEmailActions = createSetter(setCustomEmails, 'customEmail', 'Custom Email');
    const notificationActions = createSetter(setEmailNotifications, 'emailNotification', 'Email Notification');
    
    const value = {
        isLoading,
        jobs, addJob: async (data: any) => { const newJob = await jobActions.add(data); if (newJob) { return newJob; } return null; }, updateJob: jobActions.update, deleteJob: jobActions.delete,
        addMultipleJobs: async (data: any[]) => { const { count } = await api('job', 'createMany', { data }); const newJobs = await api('job', 'findMany', { where: { title: { in: data.map(j => j.title) } } }); setJobs(prev => [...prev, ...newJobs]); await addActivityLog('Bulk Job Upload', `${count} jobs added.`); return newJobs; },
        deleteMultipleJobs: jobActions.deleteMany,
        quickLinks, addQuickLink: quickLinkActions.add, updateQuickLink: quickLinkActions.update, deleteQuickLink: quickLinkActions.delete,
        posts, addPost: postActions.add, updatePost: postActions.update, deletePost: postActions.delete, deleteMultiplePosts: postActions.deleteMany,
        subscribers,
        addSubscriber: async (email: string) => {
            const existing = await api('subscriber', 'findUnique', { where: { email } });
            if (existing) return { success: false, message: 'This email is already subscribed.' };
            await subscriberActions.add({ email, status: 'active' });
            // Welcome email logic can be added here
            return { success: true };
        },
        deleteSubscriber: subscriberActions.delete,
        breakingNews, addNews: newsActions.add, updateNews: newsActions.update, deleteNews: newsActions.delete,
        sponsoredAds, addSponsoredAd: adActions.add, updateSponsoredAd: adActions.update, deleteSponsoredAd: adActions.delete,
        preparationCourses, addPreparationCourse: courseActions.add, updatePreparationCourse: courseActions.update, deletePreparationCourse: courseActions.delete,
        preparationBooks, addPreparationBook: bookActions.add, updatePreparationBook: bookActions.update, deletePreparationBook: bookActions.delete,
        upcomingExams, addUpcomingExam: examActions.add, updateUpcomingExam: examActions.update, deleteUpcomingExam: examActions.delete,
        emailTemplates, addEmailTemplate: templateActions.add, updateEmailTemplate: templateActions.update, deleteEmailTemplate: templateActions.delete,
        contacts, addContact: contactActions.add, deleteContact: contactActions.delete,
        customEmails, sendCustomEmail: async (subject: string, body: string) => { /* Logic to send emails via backend */ await customEmailActions.add({ subject, body }); }, deleteCustomEmail: customEmailActions.delete,
        emailNotifications, deleteEmailNotification: notificationActions.delete, clearAllEmailNotifications: async () => { await api('emailNotification', 'deleteMany', { where: {} }); setEmailNotifications([]); },
        activityLogs, addActivityLog, clearActivityLogs: async () => { await api('activityLog', 'deleteMany', { where: {} }); setActivityLogs([]); await addActivityLog('Logs Cleared', 'All activity logs were cleared.'); },
        generalSettings, updateGeneralSettings: createSettingsSetter(setGeneralSettings, 'generalSettings'),
        seoSettings, updateSEOSettings: createSettingsSetter(setSeoSettings, 'seoSettings'),
        socialMediaSettings, updateSocialMediaSettings: createSettingsSetter(setSocialMediaSettings, 'socialMediaSettings'),
        smtpSettings, updateSmtpSettings: createSettingsSetter(setSmtpSettings, 'smtpSettings'),
        adSettings, updateAdSettings: createSettingsSetter(setAdSettings, 'adSettings'),
        rssSettings, updateRssSettings: createSettingsSetter(setRssSettings, 'rssSettings'),
        alertSettings, updateAlertSettings: createSettingsSetter(setAlertSettings, 'alertSettings'),
        popupAdSettings, updatePopupAdSettings: createSettingsSetter(setPopupAdSettings, 'popupAdSettings'),
        themeSettings, updateThemeSettings: createSettingsSetter(setThemeSettings, 'themeSettings'),
        securitySettings, updateSecuritySettings: createSettingsSetter(setSecuritySettings, 'securitySettings'),
        demoUserSettings, updateDemoUserSettings: createSettingsSetter(setDemoUserSettings, 'demoUserSettings'),
        googleSearchConsoleSettings, updateGoogleSearchConsoleSettings: createSettingsSetter(setGoogleSearchConsoleSettings, 'googleSearchConsoleSettings'),
        trackSponsoredAdClick: async (adId: string) => {
            const ad = sponsoredAds.find(a => a.id === adId);
            if(ad) {
                await adActions.update({ ...ad, clicks: (ad.clicks || 0) + 1 });
            }
        },
        toggleAdTest: async (placement: PlacementKey) => {
            const currentTests = adSettings.activeTests || [];
            const newActiveTests = currentTests.includes(placement)
                ? currentTests.filter(p => p !== placement)
                : [...currentTests, placement];
            await createSettingsSetter(setAdSettings, 'adSettings')({ ...adSettings, activeTests: newActiveTests });
        },
        sendNewJobAlert: async (job: Job) => { /* server-side logic needed */ },
        sendBulkJobAlerts: async (jobs: Job[]) => { /* server-side logic needed */ }
    };

    return (
        <DataContext.Provider value={value as DataContextType}>
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