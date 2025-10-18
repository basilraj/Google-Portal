import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Icon from '../components/Icon';
import PublicFooter from '../components/PublicFooter';
import { basePath } from '../App';
import PublicHeader from '../components/PublicHeader';

const JobDetailPage: React.FC<{ jobId: string; navigate: (path: string) => void }> = ({ jobId, navigate }) => {
    const { jobs, seoSettings } = useData();
    const job = jobs.find(j => j.id === jobId);

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
    
    const jobUrl = `${window.location.origin}${basePath}/job/${job.id}`.replace(/([^:]\/)\/+/g, "$1");
    const shareTitle = `Check out this job: ${job.title}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + "\n\n" + jobUrl)}`;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PublicHeader navigate={navigate} />
            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-[#1e3c72] mb-4">{job.title}</h1>
                    <div className="text-sm text-gray-600 mb-6 border-b pb-4 flex flex-wrap gap-x-6 gap-y-2">
                        <span><Icon name="building" className="mr-2 text-gray-400" />{job.department}</span>
                        <span><Icon name="graduation-cap" className="mr-2 text-gray-400" />{job.qualification}</span>
                        <span><Icon name="briefcase" className="mr-2 text-gray-400" />{job.vacancies} Vacancies</span>
                        <span><Icon name="calendar-check" className="mr-2 text-gray-400" />Posted: {job.postedDate}</span>
                        <span><Icon name="calendar-alt" className="mr-2 text-gray-400" />Last Date: {job.lastDate}</span>
                    </div>

                    <div className="static-content">
                        <h3>Job Description</h3>
                        <p className="whitespace-pre-wrap">{job.description}</p>
                    </div>

                    <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t">
                        <div className="flex items-center gap-3 text-gray-500 mb-4 sm:mb-0">
                            <span className="text-sm font-semibold">Share this job:</span>
                            <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="hover:text-blue-600 transition-colors"><Icon prefix="fab" name="facebook-f" className="text-xl" /></a>
                            <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="hover:text-green-500 transition-colors"><Icon prefix="fab" name="whatsapp" className="text-xl" /></a>
                        </div>
                        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="font-bold py-3 px-6 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90">
                            Apply Now
                        </a>
                    </div>
                </div>
            </main>
            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default JobDetailPage;
