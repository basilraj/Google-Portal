import React from 'react';
import StaticPage from '../components/StaticPage';

const AboutUs: React.FC = () => {
    return (
        <StaticPage title="About Us">
            <p>Welcome to our job portal! We are dedicated to providing the latest and most accurate information about government job vacancies (Sarkari Naukri) in India.</p>
            <p>Our mission is to help job seekers find their dream government job by providing them with timely notifications, exam details, admit cards, and results for various sectors like Railways, Banking, SSC, UPSC, Defence, and State Government jobs.</p>
            <h2 className="text-2xl font-semibold mt-6 mb-2">Our Vision</h2>
            <p>To be the most trusted and user-friendly platform for government job aspirants in India, empowering them to build a successful career in the public sector.</p>
            <h2 className="text-2xl font-semibold mt-6 mb-2">What We Offer</h2>
            <ul>
                <li><strong>Latest Job Notifications:</strong> Get instant updates on all new government job openings.</li>
                <li><strong>Exam Results:</strong> Quick access to results from all major government exams.</li>
                <li><strong>Admit Cards:</strong> Download your admit cards as soon as they are released.</li>
                <li><strong>Syllabus & Exam Patterns:</strong> Detailed information to help you prepare effectively.</li>
            </ul>
        </StaticPage>
    );
};

export default AboutUs;
