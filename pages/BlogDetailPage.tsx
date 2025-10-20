
import React, { useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import Icon from '../components/Icon';
import PublicFooter from '../components/PublicFooter';
import { basePath } from '../App';
import PublicHeader from '../components/PublicHeader';

const BlogDetailPage: React.FC<{ postId: string; navigate: (path: string) => void }> = ({ postId, navigate }) => {
    const { posts, seoSettings, generalSettings } = useData();
    const post = posts.find(p => p.id === postId);
    const canonicalUrl = `${window.location.origin}${basePath}/blog/${postId}`.replace(/([^:]\/)\/+/g, "$1");

    useEffect(() => {
        document.querySelectorAll('[data-seo-managed]').forEach(el => el.remove());

        if (post) {
            document.title = `${post.title} | ${seoSettings.global.siteTitle}`;
            const metaDescription = post.content.substring(0, 155).replace(/\s+/g, ' ').trim() + '...';

            const head = document.head;
            const createMeta = (attrs: { [key: string]: string }) => {
                const meta = document.createElement('meta');
                Object.keys(attrs).forEach(key => meta.setAttribute(key, attrs[key]));
                meta.setAttribute('data-seo-managed', 'true');
                head.appendChild(meta);
            };
            const createLink = (attrs: { [key: string]: string }) => {
                const link = document.createElement('link');
                Object.keys(attrs).forEach(key => link.setAttribute(key, attrs[key]));
                link.setAttribute('data-seo-managed', 'true');
                head.appendChild(link);
            };

            // Standard Meta
            createMeta({ name: 'description', content: metaDescription });
            
            // Open Graph
            createMeta({ property: 'og:title', content: post.title });
            createMeta({ property: 'og:description', content: metaDescription });
            createMeta({ property: 'og:url', content: canonicalUrl });
            createMeta({ property: 'og:type', content: 'article' });
            createMeta({ property: 'og:site_name', content: generalSettings.siteTitle });
            if (post.imageUrl) createMeta({ property: 'og:image', content: post.imageUrl });

            // Twitter Card
            createMeta({ name: 'twitter:card', content: post.imageUrl ? 'summary_large_image' : 'summary' });
            createMeta({ name: 'twitter:title', content: post.title });
            createMeta({ name: 'twitter:description', content: metaDescription });
            if (post.imageUrl) createMeta({ name: 'twitter:image', content: post.imageUrl });

            // Canonical URL
            createLink({ rel: 'canonical', href: canonicalUrl });

            // Structured Data
            const articleSchema = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": post.title,
                "description": metaDescription,
                "image": post.imageUrl || '',
                "datePublished": post.publishedDate,
                "dateModified": post.publishedDate,
                "author": { "@type": "Organization", "name": "Jobtica" },
                "publisher": {
                    "@type": "Organization",
                    "name": "Jobtica",
                    "logo": {
                        "@type": "ImageObject",
                        "url": generalSettings.siteIconUrl
                    }
                },
                 "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": canonicalUrl
                }
            };
            
            const breadcrumbSchema = {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [{
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": `${window.location.origin}${basePath}/`.replace(/([^:]\/)\/+/g, "$1")
                }, {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Blog",
                    "item": `${window.location.origin}${basePath}/blog`.replace(/([^:]\/)\/+/g, "$1")
                }, {
                    "@type": "ListItem",
                    "position": 3,
                    "name": post.title
                }]
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.setAttribute('data-seo-managed', 'true');
            script.innerHTML = JSON.stringify([articleSchema, breadcrumbSchema]);
            head.appendChild(script);

        } else {
            document.title = `Post Not Found | ${seoSettings.global.siteTitle}`;
        }

        window.scrollTo(0, 0);
        
        return () => {
            document.querySelectorAll('[data-seo-managed]').forEach(el => el.remove());
        };
    }, [post, seoSettings, generalSettings, canonicalUrl]);


    if (!post) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <PublicHeader navigate={navigate} />
                <main className="flex-grow container mx-auto px-4 py-12">
                    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto text-center">
                        <Icon name="file-alt" className="text-5xl text-red-400 mb-4" />
                        <h1 className="text-3xl font-bold text-[#1e3c72] mb-6">Post Not Found</h1>
                        <p className="text-gray-600 mb-6">The blog post you are looking for does not exist or may have been removed.</p>
                        <button onClick={() => navigate('/blog')} className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                            Back to Blog
                        </button>
                    </div>
                </main>
                <PublicFooter navigate={navigate} />
            </div>
        );
    }
    
    const postUrl = `${window.location.origin}${basePath}/blog/${post.id}`.replace(/([^:]\/)\/+/g, "$1");
    const shareTitle = `Read on our blog: ${post.title}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(shareTitle)}`;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + "\n\n" + postUrl)}`;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <PublicHeader navigate={navigate} />
             <nav aria-label="Breadcrumb" className="bg-gray-100 border-b">
                <div className="container mx-auto px-4">
                    <ol className="flex items-center space-x-2 text-sm text-gray-500 py-3">
                        <li>
                            <a href={`${basePath}/`} onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-indigo-600 flex items-center gap-2">
                               <Icon name="home" /> Home
                            </a>
                        </li>
                        <li>
                            <Icon name="chevron-right" className="text-xs" />
                        </li>
                        <li>
                            <a href={`${basePath}/blog`} onClick={(e) => { e.preventDefault(); navigate('/blog'); }} className="hover:text-indigo-600">
                                Blog
                            </a>
                        </li>
                         <li>
                            <Icon name="chevron-right" className="text-xs" />
                        </li>
                        <li className="font-semibold text-gray-700 truncate" aria-current="page">
                            {post.title}
                        </li>
                    </ol>
                </div>
            </nav>
            <main className="flex-grow container mx-auto px-4 py-12">
                <article className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    {post.imageUrl && (
                        <img src={post.imageUrl} alt={post.title} loading="lazy" className="w-full aspect-video object-cover rounded-lg mb-6" />
                    )}
                    <h1 className="text-4xl font-bold text-[#1e3c72] mb-4">{post.title}</h1>
                    <div className="text-sm text-gray-600 mb-6 border-b pb-4 flex flex-wrap gap-x-6 gap-y-2">
                        <span><Icon name="calendar-alt" className="mr-2 text-gray-400" />Published on {post.publishedDate}</span>
                        <span><Icon name="tag" className="mr-2 text-gray-400" />{post.category}</span>
                    </div>

                    <div className="static-content">
                        <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>

                    <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t">
                        <div className="flex items-center gap-3 text-gray-500 mb-4 sm:mb-0">
                            <span className="text-sm font-semibold">Share this post:</span>
                            <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="hover:text-blue-600 transition-colors"><Icon prefix="fab" name="facebook-f" className="text-xl" /></a>
                            <a href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="hover:text-green-500 transition-colors"><Icon prefix="fab" name="whatsapp" className="text-xl" /></a>
                        </div>
                         <button onClick={() => navigate('/blog')} className="font-semibold py-3 px-6 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                            &larr; Back to Blog
                        </button>
                    </div>
                </article>
            </main>
            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default BlogDetailPage;
