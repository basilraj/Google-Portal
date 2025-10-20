

import React, { useState, useMemo } from 'react';
// Fix: Add .tsx extension to local module imports.
import { useData } from '../contexts/DataContext.tsx';
import BlogPostCard from '../components/BlogPostCard.tsx';
import Icon from '../components/Icon.tsx';
import PublicFooter from '../components/PublicFooter.tsx';
// Fix: Add .tsx extension to local module imports.
import { ContentPost } from '../types.ts';
// Fix: Add .tsx extension to local module imports.
import PublicHeader from '../components/PublicHeader.tsx';

const AdComponent: React.FC<{ code: string }> = ({ code }) => (
    <div className="my-6" dangerouslySetInnerHTML={{ __html: code }} />
);

const BlogPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { posts, adSettings } = useData();
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    
    const blogPosts = useMemo(() => posts.filter(p => p.type === 'posts' && p.status === 'published')
                                      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()), [posts]);
    
    const categories = useMemo(() => {
        const allCategories = blogPosts.map(p => p.category);
        return ['All Categories', ...Array.from(new Set(allCategories)).sort()];
    }, [blogPosts]);

    const filteredBlogPosts = useMemo(() => {
        if (selectedCategory === 'All Categories') {
            return blogPosts;
        }
        return blogPosts.filter(post => post.category === selectedCategory);
    }, [blogPosts, selectedCategory]);

    const handleReadMore = (post: ContentPost) => {
        navigate(`/blog/${post.id}`);
    };

    return (
        <div className="public-website bg-gray-50">
            <PublicHeader navigate={navigate} />
            {adSettings.headerAdEnabled && <AdComponent code={adSettings.headerAdCode} />}

            <main className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                         <section id="blog-posts">
                             <h2 className="text-3xl font-bold text-[#1e3c72] my-6 pb-2 border-b-4 border-purple-500">Blog Posts</h2>
                             <div className="space-y-6">
                                {filteredBlogPosts.length > 0 ? (
                                    filteredBlogPosts.map(post => <BlogPostCard key={post.id} post={post} onReadMore={handleReadMore} />)
                                ) : (
                                    <p className="text-gray-500 bg-gray-100 p-4 rounded-md text-center">No blog posts found for the selected category.</p>
                                )}
                             </div>
                        </section>
                    </div>
                    <aside className="space-y-8 sticky top-24 h-fit">
                        <div className="widget bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-[#1e3c72] mb-4 pb-2 border-b-2 border-purple-500">Categories</h3>
                            <ul className="space-y-2">
                                {/* FIX: Add explicit type for 'category' to resolve potential type inference issues. */}
                                {categories.map((category: string) => (
                                    <li key={category}>
                                        <button 
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center ${selectedCategory === category ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                                        >
                                           <Icon name="chevron-right" className={`mr-2 text-xs ${selectedCategory === category ? 'text-indigo-500' : 'text-purple-500'}`}/>
                                           {category}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {adSettings.sidebarAdEnabled && <AdComponent code={adSettings.sidebarAdCode} />}
                    </aside>
                </div>
            </main>
             {adSettings.footerAdEnabled && (
                <div className="container mx-auto px-4">
                    <AdComponent code={adSettings.footerAdCode} />
                </div>
            )}
            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default BlogPage;