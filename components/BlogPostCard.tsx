import React from 'react';
// Fix: Add .ts extension to local module imports.
import { ContentPost } from '../types.ts';
import Icon from './Icon.tsx';
import { basePath } from '../App.tsx';

const BlogPostCard: React.FC<{ post: ContentPost; onReadMore: (post: ContentPost) => void; }> = ({ post, onReadMore }) => {
    // Generate share URLs
    const postUrl = `${window.location.origin}${basePath}/blog/${post.id}`.replace(/([^:]\/)\/+/g, "$1");
    const shareTitle = `Read on our blog: ${post.title}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareTitle)}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + "\n\n" + postUrl)}`;
    const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(shareTitle)}`;
    
    // Truncate content for snippet
    const snippet = post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content;

    return (
        <div className="border bg-white rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
            {post.imageUrl && (
                <img src={post.imageUrl} alt={post.title} className="w-full aspect-video object-cover" />
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
                        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" title="Share on Twitter" className="hover:text-sky-500 transition-colors">
                            <Icon prefix="fab" name="twitter" className="text-lg" />
                        </a>
                        <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" title="Share on WhatsApp" className="hover:text-green-500 transition-colors">
                            <Icon prefix="fab" name="whatsapp" className="text-lg" />
                        </a>
                         <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer" title="Share on Telegram" className="hover:text-blue-400 transition-colors">
                            <Icon prefix="fab" name="telegram-plane" className="text-lg" />
                        </a>
                    </div>
                    <button onClick={() => onReadMore(post)} className="text-indigo-600 hover:underline text-sm font-semibold">
                        Read More &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogPostCard;