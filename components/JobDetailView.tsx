import React from 'react';
import { Job } from '../types.ts';
import Icon from './Icon.tsx';
import { basePath } from '../App.tsx';
import { slugify } from '../utils/slugify.ts';

interface JobDetailViewProps {
  job: Job;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ job }) => {
  const jobUrl = `${window.location.origin}${basePath}/job/${slugify(job.title)}`.replace(/([^:]\/)\/+/g, "$1");
  const shareTitle = `Check out this job: ${job.title}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(shareTitle)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + "\n\n" + jobUrl)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(shareTitle)}`;

  return (
    <article className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-[#1e3c72] mb-4">{job.title}</h1>
      <div className="text-sm text-gray-600 mb-6 border-b pb-4 flex flex-wrap gap-x-6 gap-y-2">
        <span><Icon name="building" className="mr-2 text-gray-400" />{job.department}</span>
        <span><Icon name="graduation-cap" className="mr-2 text-gray-400" />{job.qualification}</span>
        <span><Icon name="briefcase" className="mr-2 text-gray-400" />{job.vacancies} Vacancies</span>
        <span><Icon name="calendar-check" className="mr-2 text-gray-400" />Posted: {job.postedDate}</span>
        <span><Icon name="calendar-alt" className="mr-2 text-gray-400" />Last Date: {job.lastDate}</span>
      </div>

      <div className="static-content">
        <h2>Job Description</h2>
        <p className="whitespace-pre-wrap">{job.description}</p>
      </div>

      <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t">
        <div className="flex items-center gap-3 text-gray-500 mb-4 sm:mb-0">
          <span className="text-sm font-semibold">Share this job:</span>
          <a href={facebookShareUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label="Share on Facebook" className="hover:text-blue-600 transition-colors"><Icon prefix="fab" name="facebook-f" className="text-xl" /></a>
          <a href={whatsappShareUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label="Share on WhatsApp" className="hover:text-green-500 transition-colors"><Icon prefix="fab" name="whatsapp" className="text-xl" /></a>
          <a href={telegramShareUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label="Share on Telegram" className="hover:text-blue-400 transition-colors"><Icon prefix="fab" name="telegram-plane" className="text-xl" /></a>
        </div>
        <a href={job.applyLink} target="_blank" rel="nofollow noopener noreferrer" className="font-bold py-3 px-6 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90">
          Apply Now
        </a>
      </div>
    </article>
  );
};

export default JobDetailView;