import React, { useEffect } from 'react';
import StaticPage from '../components/StaticPage';
import { useData } from '../contexts/DataContext';

const AboutUs: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { seoSettings } = useData();
  useEffect(() => {
    document.title = `About Us | ${seoSettings.global.siteTitle}`;
  }, [seoSettings.global.siteTitle]);

  return (
    <StaticPage title="About Us" navigate={navigate}>
      <h2>Our Mission</h2>
      <p>Welcome to <strong>Divine Computer Jobs</strong>, your number one source for all government job notifications. We're dedicated to giving you the very best and latest information, with a focus on accuracy, timeliness, and reliability.</p>
      <p>Our mission is to bridge the gap between job seekers and their dream government jobs. We understand the challenges of finding authentic information about government vacancies, and we strive to create a platform that simplifies this process, making it accessible to everyone across the country.</p>
      
      <h2>Who We Are</h2>
      <p>Founded in 2025, Divine Computer Jobs has come a long way from its beginnings. When we first started out, our passion for helping aspiring candidates drove us to do intense research and gave us the impetus to turn hard work and inspiration into a booming online portal. We now serve candidates all over India and are thrilled to be a part of the fair and transparent wing of the public service recruitment industry.</p>
      
      <h2>What We Offer</h2>
      <p>Our platform is designed to be a one-stop solution for government job aspirants. Here's what we provide:</p>
      <ul>
        <li><strong>Latest Job Openings:</strong> We provide timely updates on all central and state government job vacancies across various sectors like Banking, Railways, SSC, UPSC, Defence, and more.</li>
        <li><strong>Exam Notices:</strong> Stay informed about exam dates, admit card releases, and other important announcements.</li>
        <li><strong>Results:</strong> Get direct links and updates on the declaration of results for all major government examinations.</li>
        <li><strong>Career Guidance:</strong> Our blog section offers valuable tips, preparation strategies, and career guidance to help you succeed.</li>
      </ul>
      <p>We hope you find our service as helpful as we enjoy offering it to you. If you have any questions or comments, please don't hesitate to contact us.</p>
      
      <p>
        Sincerely,
        <br />
        The Divine Computer Jobs Team
      </p>
    </StaticPage>
  );
};

export default AboutUs;