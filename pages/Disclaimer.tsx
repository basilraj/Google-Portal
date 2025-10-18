import React from 'react';
import StaticPage from '../components/StaticPage';

const Disclaimer: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <StaticPage title="Disclaimer" navigate={navigate}>
      <p>The information provided by Divine Computer Job Portal ("we," "us," or "our") on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
      
      <h2>Not an Official Government Website</h2>
      <p>Divine Computer Job Portal is a private entity and is not affiliated with, endorsed by, or in any way officially connected with any government agency, organization, or board. The names of government departments are used only for the purpose of identification of job postings. We are an independent informational portal that gathers and presents information about government job vacancies from various sources.</p>
      
      <h2>Accuracy of Information</h2>
      <p>We strive to provide accurate and up-to-date information. However, we do not guarantee the accuracy of all information presented. Job details such as vacancy counts, eligibility criteria, and important dates are subject to change by the official recruiting bodies. We strongly advise all users to verify all details on the official government websites before applying for any job.</p>
      
      <h2>External Links Disclaimer</h2>
      <p>The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.</p>
      
      <h2>No Professional Advice</h2>
      <p>The information given on the site is for general guidance on matters of interest only. Even if we take every precaution to insure that the content of the site is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules, and regulations, there may be delays, omissions, or inaccuracies in the information contained on the site. We are not responsible for any errors or omissions, or for the results obtained from the use of this information.</p>
    </StaticPage>
  );
};

export default Disclaimer;
