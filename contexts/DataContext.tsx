import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DataContextType, Job, Subscriber, QuickLink, ContentPost, BreakingNews, AdSettings, GeneralSettings } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';
import {
  initialJobs,
  initialSubscribers,
  initialQuickLinks,
  initialContentPosts,
  initialBreakingNews,
  initialAdSettings,
  initialGeneralSettings,
} from '../services/database';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useLocalStorage<Job[]>('jobs', initialJobs);
  const [subscribers, setSubscribers] = useLocalStorage<Subscriber[]>('subscribers', initialSubscribers);
  const [quickLinks, setQuickLinks] = useLocalStorage<QuickLink[]>('quickLinks', initialQuickLinks);
  const [contentPosts, setContentPosts] = useLocalStorage<ContentPost[]>('contentPosts', initialContentPosts);
  const [breakingNews, setBreakingNews] = useLocalStorage<BreakingNews[]>('breakingNews', initialBreakingNews);
  const [adSettings, setAdSettings] = useLocalStorage<AdSettings>('adSettings', initialAdSettings);
  const [generalSettings, setGeneralSettings] = useLocalStorage<GeneralSettings>('generalSettings', initialGeneralSettings);

  const generateId = () => new Date().toISOString() + Math.random().toString(36).substring(2, 9);
  
  // Job functions
  const addJob = (job: Omit<Job, 'id'>) => setJobs(prev => [{ ...job, id: generateId() }, ...prev]);
  const updateJob = (updatedJob: Job) => setJobs(prev => prev.map(job => (job.id === updatedJob.id ? updatedJob : job)));
  const deleteJob = (id: string) => setJobs(prev => prev.filter(job => job.id !== id));

  // Subscriber functions
  const addSubscriber = (email: string) => {
    const newSubscriber: Subscriber = {
      id: generateId(),
      email,
      subscriptionDate: new Date().toLocaleDateString(),
      status: 'active',
    };
    setSubscribers(prev => [...prev, newSubscriber]);
  };
  const deleteSubscriber = (id: string) => setSubscribers(prev => prev.filter(sub => sub.id !== id));

  // QuickLink functions
  const addQuickLink = (link: Omit<QuickLink, 'id'>) => setQuickLinks(prev => [{ ...link, id: generateId() }, ...prev]);
  const updateQuickLink = (updatedLink: QuickLink) => setQuickLinks(prev => prev.map(link => (link.id === updatedLink.id ? updatedLink : link)));
  const deleteQuickLink = (id: string) => setQuickLinks(prev => prev.filter(link => link.id !== id));

  // ContentPost functions
  const addContentPost = (post: Omit<ContentPost, 'id'>) => setContentPosts(prev => [{ ...post, id: generateId() }, ...prev]);
  const updateContentPost = (updatedPost: ContentPost) => setContentPosts(prev => prev.map(post => (post.id === updatedPost.id ? updatedPost : post)));
  const deleteContentPost = (id: string) => setContentPosts(prev => prev.filter(post => post.id !== id));

  // BreakingNews functions
  const addBreakingNews = (news: Omit<BreakingNews, 'id'>) => setBreakingNews(prev => [{ ...news, id: generateId() }, ...prev]);
  const updateBreakingNews = (updatedNews: BreakingNews) => setBreakingNews(prev => prev.map(news => (news.id === updatedNews.id ? updatedNews : news)));
  const deleteBreakingNews = (id: string) => setBreakingNews(prev => prev.filter(news => news.id !== id));

  // Settings functions
  const updateAdSettings = (settings: AdSettings) => setAdSettings(settings);
  const updateGeneralSettings = (settings: GeneralSettings) => setGeneralSettings(settings);

  const value: DataContextType = {
    loading,
    jobs, addJob, updateJob, deleteJob,
    subscribers, addSubscriber, deleteSubscriber,
    quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
    contentPosts, addContentPost, updateContentPost, deleteContentPost,
    breakingNews, addBreakingNews, updateBreakingNews, deleteBreakingNews,
    adSettings, updateAdSettings,
    generalSettings, updateGeneralSettings
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
