import { Job, QuickLink, ContentPost, Subscriber, ContactSubmission, BreakingNews } from './types';

export const INITIAL_JOBS: Job[] = [
    {
        id: '1',
        title: 'Railway Recruitment Board - Assistant Loco Pilot',
        department: 'Railways',
        description: 'Assistant Loco Pilot position in Indian Railways. Great opportunity for ITI and 10+2 passed candidates.',
        qualification: '12th Pass',
        vacancies: '5,696',
        postedDate: '2025-10-10',
        lastDate: '2025-11-15',
        applyLink: '#',
        status: 'active',
        createdAt: '2025-10-10T10:00:00Z',
    },
    {
        id: '2',
        title: 'SSC CHSL - Combined Higher Secondary Level',
        department: 'SSC',
        description: 'Combined Higher Secondary Level Examination for various government posts.',
        qualification: '12th Pass',
        vacancies: '3,712',
        postedDate: '2025-10-08',
        lastDate: '2025-11-20',
        applyLink: '#',
        status: 'active',
        createdAt: '2025-10-08T11:00:00Z',
    },
    {
        id: '3',
        title: 'UPSC Civil Services Examination 2026',
        department: 'UPSC',
        description: 'Prestigious Civil Services Examination for IAS, IPS, IFS and other central services.',
        qualification: 'Graduate',
        vacancies: '1,056',
        postedDate: '2025-09-25',
        lastDate: '2025-10-18',
        applyLink: '#',
        status: 'closing-soon',
        createdAt: '2025-09-25T09:00:00Z',
    },
     {
        id: '4',
        title: 'Banking Personnel Selection - Probationary Officer',
        department: 'Banking',
        description: 'IBPS PO recruitment for various public sector banks.',
        qualification: 'Graduate',
        vacancies: '4,500',
        postedDate: '2025-10-05',
        lastDate: '2025-11-10',
        applyLink: '#',
        status: 'active',
        createdAt: '2025-10-05T12:00:00Z',
    }
];

export const INITIAL_QUICK_LINKS: QuickLink[] = [
    { id: '1', title: 'Banking Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '2', title: 'Railway Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '3', title: 'SSC Jobs', category: 'Category', url: '#', description: '', status: 'active' },
    { id: '4', title: 'Defence Jobs', category: 'Category', url: '#', description: '', status: 'active' },
];

export const INITIAL_POSTS: ContentPost[] = [
    { id: '1', title: 'How to Prepare for SSC CGL 2025', category: 'Preparation Tips', content: '... content ...', status: 'published', type: 'posts', publishedDate: '2025-10-12', createdAt: '2025-10-12T14:00:00Z' },
    { id: '2', title: 'Top 10 Government Jobs for Graduates', category: 'Career Guidance', content: '... content ...', status: 'published', type: 'posts', publishedDate: '2025-10-10', createdAt: '2025-10-10T15:00:00Z' },
    { id: '3', title: 'Banking Exams Pattern Changes 2025', category: 'Exam Updates', content: '... content ...', status: 'draft', type: 'posts', publishedDate: '2025-10-08' },
    { id: '4', title: 'SSC CGL Tier-II Admit Card', category: 'Admit Card', content: '...', status: 'published', type: 'exam-notices', publishedDate: '2025-10-12', examDate: '2025-10-25' },
    { id: '5', title: 'IBPS PO Prelims 2025', category: 'Admit Card', content: '...', status: 'published', type: 'exam-notices', publishedDate: '2025-10-10', examDate: '2025-11-05' },
    { id: '6', title: 'SSC MTS Result 2025', category: 'Results', content: '...', status: 'published', type: 'results', publishedDate: '2025-10-13', examDate: '2025-08-15' },
    { id: '7', title: 'Railway Group D Result 2025', category: 'Results', content: '...', status: 'published', type: 'results', publishedDate: '2025-10-11', examDate: '2025-09-20' },
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
    { id: '1', email: 'subscriber1@example.com', subscriptionDate: '2025-10-01', status: 'active' },
    { id: '2', email: 'subscriber2@example.com', subscriptionDate: '2025-10-02', status: 'active' },
];

export const INITIAL_CONTACTS: ContactSubmission[] = [];

export const INITIAL_BREAKING_NEWS: BreakingNews[] = [
    { id: '1', text: 'SSC CGL 2025 Notification Released. Last date to apply is Nov 20, 2025.', link: '#', status: 'active' },
    { id: '2', text: 'Railway NTPC Final Result has been declared. Check your result now.', link: '#', status: 'active' },
    { id: '3', text: 'UPSC Civil Services 2026 Prelims Exam Date Announced.', link: '#', status: 'active' },
];
