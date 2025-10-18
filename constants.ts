import { Job, JobCategory, QuickLink, ContentPost, Subscriber, AdSettings, BreakingNews } from './types';

export const INITIAL_JOB_CATEGORIES: JobCategory[] = [
    { id: '1', name: 'Latest Jobs' },
    { id: '2', name: 'Admit Card' },
    { id: '3', name: 'Results' },
];

export const INITIAL_JOBS: Job[] = [
    {
        id: 'job1',
        title: 'SSC CGL 2024 Notification',
        department: 'Latest Jobs',
        qualification: 'Bachelor Degree in Any Stream',
        lastDate: '2024-07-24',
        applyLink: '#',
        description: 'Staff Selection Commission Combined Graduate Level Examination 2024.',
        status: 'active',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'job2',
        title: 'UPSC Civil Services IAS/IFS Admit Card 2024',
        department: 'Admit Card',
        qualification: 'Bachelor Degree in Any Stream',
        lastDate: '2024-06-16',
        applyLink: '#',
        description: 'Union Public Service Commission Pre Exam Admit Card for IAS / IFS Recruitment 2024.',
        status: 'active',
        createdAt: new Date().toISOString(),
    },
    {
        id: 'job3',
        title: 'NTA NEET UG 2024 Result',
        department: 'Results',
        qualification: '10+2 with PCB',
        lastDate: '2024-05-30',
        applyLink: '#',
        description: 'National Testing Agency has declared the result for NEET UG 2024.',
        status: 'active',
        createdAt: new Date().toISOString(),
    }
];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
    { id: 'ql1', title: 'Check PAN-Aadhaar Link Status', url: '#', category: 'General', description: '', status: 'active' },
    { id: 'ql2', title: 'Pay Examination Fee Online', url: '#', category: 'General', description: '', status: 'active' },
];

export const INITIAL_POSTS: ContentPost[] = [
    {
        id: 'post1',
        title: 'How to Prepare for SSC CGL in 3 Months',
        content: 'A comprehensive guide on cracking the SSC CGL exam with a 3-month preparation strategy.',
        category: 'Preparation Tips',
        type: 'posts',
        status: 'published',
        publishedDate: '2024-05-10',
        createdAt: new Date().toISOString(),
    }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
    { id: 'sub1', email: 'testuser@example.com', subscriptionDate: '2024-01-15', status: 'active' },
];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
    { id: 'news1', text: 'UPSSSC PET 2024 Online Form Starting Soon.', link: '#', status: 'active' },
    { id: 'news2', text: 'Railway RPF Constable / SI Exam Date Declared.', link: '#', status: 'active' },
];

export const INITIAL_AD_SETTINGS: AdSettings = {
    adsense: { enabled: false, publisherId: '' },
    adsterra: { enabled: false, zoneId: '' },
    customAds: { enabled: false, code: '' },
    adFrequency: 'medium',
    adStartTime: '00:00',
    adEndTime: '23:59',
    bannerAds: true,
    squareAds: true,
    skyscraperAds: false,
    popupAds: false,
};
