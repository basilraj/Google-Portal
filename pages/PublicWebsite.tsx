import React from 'react';
import { useData } from '../contexts/DataContext';
import { Job } from '../types';
import Icon from '../components/Icon';
import SEOHelmet from '../components/SEOHelmet';

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <div className="border-b-2 border-blue-600 p-4 hover:bg-gray-50 transition-colors duration-200">
        <h3 className="font-bold text-lg text-red-700"><a href={job.applyLink} target="_blank" rel="noopener noreferrer">{job.title}</a></h3>
        <ul className="text-sm text-gray-700 mt-2 space-y-1">
            <li><strong>Qualification:</strong> {job.qualification}</li>
            <li><strong>Last Date:</strong> <span className="font-semibold text-red-500">{new Date(job.lastDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span></li>
        </ul>
    </div>
);


const PublicWebsite: React.FC = () => {
    const { jobs, jobCategories } = useData();

    const activeJobs = jobs.filter(job => job.status !== 'expired');
    const getJobsByCategory = (category: string) => activeJobs.filter(job => job.department === category);
    
    return (
        <>
        <SEOHelmet 
            title="Sarkari Result - Latest Online Form, Sarkari Naukri"
            description="Sarkari Result, Sarkari Naukri Job Portal in India. Get the latest government job notifications, results, admit cards, and more."
        />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <main className="lg:col-span-3 space-y-8">
                {jobCategories.map(category => {
                    const categoryJobs = getJobsByCategory(category.name);
                    if (categoryJobs.length === 0) return null;
                    return (
                        <section key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-blue-800 text-white p-3">
                                <h2 className="text-2xl font-bold">{category.name} Jobs</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2">
                                {categoryJobs.map(job => <JobCard key={job.id} job={job} />)}
                            </div>
                        </section>
                    )
                })}
            </main>

            <aside className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Quick Links</h3>
                     <ul className="space-y-2">
                        {['Admit Card', 'Results', 'Latest Jobs', 'Answer Key', 'Syllabus', 'Admission'].map(link => (
                            <li key={link} className="flex items-center gap-2 text-blue-700 hover:text-red-700">
                                <Icon name="chevron-right" className="text-xs" />
                                <a href="#" className="font-semibold">{link}</a>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Join Us On</h3>
                    <div className="flex justify-around text-4xl text-gray-600">
                        <a href="#" className="hover:text-blue-800"><Icon prefix="fab" name="facebook-square" /></a>
                        <a href="#" className="hover:text-blue-400"><Icon prefix="fab" name="twitter-square" /></a>
                        <a href="#" className="hover:text-red-500"><Icon prefix="fab" name="youtube-square" /></a>
                         <a href="#" className="hover:text-green-500"><Icon prefix="fab" name="whatsapp-square" /></a>
                    </div>
                </div>
            </aside>
        </div>
        </>
    );
};

export default PublicWebsite;
