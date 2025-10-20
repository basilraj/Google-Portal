
import React from 'react';
import { useData } from '../contexts/DataContext';
import Icon from './Icon';

const PublicFooter: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { posts, socialMediaSettings } = useData();

    const latestPosts = posts
        .filter(p => p.type === 'posts' && p.status === 'published')
        .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
        .slice(0, 3);

    return (
        <footer className="bg-[#1e3c72] text-white py-10 mt-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                    <div className="md:col-span-2">
                        <h3 className="text-lg font-bold mb-4">About Jobtica</h3>
                        <p className="text-sm text-gray-300">
                            Your premier destination for the latest government job notifications, run by Divine Computer, Elathagiri. We are dedicated to providing timely and accurate updates to help you achieve your career goals in the public sector.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                             <li><a href="/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="text-gray-300 hover:underline">About Us</a></li>
                             <li><a href="/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }} className="text-gray-300 hover:underline">Blog</a></li>
                             <li><a href="/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="text-gray-300 hover:underline">Privacy Policy</a></li>
                             <li><a href="/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="text-gray-300 hover:underline">Terms & Conditions</a></li>
                             <li><a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigate('/disclaimer'); }} className="text-gray-300 hover:underline">Disclaimer</a></li>
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold mb-4">Latest Blog Posts</h3>
                         {latestPosts.length > 0 ? (
                            <ul className="space-y-2 text-sm">
                                {latestPosts.map(post => (
                                    <li key={post.id}>
                                        <a href={`/blog/${post.id}`} onClick={(e) => { e.preventDefault(); navigate(`/blog/${post.id}`); }} className="text-gray-300 hover:underline" title={post.title}>
                                            {post.title.length > 35 ? `${post.title.substring(0, 35)}...` : post.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-gray-400">No recent blog posts.</p>
                        )}
                    </div>
                </div>
                <div className="border-t border-white/20 mt-8 pt-6 flex flex-col md:flex-row-reverse justify-between items-center text-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-xs text-gray-400">&copy; 2025 Jobtica. All Rights Reserved.</p>
                    </div>
                     <div className="flex justify-center space-x-6">
                        {socialMediaSettings.facebook && <a href={socialMediaSettings.facebook} target="_blank" rel="noopener noreferrer" aria-label="Visit our Facebook page" className="text-white hover:text-blue-500 transition-colors"><Icon prefix="fab" name="facebook-f" className="text-2xl" /></a>}
                        {socialMediaSettings.instagram && <a href={socialMediaSettings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Visit our Instagram page" className="text-white hover:text-pink-500 transition-colors"><Icon prefix="fab" name="instagram" className="text-2xl" /></a>}
                        {socialMediaSettings.telegram && <a href={socialMediaSettings.telegram} target="_blank" rel="noopener noreferrer" aria-label="Join our Telegram channel" className="text-white hover:text-blue-400 transition-colors"><Icon prefix="fab" name="telegram-plane" className="text-2xl" /></a>}
                        {socialMediaSettings.whatsapp && <a href={socialMediaSettings.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Contact us on WhatsApp" className="text-white hover:text-green-500 transition-colors"><Icon prefix="fab" name="whatsapp" className="text-2xl" /></a>}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default PublicFooter;