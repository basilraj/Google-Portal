export interface Job {
  id: string;
  title: string;
  department: string;
  description: string;
  qualification: string;
  vacancies: string;
  postedDate: string;
  lastDate: string;
  applyLink: string;
  status: 'active' | 'closing-soon' | 'expired';
  createdAt?: string;
}

export interface QuickLink {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt?: string;
}

export type PostType = 'posts' | 'exam-notices' | 'results';

export interface ContentPost {
  id: string;
  title: string;
  category: string;
  content: string;
  status: 'published' | 'draft';
  type: PostType;
  publishedDate: string;
  examDate?: string;
  createdAt?: string;
}

export interface Subscriber {
    id: string;
    email: string;
    subscriptionDate: string;
    status: 'active' | 'unsubscribed';
}

export interface AdSettings {
    adFrequency: 'low' | 'medium' | 'high';
    adTypes: {
        banner: boolean;
        square: boolean;
        skyscraper: boolean;
        popup: boolean;
    };
    adScheduling: {
        start: string;
        end: string;
    }
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
}
