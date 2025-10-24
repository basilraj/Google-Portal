import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { 
    Job, QuickLink, ContentPost, Subscriber, BreakingNews, AdSettings, SEOSettings, GeneralSettings, 
    SocialMediaSettings, SMTPSettings, ActivityLog, ContactSubmission, EmailNotification, CustomEmail, 
    RSSSettings, AlertSettings, SponsoredAd, PlacementKey, PopupAdSettings, ThemeSettings,
    SecuritySettings, DemoUserSettings, EmailTemplate, GoogleSearchConsoleSettings, PreparationCourse, PreparationBook, UpcomingExam, BackupData
} from '../types.ts';
import {
    initialAdSettings,
    initialAlertSettings,
    initialDemoUserSettings,
    initialGeneralSettings,
    initialGoogleSearchConsoleSettings,
    initialPopupAdSettings,
    initialRssSettings,
    initialSecuritySettings,
    initialSeoSettings,
    initialSmtpSettings,
    initialSocialMediaSettings,
    initialThemeSettings
} from '../constants.ts';


// Define initial empty state
const getInitialState = (): BackupData => ({
    jobs: [], quickLinks: [], posts: [], subscribers: [], breakingNews: [],
    activityLogs: [], sponsoredAds: [], contacts: [], emailNotifications: [],
    customEmails: [], emailTemplates: [], preparationCourses: [], preparationBooks: [],
    upcomingExams: [],
    adSettings: initialAdSettings, 
    seoSettings: initialSeoSettings, 
    generalSettings: initialGeneralSettings, 
    socialMediaSettings: initialSocialMediaSettings, 
    smtpSettings: initialSmtpSettings, 
    rssSettings: initialRssSettings, 
    alertSettings: initialAlertSettings, 
    popupAdSettings: initialPopupAdSettings, 
    themeSettings: initialThemeSettings, 
    securitySettings: initialSecuritySettings, 
    demoUserSettings: initialDemoUserSettings,
    googleSearchConsoleSettings: initialGoogleSearchConsoleSettings
});


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

// Helper for API calls
// FIX: Rewriting as a standard function declaration to resolve a critical parsing error
// that was causing build failures across the entire application.
async function apiCall<T>(endpoint: string, method: string, body?: any): Promise<T> {
    const response = await fetch(`/api/${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API call to ${endpoint} failed`);
    }
    // For 204 No Content, response.json() will fail.
    if (response.status === 204) {
        return {} as T;
    }
    return response.json();
}

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [state, setState] = useState<BackupData>(getInitialState());

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const data = await apiCall<BackupData>('data', 'GET');
                setState(prev => ({...prev, ...data}));
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    const updateSettings = useCallback(async (key: keyof BackupData, value: any) => {
        await apiCall('settings', 'POST', { key, value });
        setState(prev => ({ ...prev, [key]: value }));
    }, []);

    const value: DataContextType = {
        isLoading,
        ...state,
        addJob: async (jobData) => {
            const newJob = await apiCall<Job>('jobs', 'POST', jobData);
            setState(p => ({ ...p, jobs: [...p.jobs, newJob]}));
            return newJob;
        },
        updateJob: async (job) => {
            const updatedJob = await apiCall<Job>('jobs', 'PUT', job);
            setState(p => ({ ...p, jobs: p.jobs.map(j => (j.id === updatedJob.id ? updatedJob : j)) }));
        },
        deleteJob: async (id) => {
            await apiCall('jobs', 'DELETE', { id });
            setState(p => ({ ...p, jobs: p.jobs.filter(j => j.id !== id) }));
        },
        addMultipleJobs: async (jobsData) => {
            const newJobs = await apiCall<Job[]>('jobs', 'POST', jobsData);
            setState(p => ({ ...p, jobs: [...p.jobs, ...newJobs] }));
            return newJobs;
        },
        deleteMultipleJobs: async (ids) => {
            await apiCall('jobs', 'DELETE', { ids });
            setState(p => ({ ...p, jobs: p.jobs.filter(j => !ids.includes(j.id)) }));
        },

        addQuickLink: async (data) => {
            const newItem = await apiCall<QuickLink>('quicklinks', 'POST', data);
            setState(p => ({ ...p, quickLinks: [...p.quickLinks, newItem] }));
        },
        updateQuickLink: async (item) => {
            const updatedItem = await apiCall<QuickLink>('quicklinks', 'PUT', item);
            setState(p => ({ ...p, quickLinks: p.quickLinks.map(i => (i.id === updatedItem.id ? updatedItem : i)) }));
        },
        deleteQuickLink: async (id) => {
            await apiCall('quicklinks', 'DELETE', { id });
            setState(p => ({ ...p, quickLinks: p.quickLinks.filter(i => i.id !== id) }));
        },

        addPost: async (data) => {
            const newItem = await apiCall<ContentPost>('posts', 'POST', data);
            setState(p => ({ ...p, posts: [...p.posts, newItem] }));
        },
        updatePost: async (item) => {
            const updatedItem = await apiCall<ContentPost>('posts', 'PUT', item);
            setState(p => ({ ...p, posts: p.posts.map(i => (i.id === updatedItem.id ? updatedItem : i)) }));
        },
        deletePost: async (id) => {
            await apiCall('posts', 'DELETE', { id });
            setState(p => ({ ...p, posts: p.posts.filter(i => i.id !== id) }));
        },
        deleteMultiplePosts: async (ids) => {
            await apiCall('posts', 'DELETE', { ids });
            setState(p => ({ ...p, posts: p.posts.filter(post => !ids.includes(post.id)) }));
        },
        
        addSubscriber: async (email) => {
             try {
                const newItem = await apiCall<Subscriber>('subscribers', 'POST', { email });
                setState(p => ({ ...p, subscribers: [...p.subscribers, newItem] }));
                return { success: true };
            } catch (error: any) {
                return { success: false, message: error.message };
            }
        },
        deleteSubscriber: async (id) => {
            await apiCall('subscribers', 'DELETE', { id });
            setState(p => ({...p, subscribers: p.subscribers.filter(s => s.id !== id)}));
        },

        addNews: async (data) => {
            const newItem = await apiCall<BreakingNews>('breakingnews', 'POST', data);
            setState(p => ({ ...p, breakingNews: [...p.breakingNews, newItem] }));
        },
        updateNews: async (item) => {
            const updatedItem = await apiCall<BreakingNews>('breakingnews', 'PUT', item);
            setState(p => ({ ...p, breakingNews: p.breakingNews.map(i => (i.id === updatedItem.id ? updatedItem : i)) }));
        },
        deleteNews: async (id) => {
            await apiCall('breakingnews', 'DELETE', { id });
            setState(p => ({ ...p, breakingNews: p.breakingNews.filter(i => i.id !== id) }));
        },
        
        addSponsoredAd: async (data) => {
            const newItem = await apiCall<SponsoredAd>('sponsoredads', 'POST', data);
            setState(p => ({ ...p, sponsoredAds: [...p.sponsoredAds, newItem] }));
        },
        updateSponsoredAd: async (item) => {
            const updatedItem = await apiCall<SponsoredAd>('sponsoredads', 'PUT', item);
            setState(p => ({ ...p, sponsoredAds: p.sponsoredAds.map(i => (i.id === updatedItem.id ? updatedItem : i)) }));
        },
        deleteSponsoredAd: async (id) => {
            await apiCall('sponsoredads', 'DELETE', { id });
            setState(p => ({ ...p, sponsoredAds: p.sponsoredAds.filter(i => i.id !== id) }));
        },
        trackSponsoredAdClick: (adId) => {
            apiCall('sponsoredads', 'PUT', { id: adId, trackClick: true });
            setState(p => ({...p, sponsoredAds: p.sponsoredAds.map(ad => ad.id === adId ? { ...ad, clicks: (ad.clicks || 0) + 1 } : ad)}));
        },
        toggleAdTest: async (placement) => {
            const currentTests = state.adSettings.activeTests || [];
            const newActiveTests = currentTests.includes(placement)
                ? currentTests.filter(p => p !== placement)
                : [...currentTests, placement];
            const newSettings = { ...state.adSettings, activeTests: newActiveTests };
            await updateSettings('adSettings', newSettings);
        },

        updateAdSettings: (s) => updateSettings('adSettings', s),
        updateSEOSettings: (s) => updateSettings('seoSettings', s),
        updateGeneralSettings: (s) => updateSettings('generalSettings', s),
        updateSocialMediaSettings: (s) => updateSettings('socialMediaSettings', s),
        updateSmtpSettings: (s) => updateSettings('smtpSettings', s),
        updateRssSettings: (s) => updateSettings('rssSettings', s),
        updateAlertSettings: (s) => updateSettings('alertSettings', s),
        updatePopupAdSettings: (s) => updateSettings('popupAdSettings', s),
        updateThemeSettings: (s) => updateSettings('themeSettings', s),
        updateSecuritySettings: (s) => updateSettings('securitySettings', s),
        updateDemoUserSettings: (s) => updateSettings('demoUserSettings', s),
        updateGoogleSearchConsoleSettings: (s) => updateSettings('googleSearchConsoleSettings', s),

        addActivityLog: async (action, details) => {
            const newLog = await apiCall<ActivityLog>('activitylogs', 'POST', { action, details });
            setState(p => ({ ...p, activityLogs: [newLog, ...p.activityLogs.slice(0, 499)] }));
        },
        clearActivityLogs: async () => {
            await apiCall('activitylogs', 'DELETE', { clearAll: true });
            setState(p => ({ ...p, activityLogs: [] }));
        },
        
        addContact: async (data) => {
            const newItem = await apiCall<ContactSubmission>('contacts', 'POST', data);
            setState(p => ({ ...p, contacts: [newItem, ...p.contacts] }));
        },
        deleteContact: async (id) => {
            await apiCall('contacts', 'DELETE', { id });
            setState(p => ({ ...p, contacts: p.contacts.filter(c => c.id !== id) }));
        },

        deleteEmailNotification: async (id) => {
            await apiCall('emailnotifications', 'DELETE', { id });
            setState(p => ({ ...p, emailNotifications: p.emailNotifications.filter(n => n.id !== id) }));
        },
        clearAllEmailNotifications: async () => {
            await apiCall('emailnotifications', 'DELETE', { clearAll: true });
            setState(p => ({ ...p, emailNotifications: [] }));
        },
        sendCustomEmail: async (subject, body) => {
            const newEmail = await apiCall<CustomEmail>('customemails', 'POST', { subject, body });
            setState(p => ({ ...p, customEmails: [newEmail, ...p.customEmails] }));
        },
        deleteCustomEmail: async (id) => {
            await apiCall('customemails', 'DELETE', { id });
            setState(p => ({...p, customEmails: p.customEmails.filter(e => e.id !== id)}));
        },

        addEmailTemplate: async (data) => {
            const newItem = await apiCall<EmailTemplate>('emailtemplates', 'POST', data);
            setState(p => ({ ...p, emailTemplates: [...p.emailTemplates, newItem] }));
        },
        updateEmailTemplate: async (item) => {
            const updatedItem = await apiCall<EmailTemplate>('emailtemplates', 'PUT', item);
            setState(p => ({ ...p, emailTemplates: p.emailTemplates.map(t => (t.id === updatedItem.id ? updatedItem : t)) }));
        },
        deleteEmailTemplate: async (id) => {
            await apiCall('emailtemplates', 'DELETE', { id });
            setState(p => ({ ...p, emailTemplates: p.emailTemplates.filter(t => t.id !== id) }));
        },

        sendNewJobAlert: async (job: Job) => { console.log(`(Simulated) Sending new job alert for: ${job.title}`); },
        sendBulkJobAlerts: async (jobs: Job[]) => { console.log(`(Simulated) Sending bulk job alerts for ${jobs.length} jobs.`); },

        addPreparationCourse: async (data) => {
            const newItem = await apiCall<PreparationCourse>('preparationcourses', 'POST', data);
            setState(p => ({...p, preparationCourses: [...p.preparationCourses, newItem]}));
        },
        updatePreparationCourse: async (item) => {
            const updatedItem = await apiCall<PreparationCourse>('preparationcourses', 'PUT', item);
            setState(p => ({...p, preparationCourses: p.preparationCourses.map(i => i.id === updatedItem.id ? updatedItem : i)}));
        },
        deletePreparationCourse: async (id) => {
            await apiCall('preparationcourses', 'DELETE', { id });
            setState(p => ({...p, preparationCourses: p.preparationCourses.filter(i => i.id !== id)}));
        },

        addPreparationBook: async (data) => {
            const newItem = await apiCall<PreparationBook>('preparationbooks', 'POST', data);
            setState(p => ({...p, preparationBooks: [...p.preparationBooks, newItem]}));
        },
        updatePreparationBook: async (item) => {
            const updatedItem = await apiCall<PreparationBook>('preparationbooks', 'PUT', item);
            setState(p => ({...p, preparationBooks: p.preparationBooks.map(i => i.id === updatedItem.id ? updatedItem : i)}));
        },
        deletePreparationBook: async (id) => {
            await apiCall('preparationbooks', 'DELETE', { id });
            setState(p => ({...p, preparationBooks: p.preparationBooks.filter(i => i.id !== id)}));
        },
        
        addUpcomingExam: async (data) => {
            const newItem = await apiCall<UpcomingExam>('upcomingexams', 'POST', data);
            setState(p => ({...p, upcomingExams: [...p.upcomingExams, newItem]}));
        },
        updateUpcomingExam: async (item) => {
            const updatedItem = await apiCall<UpcomingExam>('upcomingexams', 'PUT', item);
            setState(p => ({...p, upcomingExams: p.upcomingExams.map(i => i.id === updatedItem.id ? updatedItem : i)}));
        },
        deleteUpcomingExam: async (id) => {
            await apiCall('upcomingexams', 'DELETE', { id });
            setState(p => ({...p, upcomingExams: p.upcomingExams.filter(i => i.id !== id)}));
        },
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