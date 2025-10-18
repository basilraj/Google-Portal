import React from 'react';
import StaticPage from '../components/StaticPage';

const PrivacyPolicy: React.FC = () => {
    return (
        <StaticPage title="Privacy Policy">
            <p>Your privacy is important to us. It is our policy to respect your privacy regarding any information we may collect from you across our website.</p>
            <h3 className="font-bold mt-4">Information We Collect</h3>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used. The only personal information we collect is your email address when you voluntarily subscribe to our newsletter.</p>
            <h3 className="font-bold mt-4">How We Use Your Information</h3>
            <p>We use your email address to send you job alerts and newsletters. We do not share your email address with any third parties.</p>
            <h3 className="font-bold mt-4">Security</h3>
            <p>We take reasonable precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline.</p>
             <h3 className="font-bold mt-4">Links to Other Sites</h3>
            <p>Our website may contain links to other sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
            <h3 className="font-bold mt-4">Changes to This Policy</h3>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
        </StaticPage>
    );
};

export default PrivacyPolicy;
