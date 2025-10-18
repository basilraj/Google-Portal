import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import BlogPostCard from '../components/BlogPostCard';
import Icon from '../components/Icon';

const PublicHeader: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <header className="bg-gradient-to-r from-[#1e3c72] to-[#2a5298] text-white shadow-lg sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap">
                <a href="/Google-Portal/" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="text-center md:text-left cursor-pointer">
                    <h1 className="text-2xl font-bold">Divine Computer Job Portal</h1>
                    <p className="text-sm opacity-90">Your Gateway to Government Jobs</p>
                </a>
                <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Icon name={isMenuOpen ? "times" : "bars"} className="text-2xl" />
                </button>
                <nav className={`w-full md:w-auto md:flex ${isMenuOpen ? 'block mt-4' : 'hidden'}`}>
                    <ul className="flex flex-col md:flex-row md:space-x-4">
                         {['Home', 'Latest Jobs', 'Blog', 'Exam Notices', 'Results', 'Contact Us'].map(item => (
                            <li key={item} className="w-full">
                                {item === 'Home' 
                                 ? <a href="/Google-Portal/" onClick={(e) => { e.preventDefault(); navigate('/'); setIsMenuOpen(false); }} className="block md:inline-block hover:bg-white/20 px-3 py-2 rounded-md transition-colors w-full">{item}</a>
                                 : item === 'Blog' 
                                 ? <a href="/Google-Portal/blog" onClick={(e) => {e.preventDefault(); navigate('/blog'); setIsMenuOpen(false);}} className="block md:inline-block hover:bg-white/20 px-3 py-2 rounded-md transition-colors w-full">{item}</a>
                                 : <a href={`/Google-Portal/#${item.toLowerCase().replace(/ /g, '-')}`} className="block md:inline-block hover:bg-white/20 px-3 py-2 rounded-md transition-colors w-full">{item}</a>
                                }
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

const PublicFooter: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
    <footer className="bg-[#1e3c72] text-white text-center py-8 mt-8">
        <div className="container mx-auto px-4">
            <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 mb-4">
                 <a href="/Google-Portal/privacy" onClick={(e) => { e.preventDefault(); navigate('/privacy'); }} className="hover:underline text-sm">Privacy Policy</a>
                 <a href="/Google-Portal/about" onClick={(e) => { e.preventDefault(); navigate('/about'); }} className="hover:underline text-sm">About Us</a>
                 <a href="/Google-Portal/blog" onClick={(e) => { e.preventDefault(); navigate('/blog'); }} className="hover:underline text-sm">Blog</a>
                 <a href="/Google-Portal/disclaimer" onClick={(e) => { e.preventDefault(); navigate('/disclaimer'); }} className="hover:underline text-sm">Disclaimer</a>
                 <a href="/Google-Portal/terms" onClick={(e) => { e.preventDefault(); navigate('/terms'); }} className="hover:underline text-sm">Terms and Conditions</a>
            </div>
            <p className="text-xs text-gray-400">&copy; 2025 Divine Computer Job Portal. All Rights Reserved.</p>
        </div>
    </footer>
);

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
                                    filteredBlogPosts.map(post => <BlogPostCard key={post.id} post={post} />)
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
                                {categories.map(category => (
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