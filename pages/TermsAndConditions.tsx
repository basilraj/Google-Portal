import React from 'react';
import StaticPage from '../components/StaticPage';

const TermsAndConditions: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <StaticPage title="Terms and Conditions" navigate={navigate}>
      <p>Welcome to Divine Computer Job Portal. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern Divine Computer Job Portal's relationship with you in relation to this website.</p>
      
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing this website, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you disagree with any part of these terms and conditions, please do not use our website.</p>
      
      <h2>2. Use of the Website</h2>
      <p>The content of the pages of this website is for your general information and use only. It is subject to change without notice. Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services, or information available through this website meet your specific requirements.</p>
      
      <h2>3. Intellectual Property</h2>
      <p>This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</p>
      
      <h2>4. User Conduct</h2>
      <p>You agree not to use the website in a way that may cause the website to be interrupted, damaged, rendered less efficient, or such that the effectiveness or functionality of the website is in any way impaired. You agree not to attempt any unauthorized access to any part or component of the website.</p>
      
      <h2>5. Limitation of Liability</h2>
      <p>In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website. Every effort is made to keep the website up and running smoothly. However, Divine Computer Job Portal takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.</p>
      
      <h2>6. Governing Law</h2>
      <p>Your use of this website and any dispute arising out of such use of the website is subject to the laws of India.</p>
    </StaticPage>
  );
};

export default TermsAndConditions;
