import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, QuickLink, ContentPost, Subscriber, AdSettings, ContactSubmission, BreakingNews } from '../types';
import * as db from '../services/database';

interface DataContextType {
  jobs: Job[];
  addJob: (job: Omit<Job, 'id' | 'status'>) => void;
  updateJob: (job: Job) => void;
  deleteJob: (jobId: string) => void;
  
  quickLinks: QuickLink[];
  addQuickLink: (link: Omit<QuickLink, 'id'>) => void;
  updateQuickLink: (link: QuickLink) => void;
  deleteQuickLink: (linkId: string) => void;
  
  posts: ContentPost[];
  addPost: (post: Omit<ContentPost, 'id'>) => void;
  updatePost: (post: ContentPost) => void;
  deletePost: (postId: string) => void;
  
  subscribers: Subscriber[];
  addSubscriber: (email: string) => boolean;
  deleteSubscriber: (subscriberId: string) => void;

  adSettings: AdSettings;
  updateAdSettings: (settings: AdSettings) => void;

  contacts: ContactSubmission[];
  addContact: (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => void;

  breakingNews: BreakingNews[];
  addNews: (news: Omit<BreakingNews, 'id'>) => void;
  updateNews: (news: BreakingNews) => void;
  deleteNews: (newsId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [posts, setPosts] = useState<ContentPost[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [adSettings, setAdSettings] = useState<AdSettings>(db.adService.getSettings());
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);


  useEffect(() => {
    setJobs(db.jobService.getJobs());
    setQuickLinks(db.linkService.getLinks());
    setPosts(db.postService.getPosts());
    setSubscribers(db.subscriberService.getSubscribers());
    setContacts(db.contactService.getContacts());
    setBreakingNews(db.breakingNewsService.getNews());
  }, []);

  // Job Functions
  const addJob = (jobData: Omit<Job, 'id' | 'status'>) => {
    const newJob: Job = { ...jobData, id: Date.now().toString(), status: 'active', createdAt: new Date().toISOString() };
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    db.jobService.saveJobs(updatedJobs);
  };
  const updateJob = (updatedJob: Job) => {
    const updatedJobs = jobs.map(j => j.id === updatedJob.id ? updatedJob : j);
    setJobs(updatedJobs);
    db.jobService.saveJobs(updatedJobs);
  };
  const deleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter(j => j.id !== jobId);
    setJobs(updatedJobs);
    db.jobService.saveJobs(updatedJobs);
  };

  // QuickLink Functions
  const addQuickLink = (linkData: Omit<QuickLink, 'id'>) => {
    const newLink: QuickLink = { ...linkData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    const updatedLinks = [...quickLinks, newLink];
    setQuickLinks(updatedLinks);
    db.linkService.saveLinks(updatedLinks);
  };
  const updateQuickLink = (updatedLink: QuickLink) => {
    const updatedLinks = quickLinks.map(l => l.id === updatedLink.id ? updatedLink : l);
    setQuickLinks(updatedLinks);
    db.linkService.saveLinks(updatedLinks);
  };
  const deleteQuickLink = (linkId: string) => {
    const updatedLinks = quickLinks.filter(l => l.id !== linkId);
    setQuickLinks(updatedLinks);
    db.linkService.saveLinks(updatedLinks);
  };
  
  // Post Functions
  const addPost = (postData: Omit<ContentPost, 'id'>) => {
    const newPost: ContentPost = { ...postData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    db.postService.savePosts(updatedPosts);
  };
  const updatePost = (updatedPost: ContentPost) => {
    const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    setPosts(updatedPosts);
    db.postService.savePosts(updatedPosts);
  };
  const deletePost = (postId: string) => {
    const updatedPosts = posts.filter(p => p.id !== postId);
    setPosts(updatedPosts);
    db.postService.savePosts(updatedPosts);
  };

  // Subscriber Functions
  const addSubscriber = (email: string): boolean => {
    if (subscribers.some(s => s.email === email)) {
        alert('This email is already subscribed.');
        return false;
    }
    const newSubscriber: Subscriber = { id: Date.now().toString(), email, subscriptionDate: new Date().toISOString().split('T')[0], status: 'active' };
    const updatedSubscribers = [...subscribers, newSubscriber];
    setSubscribers(updatedSubscribers);
    db.subscriberService.saveSubscribers(updatedSubscribers);
    return true;
  };
  const deleteSubscriber = (subscriberId: string) => {
    const updatedSubscribers = subscribers.filter(s => s.id !== subscriberId);
    setSubscribers(updatedSubscribers);
    db.subscriberService.saveSubscribers(updatedSubscribers);
  };
  
  // Ad Settings Function
  const updateAdSettings = (settings: AdSettings) => {
    setAdSettings(settings);
    db.adService.saveSettings(settings);
    alert('Ad settings saved!');
  };

  // Contact Form Function
  const addContact = (contactData: Omit<ContactSubmission, 'id' | 'submittedAt'>) => {
    const newContact: ContactSubmission = { ...contactData, id: Date.now().toString(), submittedAt: new Date().toISOString() };
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    db.contactService.saveContacts(updatedContacts);
  };

  // Breaking News Functions
  const addNews = (newsData: Omit<BreakingNews, 'id'>) => {
    const newNews: BreakingNews = { ...newsData, id: Date.now().toString() };
    const updatedNews = [...breakingNews, newNews];
    setBreakingNews(updatedNews);
    db.breakingNewsService.saveNews(updatedNews);
  };
  const updateNews = (updatedNewsItem: BreakingNews) => {
    const updatedNews = breakingNews.map(n => n.id === updatedNewsItem.id ? updatedNewsItem : n);
    setBreakingNews(updatedNews);
    db.breakingNewsService.saveNews(updatedNews);
  };
  const deleteNews = (newsId: string) => {
    const updatedNews = breakingNews.filter(n => n.id !== newsId);
    setBreakingNews(updatedNews);
    db.breakingNewsService.saveNews(updatedNews);
  };

  return (
    <DataContext.Provider value={{ 
        jobs, addJob, updateJob, deleteJob,
        quickLinks, addQuickLink, updateQuickLink, deleteQuickLink,
        posts, addPost, updatePost, deletePost,
        subscribers, addSubscriber, deleteSubscriber,
        adSettings, updateAdSettings,
        contacts, addContact,
        breakingNews, addNews, updateNews, deleteNews
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
