import React from 'react';
import { useData } from '../contexts/DataContext';
import { ContentPost } from '../types';
import SEOHelmet from '../components/SEOHelmet';
import Icon from '../components/Icon';

const BlogPostCard: React.FC<{ post: ContentPost }> = ({ post }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6">
            <p className="text-sm text-gray-500 mb-2">{post.category} - {new Date(post.publishedDate).toLocaleDateString()}</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.content.substring(0, 150)}...</p>
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-2">
                Read More <Icon name="arrow-right" />
            </a>
        </div>
    </div>
);


const BlogPage: React.FC = () => {
    const { posts } = useData();
    const blogPosts = posts.filter(p => p.type === 'posts' && p.status === 'published');
    
    return (
        <>
        <SEOHelmet 
            title="Blog - Preparation Tips and Career Guidance"
            description="Read our latest blog posts for government job preparation tips, career guidance, and exam updates."
        />
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center text-[#1e3c72] mb-8">Our Blog</h1>
            {blogPosts.length > 0 ? (
                <div className="space-y-8">
                    {blogPosts.map(post => <BlogPostCard key={post.id} post={post} />)}
                </div>
            ) : (
                <p className="text-center text-gray-500">No blog posts found.</p>
            )}
        </div>
        </>
    );
};

export default BlogPage;
