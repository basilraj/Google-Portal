import React, { useState } from 'react';
import { Job } from '../types.ts';
import Icon from './Icon.tsx';
import { basePath } from '../App.tsx';
import { slugify } from '../utils/slugify.ts';
import Modal from './Modal.tsx';
import AdComponent from './AdComponent.tsx';
import { useData } from '../contexts/DataContext.tsx';
import { getAdCodeForPlacement } from '../utils/jobUtils.ts';

interface JobDetailViewProps {
  job: Job;
}

const JobDetailView: React.FC<JobDetailViewProps> = ({ job }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { adSettings } = useData();
  const jobDetailTopAdCode = getAdCodeForPlacement('jobDetailTopAd', adSettings);

  const jobUrl = `${window.location.origin}${basePath}/job/${slugify(job.title)}`.replace(/([^:]\/)\/+/g, "$1");
  const shareTitle = `Check out this job: ${job.title}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}&quote=${encodeURIComponent(shareTitle)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(shareTitle)}`;
  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + "\n\n" + jobUrl)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(jobUrl)}&text=${encodeURIComponent(shareTitle)}`;

  const handleConfirmRedirect = () => {
    window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  };

  return (
    <>
      <article className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        {jobDetailTopAdCode && (
            <div className="mb-6 -mx-6 -mt-6 md:-mx-8 md:-mt-8 rounded-t-lg overflow-hidden">
                <AdComponent code={jobDetailTopAdCode} placement="header" />
            </div>
        )}
        <h1 className="text-4xl font-bold text-[#1e3c72] mb-4">{job.title}</h1>
        <div className="text-base text-gray-600 mb-6 border-b pb-4 flex flex-wrap gap-x-6 gap-y-2">
          <span><Icon name="building" className="mr-2 text-gray-400" />{job.department}</span>
          <span><Icon name="tag" className="mr-2 text-gray-400" />{job.category}</span>
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
          <div className="flex items-center gap-4 text-gray-500 mb-4 sm:mb-0">
            <span className="text-sm font-semibold">Share this job:</span>
            <a href={facebookShareUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label="Share on Facebook" className="hover:text-blue-600 transition-colors"><Icon prefix="fab" name="facebook-f" className="text-xl" /></a>
            <a href={twitterShareUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label="Share on Twitter" className="hover:text-sky-500 transition-colors"><Icon prefix="fab" name="twitter" className="text-xl" /></a>
            <a href={whatsappShareUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label="Share on WhatsApp" className="hover:text-green-500 transition-colors"><Icon prefix="fab" name="whatsapp" className="text-xl" /></a>
            <a href={telegramShareUrl} target="_blank" rel="nofollow noopener noreferrer" aria-label="Share on Telegram" className="hover:text-blue-400 transition-colors"><Icon prefix="fab" name="telegram-plane" className="text-xl" /></a>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold py-3 px-6 rounded-md bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:opacity-90"
          >
            Apply Now
          </button>
        </div>
      </article>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Confirm External Navigation">
        <div className="space-y-6">
          <p className="text-gray-600">
            You are being redirected to the official application page. Please be aware that you are leaving our website, and we are not responsible for the content or practices of external sites.
          </p>
          <div className="font-semibold text-gray-800 break-all bg-gray-50 p-3 rounded-md border">
            <p className="text-xs text-gray-500 mb-1">Destination URL:</p>
            <Icon name="link" className="mr-2 text-gray-400" />
            {job.applyLink}
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmRedirect}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Proceed to Apply
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default JobDetailView;