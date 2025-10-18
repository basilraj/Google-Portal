
export interface Job {
    id: string;
    title: string;
    department: string;
    description: string;
    qualification: string;
    vacancies: string;
    postedDate: string; // YYYY-MM-DD
    lastDate: string; // YYYY-MM-DD
    applyLink: string;
    status: 'active' | 'closing-soon' | 'expired';
    createdAt: string; // ISO string
}

export interface QuickLink {
    id: string;
    title: string;
    category: string;
    url: string;
    description: string;
    status: 'active' | 'inactive';
    createdAt?: string; // ISO String
}

export type PostType = 'posts' | 'exam-notices' | 'results';

export interface ContentPost {
    id: string;
    title: string;
    category: string;
    content: string;
    status: 'published' | 'draft';
    type: PostType;
    publishedDate: string; // YYYY-MM-DD
    examDate?: string; // YYYY-MM-DD
    createdAt?: string; // ISO string
}

export interface Subscriber {
    id: string;
    email: string;
    subscriptionDate: string; // YYYY-MM-DD
    status: 'active';
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    submittedAt: string; // ISO string
}

export interface BreakingNews {
    id: string;
    text: string;
    link: string;
    status: 'active' | 'inactive';
}

export interface ABTest {
    id: string;
    placement: string;
    enabled: boolean;
    codeA: string;
    codeB: string;
    stats: {
        impressionsA: number;
        clicksA: number;
        impressionsB: number;
        clicksB: number;
    };
}

export interface GeoTargetedAd {
    id: string;
    country: string;
    code: string;
}

export interface AdSettings {
    adFrequency: 'low' | 'medium' | 'high';
    bannerAds: boolean;
    squareAds: boolean;
    skyscraperAds: boolean;
    popupAds: boolean;
    adStartTime: string; // HH:mm
    adEndTime: string; // HH:mm
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
        codes: string[];
        rotation: boolean;
    };
    headerAdEnabled: boolean;
    headerAdCode: string;
    sidebarAdEnabled: boolean;
    sidebarAdCode: string;
    footerAdEnabled: boolean;
    footerAdCode: string;
    abTests: ABTest[];
    geoTargeting: {
        enabled: boolean;
        rules: GeoTargetedAd[];
    };
    deviceTargeting: {
        enabled: boolean;
        desktopCode: string;
        mobileCode: string;
    };
}

export interface SEOSettings {
    global: {
        siteTitle: string;
        metaDescription: string;
        metaKeywords: string;
    };
    social: {
        ogTitle: string;
        ogDescription: string;
        ogImageUrl: string;
    };
    structuredData: {
        jobPostingSchemaEnabled: boolean;
    };
}

export interface AdminCredentials {
    username: string;
    password: string;
}
