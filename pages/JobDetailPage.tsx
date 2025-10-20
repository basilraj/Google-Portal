import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Icon from '../components/Icon';
import PublicFooter from '../components/PublicFooter';
import PublicHeader from '../components/PublicHeader';
import JobDetailView from '../components/JobDetailView';
import { slugify } from '../utils/slugify';

const JobDetailPage: React.FC<{ jobSlug: string; navigate: (path: string) => void }> = ({ jobSlug, navigate }) => {
    const { jobs, seoSettings } = useData();
    const job = jobs.find(j => slugify(j.title) === jobSlug);

    useEffect(() => {
        if (job) {
            document.title = `${job.title} | ${seoSettings.global.siteTitle}`;
        } else {
            document.title = `Job Not Found | ${seoSettings.global.siteTitle}`;
        }
    }, [job, seoSettings.global.siteTitle]);

    if (!job) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <PublicHeader navigate={navigate} />
                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto text-center">
                        <Icon name="exclamation-circle" className="text-5xl text-red-400 mb-4" />
                        <h1 className="text-3xl font-bold text-[#1e3c72] mb-6">Job Not Found</h1>
                        <p className="text-gray-600 mb-6">The job you are looking for does not exist or may have been removed.</p>
                        <button onClick={() => navigate('/')} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                            Back to Homepage
                        </button>
                    </div>
                </main>
                <PublicFooter navigate={navigate} />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PublicHeader navigate={navigate} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <JobDetailView job={job} />
            </main>
            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default JobDetailPage;