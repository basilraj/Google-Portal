import { Job, QuickLink, ContentPost, Subscriber, AdSettings, ContactSubmission } from '../types';
import { INITIAL_JOBS, INITIAL_QUICK_LINKS, INITIAL_POSTS, INITIAL_SUBSCRIBERS, INITIAL_CONTACTS } from '../constants';

const DB_KEYS = {
    JOBS: 'sarkari_jobs',
    LINKS: 'sarkari_links',
    POSTS: 'sarkari_posts',
    SUBSCRIBERS: 'sarkari_subscribers',
    AD_SETTINGS: 'sarkari_ad_settings',
    CONTACTS: 'sarkari_contacts',
};

const initialAdSettings: AdSettings = {
    adFrequency: 'medium',
    adTypes: { banner: true, square: true, skyscraper: false, popup: false },
    adScheduling: { start: '00:00', end: '23:59' }
};

// --- Generic Helper Functions ---
function getItems<T>(key: string, initialData: T[]): T[] {
    try {
        const items = window.localStorage.getItem(key);
        if (items) {
            return JSON.parse(items);
        } else {
            window.localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return initialData;
    }
}

function saveItems<T>(key: string, items: T[]) {
    try {
        window.localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
}

function getObject<T>(key: string, initialData: T): T {
     try {
        const item = window.localStorage.getItem(key);
        if (item) {
            return JSON.parse(item);
        } else {
            window.localStorage.setItem(key, JSON.stringify(initialData));
            return initialData;
        }
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return initialData;
    }
}

function saveObject<T>(key: string, data: T) {
     try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error writing to localStorage key “${key}”:`, error);
    }
}


// --- Job Service ---
export const jobService = {
    getJobs: (): Job[] => getItems<Job>(DB_KEYS.JOBS, INITIAL_JOBS),
    saveJobs: (jobs: Job[]) => saveItems<Job>(DB_KEYS.JOBS, jobs),
};

// --- QuickLink Service ---
export const linkService = {
    getLinks: (): QuickLink[] => getItems<QuickLink>(DB_KEYS.LINKS, INITIAL_QUICK_LINKS),
    saveLinks: (links: QuickLink[]) => saveItems<QuickLink>(DB_KEYS.LINKS, links),
};

// --- ContentPost Service ---
export const postService = {
    getPosts: (): ContentPost[] => getItems<ContentPost>(DB_KEYS.POSTS, INITIAL_POSTS),
    savePosts: (posts: ContentPost[]) => saveItems<ContentPost>(DB_KEYS.POSTS, posts),
};

// --- Subscriber Service ---
export const subscriberService = {
    getSubscribers: (): Subscriber[] => getItems<Subscriber>(DB_KEYS.SUBSCRIBERS, INITIAL_SUBSCRIBERS),
    saveSubscribers: (subscribers: Subscriber[]) => saveItems<Subscriber>(DB_KEYS.SUBSCRIBERS, subscribers),
};

// --- Ad Settings Service ---
export const adService = {
    getSettings: (): AdSettings => getObject<AdSettings>(DB_KEYS.AD_SETTINGS, initialAdSettings),
    saveSettings: (settings: AdSettings) => saveObject<AdSettings>(DB_KEYS.AD_SETTINGS, settings),
};

// --- Contact Service ---
export const contactService = {
    getContacts: (): ContactSubmission[] => getItems<ContactSubmission>(DB_KEYS.CONTACTS, INITIAL_CONTACTS),
    saveContacts: (contacts: ContactSubmission[]) => saveItems<ContactSubmission>(DB_KEYS.CONTACTS, contacts),
};
