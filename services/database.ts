import { Job, QuickLink, ContentPost, Subscriber, AdSettings, ContactSubmission, BreakingNews, SEOSettings, AdminCredentials } from '../types';
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

const SEO_SETTINGS_KEY = 'seo_settings';
const INITIAL_SEO_SETTINGS: SEOSettings = {
    global: {
        siteTitle: 'Divine Computer Job Portal - Your Gateway to Government Jobs',
        metaDescription: 'Find the latest government job openings, exam notifications, and results. Your one-stop destination for Sarkari Naukri updates.',
        metaKeywords: 'sarkari naukri, government jobs, railway jobs, ssc jobs, banking jobs, upsc',
    },
    social: {
        ogTitle: 'Divine Computer Job Portal',
        ogDescription: 'Latest Government Job Openings, Exam Notifications and Results.',
        ogImageUrl: 'https://example.com/default-social-image.jpg',
    },
    structuredData: {
        jobPostingSchemaEnabled: true,
    }
};

export const seoService = {
    getSettings: (): SEOSettings => {
        try {
            const item = storage.getItem(SEO_SETTINGS_KEY);
            if(item) {
                const saved = JSON.parse(item);
                // Deep merge to ensure new fields are added from defaults
                return {
                    ...INITIAL_SEO_SETTINGS,
                    ...saved,
                    global: { ...INITIAL_SEO_SETTINGS.global, ...saved.global },
                    social: { ...INITIAL_SEO_SETTINGS.social, ...saved.social },
                    structuredData: { ...INITIAL_SEO_SETTINGS.structuredData, ...saved.structuredData },
                };
            } else {
                storage.setItem(SEO_SETTINGS_KEY, JSON.stringify(INITIAL_SEO_SETTINGS));
                return INITIAL_SEO_SETTINGS;
            }
        } catch (error) {
            console.error('Error reading SEO settings:', error);
            return INITIAL_SEO_SETTINGS;
        }
    },
    saveSettings: (settings: SEOSettings) => {
        try {
            storage.setItem(SEO_SETTINGS_KEY, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving SEO settings:', error);
        }
    }
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
        codes: [`<div style="background-color: #e0f2fe; border: 1px dashed #38bdf8; padding: 20px; text-align: center; width: 100%; border-radius: 8px; color: #075985;"><strong>Custom Ad Slot 1</strong><br/>Your Advertisement Here</div>`],
        rotation: false,
    },
    
    // Direct Placements
    headerAdEnabled: true,
    headerAdCode: `<div style="background-color: #f0f0f0; border: 1px dashed #ccc; padding: 20px; text-align: center; width: 100%; height: 90px;"><strong>Header Ad (728x90)</strong><br/>Your Advertisement Here</div>`,
    sidebarAdEnabled: true,
    sidebarAdCode: `<div style="background-color: #f0f0f0; border: 1px dashed #ccc; padding: 20px; text-align: center; width: 100%; height: 250px;"><strong>Sidebar Ad (300x250)</strong><br/>Your Advertisement Here</div>`,
    footerAdEnabled: true,
    footerAdCode: `<div style="background-color: #f0f0f0; border: 1px dashed #ccc; padding: 20px; text-align: center; width: 100%; height: 90px;"><strong>Footer Ad (728x90)</strong><br/>Your Advertisement Here</div>`,
    
    // Advanced Features
    abTests: [
        { id: 'header', placement: 'Header', enabled: false, codeA: '', codeB: '', stats: { impressionsA: 1050, clicksA: 50, impressionsB: 1045, clicksB: 65 } },
        { id: 'sidebar', placement: 'Sidebar', enabled: false, codeA: '', codeB: '', stats: { impressionsA: 2230, clicksA: 120, impressionsB: 2190, clicksB: 110 } },
        { id: 'footer', placement: 'Footer', enabled: false, codeA: '', codeB: '', stats: { impressionsA: 0, clicksA: 0, impressionsB: 0, clicksB: 0 } },
    ],
    geoTargeting: {
        enabled: false,
        rules: [],
    },
    deviceTargeting: {
        enabled: false,
        desktopCode: '',
        mobileCode: '',
    }
};

export const adService = {
    getSettings: (): AdSettings => {
        try {
            const item = storage.getItem(AD_SETTINGS_KEY);
            if (item) {
                // Merge saved settings with defaults to ensure new fields are present
                const savedSettings = JSON.parse(item);
                // Deep merge for nested objects
                const mergedSettings = { ...INITIAL_AD_SETTINGS, ...savedSettings };
                mergedSettings.adsense = { ...INITIAL_AD_SETTINGS.adsense, ...savedSettings.adsense };
                mergedSettings.adsterra = { ...INITIAL_AD_SETTINGS.adsterra, ...savedSettings.adsterra };
                mergedSettings.customAds = { ...INITIAL_AD_SETTINGS.customAds, ...savedSettings.customAds };
                mergedSettings.geoTargeting = { ...INITIAL_AD_SETTINGS.geoTargeting, ...savedSettings.geoTargeting };
                mergedSettings.deviceTargeting = { ...INITIAL_AD_SETTINGS.deviceTargeting, ...savedSettings.deviceTargeting };
                // Ensure abTests array is fully formed
                if (savedSettings.abTests) {
                    mergedSettings.abTests = INITIAL_AD_SETTINGS.abTests.map(defaultTest => {
                        const savedTest = savedSettings.abTests.find((t:any) => t.id === defaultTest.id);
                        return savedTest ? { ...defaultTest, ...savedTest } : defaultTest;
                    });
                }
                return mergedSettings;
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

const AUTH_KEY = 'admin_credentials';
const INITIAL_CREDENTIALS: AdminCredentials = {
    username: 'admin',
    password: 'sarkari2025'
};

export const authService = {
    getCredentials: (): AdminCredentials => {
        try {
            const item = storage.getItem(AUTH_KEY);
            if (item) {
                return JSON.parse(item);
            }
            storage.setItem(AUTH_KEY, JSON.stringify(INITIAL_CREDENTIALS));
            return INITIAL_CREDENTIALS;
        } catch (error) {
            console.error('Error reading auth credentials:', error);
            return INITIAL_CREDENTIALS;
        }
    },
    saveCredentials: (credentials: AdminCredentials) => {
        try {
            storage.setItem(AUTH_KEY, JSON.stringify(credentials));
        } catch (error) {
            console.error('Error saving auth credentials:', error);
        }
    }
};
