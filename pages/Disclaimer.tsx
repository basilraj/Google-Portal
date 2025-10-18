import React, { useEffect } from 'react';
import StaticPage from '../components/StaticPage';
import { useData } from '../contexts/DataContext';

const Disclaimer: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { seoSettings } = useData();
  useEffect(() => {
    document.title = `Disclaimer | ${seoSettings.global.siteTitle}`;
  }, [seoSettings.global.siteTitle]);

  return (
    <StaticPage title="Disclaimer" navigate={navigate}>
      <p>The information provided by Divine Computer Job Portal ("we," "us," or "our") on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
      <p><strong>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE IS SOLELY AT YOUR OWN RISK.</strong></p>
      
      <h2>Not an Official Government Website</h2>
      <p>Divine Computer Job Portal is a private entity and is <strong>not affiliated with, endorsed by, or in any way officially connected with any government agency, organization, or board.</strong> The names of government departments are used only for the purpose of identification of job postings. We are an independent informational portal that gathers and presents information about government job vacancies from various sources.</p>
      
      <h2>Accuracy of Information</h2>
      <p>We strive to provide accurate and up-to-date information. However, we do not guarantee the accuracy of all information presented. Job details such as vacancy counts, eligibility criteria, and important dates are subject to change by the official recruiting bodies.</p>
      <p><strong>We strongly advise all users to verify all details on the official government websites before applying for any job.</strong> Any reliance you place on such information is therefore strictly at your own risk.</p>
      
      <h2>External Links Disclaimer</h2>
      <p>The site may contain (or you may be sent through the site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.</p>
      <p><strong>WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE.</strong></p>
      
      <h2>No Professional Advice</h2>
      <p>The information given on the site is for general guidance on matters of interest only. It does not constitute professional advice. Even if we take every precaution to ensure that the content of the site is both current and accurate, errors can occur. Plus, given the changing nature of laws, rules, and regulations, there may be delays, omissions, or inaccuracies in the information contained on the site.</p>
      <p>We are not responsible for any errors or omissions, or for the results obtained from the use of this information. You should not act or refrain from acting on the basis of any content included in this site without seeking the appropriate legal or other professional advice on the particular facts and circumstances at issue.</p>
    </StaticPage>
  );
};

export default Disclaimer;