import React from 'react';
import SEOHelmet from './SEOHelmet';

interface StaticPageProps {
  title: string;
  children: React.ReactNode;
}

const StaticPage: React.FC<StaticPageProps> = ({ title, children }) => {
  return (
    <>
      <SEOHelmet title={title} description={`Information about ${title} for our users.`} />
      <div className="bg-white p-6 md:p-10 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1e3c72] mb-6 border-b pb-4">{title}</h1>
        <div className="prose max-w-none text-gray-700">
          {children}
        </div>
      </div>
    </>
  );
};

export default StaticPage;
