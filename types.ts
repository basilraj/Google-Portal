export interface Job {
    id: string;
    title: string;
    department: string;
    qualification: string;
    lastDate: string; // ISO string for date
    applyLink: string;
    description: string;
    status: 'active' | 'expired';
    createdAt?: string; // ISO string for datetime
}

export interface JobCategory {
    id: string;
    name: string;
}

export interface QuickLink {
    id: string;
    title: string;
    url: string;
    category: string;
    description: string;
    status: 'active' | 'inactive';
}

export interface ContentPost {
    id: string;
    title: string;
    content: string;
    category: string;
    type: 'posts' | 'exam-notices' | 'results';
    status: 'published' | 'draft';
    publishedDate: string; // YYYY-MM-DD
    examDate?: string; // YYYY-MM-DD
    createdAt?: string; // ISO string for datetime
}

export interface Subscriber {
    id: string;
    email: string;
    subscriptionDate: string; // YYYY-MM-DD
    status: 'active' | 'unsubscribed';
}

export interface BreakingNews {
    id: string;
    text: string;
    link: string;
    status: 'active' | 'inactive';
}

export interface AdSettings {
    adsense: {
        enabled: boolean;
        publisherId: string;
    };
    adsterra: {
        enabled: boolean;
        zoneId: string;
    };
    customAds: {
        enabled: boolean;
        code: string;
    };
    adFrequency: 'low' | 'medium' | 'high';
    adStartTime: string; // HH:mm
    adEndTime: string; // HH:mm
    bannerAds: boolean;
    squareAds: boolean;
    skyscraperAds: boolean;
    popupAds: boolean;
}
