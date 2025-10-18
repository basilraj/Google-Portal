import React from 'react';
import { ContentPost } from '../types';
import Icon from './Icon';

const BlogPostCard: React.FC<{ post: ContentPost }> = ({ post }) => {
    // Generate share URLs
    const shareUrl = window.location.href.split('#')[0]; // Blog page URL
    const shareTitle = `Read on our blog: ${post.title}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + "\n\n" + shareUrl)}`;
    
    // Truncate content for snippet
    const snippet = post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content;

    return (
        <div className="border bg-white rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
            {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-[#1e3c72] mb-2">{post.title}</h3>
                    <div className="text-sm text-gray-500 mb-4">
                        <span><Icon name="calendar-alt" className="mr-2 text-gray-400" />Published on {post.publishedDate}</span>
                        <span className="ml-4"><Icon name="tag" className="mr-2 text-gray-400" />{post.category}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{snippet}</p>
                </div>
                <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t">
                     <div className="flex items-center gap-3 text-gray-500">
                        <span className="text-sm font-semibold">Share:</span>
                        <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" title="Share on Facebook" className="hover:text-blue-600 transition-colors">
                            <Icon prefix="fab" name="facebook-f" className="text-lg" />
                        </a>
                        <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="hover:text-green-500 transition-colors">
                            <Icon prefix="fab" name="whatsapp" className="text-lg" />
                        </a>
                    </div>
                    {/* A "Read More" link could be added here in the future if a single post view is implemented */}
                </div>
            </div>
        </div>
    );
};

export default BlogPostCard;