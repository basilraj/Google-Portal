import React from 'react';
import StaticPage from '../components/StaticPage';

const TermsAndConditions: React.FC = () => {
    return (
        <StaticPage title="Terms and Conditions">
            <p>Please read these terms and conditions carefully before using Our Service.</p>
            <h3 className="font-bold mt-4">Acknowledgment</h3>
            <p>These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.</p>
            <p>Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.</p>
            <h3 className="font-bold mt-4">Intellectual Property</h3>
            <p>The Service and its original content, features and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries.</p>
            <h3 className="font-bold mt-4">Limitation of Liability</h3>
            <p>Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.</p>
            <h3 className="font-bold mt-4">Governing Law</h3>
            <p>The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws.</p>
        </StaticPage>
    );
};

export default TermsAndConditions;
