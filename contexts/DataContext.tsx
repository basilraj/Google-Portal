import React, { createContext, useContext, ReactNode } from 'react';
import { Job, JobCategory, QuickLink, ContentPost, Subscriber, AdSettings, BreakingNews } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import {
    INITIAL_JOBS,
    INITIAL_JOB_CATEGORIES,
    INITIAL_QUICK_LINKS,
    INITIAL_POSTS,
    INITIAL_SUBSCRIBERS,
    INITIAL_AD_SETTINGS,
    INITIAL_BREAKING_NEWS
} from '../constants';

// Define the shape of the context data
interface DataContextType {
    jobs: Job[];
    addJob: (job: Omit<Job, 'id' | 'createdAt'>) => void;
    updateJob: (job: Job) => void;
    deleteJob: (jobId: string) => void;

    jobCategories: JobCategory[];
    addJobCategory: (category: Omit<JobCategory, 'id'>) => void;
    updateJobCategory: (category: JobCategory) => void;
    deleteJobCategory: (categoryId: string) => void;

    quickLinks: QuickLink[];
    addQuickLink: (link: Omit<QuickLink, 'id'>) => void;
    updateQuickLink: (link: QuickLink) => void;
    deleteQuickLink: (linkId: string) => void;

    posts: ContentPost[];
    addPost: (post: Omit<ContentPost, 'id' | 'createdAt'>) => void;
    updatePost: (post: ContentPost) => void;
    deletePost: (postId: string) => void;

    subscribers: Subscriber[];
    deleteSubscriber: (subscriberId: string) => void;

    breakingNews: BreakingNews[];
    addNews: (news: Omit<BreakingNews, 'id'>) => void;
    updateNews: (news: BreakingNews) => void;
    deleteNews: (newsId: string) => void;

    adSettings: AdSettings;
    updateAdSettings: (settings: AdSettings) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jobs, setJobs] = useLocalStorage<Job[]>('sarkari_jobs', INITIAL_JOBS);
    const [jobCategories, setJobCategories] = useLocalStorage<JobCategory[]>('sarkari_job_categories', INITIAL_JOB_CATEGORIES);
    const [quickLinks, setQuickLinks] = useLocalStorage<QuickLink[]>('sarkari_quick_links', INITIAL_QUICK_LINKS);
    const [posts, setPosts] = useLocalStorage<ContentPost[]>('sarkari_posts', INITIAL_POSTS);
    const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>('sarkari_subscribers', INITIAL_SUBSCRIBERS);
    const [breakingNews, setBreakingNews] = useLocalStorage<BreakingNews[]>('sarkari_breaking_news', INITIAL_BREAKING_NEWS);
    const [adSettings, setAdSettings] = useLocalStorage<AdSettings>('sarkari_ad_settings', INITIAL_AD_SETTINGS);

    // --- Job Management ---
    const addJob = (jobData: Omit<Job, 'id' | 'createdAt'>) => {
        const newJob: Job = { ...jobData, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setJobs(prev => [newJob, ...prev]);
    };
    const updateJob = (updatedJob: Job) => {
        setJobs(prev => prev.map(job => (job.id === updatedJob.id ? updatedJob : job)));
    };
    const deleteJob = (jobId: string) => {
        setJobs(prev => prev.filter(job => job.id !== jobId));
    };

    // --- Job Category Management ---
    const addJobCategory = (categoryData: Omit<JobCategory, 'id'>) => {
        const newCategory: JobCategory = { ...categoryData, id: crypto.randomUUID() };
        setJobCategories(prev => [...prev, newCategory]);
    };
    const updateJobCategory = (updatedCategory: JobCategory) => {
        setJobCategories(prev => prev.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat)));
    };
    const deleteJobCategory = (categoryId: string) => {
        setJobCategories(prev => prev.filter(cat => cat.id !== categoryId));
    };
    
    // --- QuickLink Management ---
    const addQuickLink = (linkData: Omit<QuickLink, 'id'>) => {
        const newLink: QuickLink = { ...linkData, id: crypto.randomUUID() };
        setQuickLinks(prev => [newLink, ...prev]);
    };
    const updateQuickLink = (updatedLink: QuickLink) => {
        setQuickLinks(prev => prev.map(link => (link.id === updatedLink.id ? updatedLink : link)));
    };
    const deleteQuickLink = (linkId: string) => {
        setQuickLinks(prev => prev.filter(link => link.id !== linkId));
    };

    // --- Content Post Management ---
    const addPost = (postData: Omit<ContentPost, 'id' | 'createdAt'>) => {
        const newPost: ContentPost = { ...postData, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        setPosts(prev => [newPost, ...prev]);
    };
    const updatePost = (updatedPost: ContentPost) => {
        setPosts(prev => prev.map(post => (post.id === updatedPost.id ? updatedPost : post)));
    };
    const deletePost = (postId: string) => {
        setPosts(prev => prev.filter(post => post.id !== postId));
    };

    // --- Subscriber Management ---
    const deleteSubscriber = (subscriberId: string) => {
        setSubscribers(prev => prev.filter(sub => sub.id !== subscriberId));
    };
    
    // --- Breaking News Management ---
    const addNews = (newsData: Omit<BreakingNews, 'id'>) => {
        const newNewsItem: BreakingNews = { ...newsData, id: crypto.randomUUID() };
        setBreakingNews(prev => [newNewsItem, ...prev]);
    };
    const updateNews = (updatedNews: BreakingNews) => {
        setBreakingNews(prev => prev.map(news => (news.id === updatedNews.id ? updatedNews : news)));
    };
    const deleteNews = (newsId: string) => {
        setBreakingNews(prev => prev.filter(news => news.id !== newsId));
    };

    // --- Ad Settings Management ---
    const updateAdSettings = (settings: AdSettings) => {
        setAdSettings(settings);
    };

    const value = {
        jobs, addJob, updateJob, deleteJob,
        jobCategories, addJobCategory, updateJobCategory, deleteJobCategory,
        quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
        posts, addPost, updatePost, deletePost,
        subscribers, deleteSubscriber,
        breakingNews, addNews, updateNews, deleteNews,
        adSettings, updateAdSettings
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
