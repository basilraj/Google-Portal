import { Job, QuickLink, ContentPost, Subscriber, AdSettings, ContactSubmission, BreakingNews } from '../types';
import { INITIAL_JOBS, INITIAL_QUICK_LINKS, INITIAL_POSTS, INITIAL_SUBSCRIBERS, INITIAL_CONTACTS, INITIAL_BREAKING_NEWS } from '../constants';
import storage from '../utils/storage';

const createDbService = <T>(key: string, initialData: T[]) => {
    const get = (): T[] => {
        try {
            const item = storage.getItem(key);
            if (item) {
                return JSON.parse(item);
            } else {
                storage.setItem(key, JSON.stringify(initialData));
                return initialData;
            }
        } catch (error) {
            console.error(`Error parsing data for ${key}:`, error);
            return initialData;
        }
    };

    const save = (data: T[]) => {
        try {
            storage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving data for ${key}:`, error);
        }
    };

    return { get, save };
};

const jobDb = createDbService<Job>('jobs', INITIAL_JOBS);
export const jobService = {
    getJobs: jobDb.get,
    saveJobs: jobDb.save,
};

const linkDb = createDbService<QuickLink>('quick_links', INITIAL_QUICK_LINKS);
export const linkService = {
    getLinks: linkDb.get,
    saveLinks: linkDb.save,
};

const postDb = createDbService<ContentPost>('posts', INITIAL_POSTS);
export const postService = {
    getPosts: postDb.get,
    savePosts: postDb.save,
};

const subscriberDb = createDbService<Subscriber>('subscribers', INITIAL_SUBSCRIBERS);
export const subscriberService = {
    getSubscribers: subscriberDb.get,
    saveSubscribers: subscriberDb.save,
};

const contactDb = createDbService<ContactSubmission>('contacts', INITIAL_CONTACTS);
export const contactService = {
    getContacts: contactDb.get,
    saveContacts: contactDb.save,
};

const breakingNewsDb = createDbService<BreakingNews>('breaking_news', INITIAL_BREAKING_NEWS);
export const breakingNewsService = {
    getNews: breakingNewsDb.get,
    saveNews: breakingNewsDb.save,
};


const AD_SETTINGS_KEY = 'ad_settings';
const INITIAL_AD_SETTINGS: AdSettings = {
    // Display Settings
    adFrequency: 'medium',
    bannerAds: true,
    squareAds: true,
    skyscraperAds: true,
    popupAds: false,
    adStartTime: '00:00',
    adEndTime: '23:59',

    // Network Configurations
    adsense: {
        enabled: false,
        publisherId: '',
    },
    adsterra: {
        enabled: false,
        zoneId: '',
    },
    customAds: {
        enabled: true,
        code: `<div style="background-color: #e0f2fe; border: 1px dashed #38bdf8; padding: 20px; text-align: center; width: 100%; border-radius: 8px; color: #075985;"><strong>Custom Ad Slot</strong><br/>Your Advertisement Here</div>`,
    },
    
    // Legacy fields for basic ad slots on public page
    headerAdEnabled: true,
    headerAdCode: `<div style="background-color: #f0f0f0; border: 1px dashed #ccc; padding: 20px; text-align: center; width: 100%; height: 90px;"><strong>Header Ad (728x90)</strong><br/>Your Advertisement Here</div>`,
    sidebarAdEnabled: true,
    sidebarAdCode: `<div style="background-color: #f0f0f0; border: 1px dashed #ccc; padding: 20px; text-align: center; width: 100%; height: 250px;"><strong>Sidebar Ad (300x250)</strong><br/>Your Advertisement Here</div>`,
    footerAdEnabled: true,
    footerAdCode: `<div style="background-color: #f0f0f0; border: 1px dashed #ccc; padding: 20px; text-align: center; width: 100%; height: 90px;"><strong>Footer Ad (728x90)</strong><br/>Your Advertisement Here</div>`,
};

export const adService = {
    getSettings: (): AdSettings => {
        try {
            const item = storage.getItem(AD_SETTINGS_KEY);
            if (item) {
                // Merge saved settings with defaults to ensure new fields are present
                const savedSettings = JSON.parse(item);
                return { ...INITIAL_AD_SETTINGS, ...savedSettings };
            } else {
                storage.setItem(AD_SETTINGS_KEY, JSON.stringify(INITIAL_AD_SETTINGS));
                return INITIAL_AD_SETTINGS;
            }
        } catch (error) {
            console.error(`Error reading ad settings from storage`, error);
            return INITIAL_AD_SETTINGS;
        }
    },
    saveSettings: (settings: AdSettings) => {
        try {
            storage.setItem(AD_SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error(`Error saving ad settings to storage`, error);
        }
    }
};
