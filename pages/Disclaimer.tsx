import React from 'react';
import StaticPage from '../components/StaticPage';

const Disclaimer: React.FC = () => {
    return (
        <StaticPage title="Disclaimer">
            <p>The information provided on this website is for general informational purposes only. All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.</p>
            <p>We are a private entity and not affiliated with any government organization. We source information from official government websites and other public domains. We strongly advise users to verify all details from the official government websites before applying for any job.</p>
            <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.</p>
        </StaticPage>
    );
};

export default Disclaimer;
