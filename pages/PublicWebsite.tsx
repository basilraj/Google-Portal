import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import { Job, ContentPost, QuickLink } from '../types.ts';
import { getEffectiveJobStatus } from '../utils/jobUtils.ts';
import Icon from '../components/Icon.tsx';
import PublicHeader from '../components/PublicHeader.tsx';
import PublicFooter from '../components/PublicFooter.tsx';
import { slugify } from '../utils/slugify.ts';
import usePagination from '../hooks/usePagination.ts';
import Pagination from '../components/admin/Pagination.tsx';
import AdComponent from '../components/AdComponent.tsx';

const JobCard: React.FC<{ job: Job; onView: (slug: string) => void }> = React.memo(({ job, onView }) => (
    <div className="group border bg-white rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden hover:border-indigo-400">
        <div className="p-4 sm:p-5 flex-grow">
            <h3 className="text-md sm:text-lg font-bold text-[#1e3c72] leading-tight mb-2">{job.title}</h3>
            <p className="text-sm text-gray-500 mb-3">{job.department}</p>
            <div className="text-xs text-gray-600 space-y-2">
                <p className="flex items-center gap-2"><Icon name="graduation-cap" className="w-4 text-gray-400" />{job.qualification}</p>
                <p className="flex items-center gap-2"><Icon name="briefcase" className="w-4 text-gray-400" />{job.vacancies} Vacancies</p>
                <p className="flex items-center gap-2"><Icon name="calendar-alt" className="w-4 text-gray-400" />Last Date: {job.lastDate}</p>
            </div>
        </div>
        <div className="p-4 bg-gray-50 border-t">
            <a href={`/job/${slugify(job.title)}`} onClick={(e) => { e.preventDefault(); onView(slugify(job.title)); }} className="w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold group-hover:bg-indigo-700 transition-colors duration-200 block">View Details</a>
        </div>
    </div>
));

const PostCard: React.FC<{ post: ContentPost; navigate: (path: string) => void; typeLabel: string }> = React.memo(({ post, navigate, typeLabel }) => {
    const getButtonText = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('admit card')) return 'Get Admit Card';
        if (lowerTitle.includes('result')) return 'Check Result';
        return 'Get Exam Notice';
    };

    return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-md flex flex-col items-center justify-center font-bold text-center leading-none flex-shrink-0">
                <span className="text-lg">{new Date(post.publishedDate).getDate()}</span>
                <span className="text-xs uppercase">{new Date(post.publishedDate).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div>
                <span className="text-xs font-semibold text-purple-600 uppercase">{typeLabel}</span>
                <p className="font-semibold text-gray-800 leading-tight">{post.title}</p>
            </div>
        </div>
        <div className="w-full sm:w-auto flex justify-end">
        {post.detailsUrl ? (
            <a href={post.detailsUrl} target="_blank" rel="nofollow noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center text-center flex-shrink-0 text-sm bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-600 font-semibold transition-colors whitespace-nowrap">
                {getButtonText(post.title)}
            </a>
        ) : (
            <button onClick={() => navigate(`/blog/${post.id}`)} className="flex-shrink-0 text-sm text-indigo-600 hover:underline font-semibold whitespace-nowrap">Read More</button>
        )}
        </div>
    </div>
)});

const JOBS_PER_PAGE = 10;

const PublicWebsite: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { jobs, posts, quickLinks, breakingNews, adSettings, addSubscriber, seoSettings, trackSponsoredAdClick } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('All Departments');
    const [qualificationFilter, setQualificationFilter] = useState('All Qualifications');
    const [sortOption, setSortOption] = useState('postedDate-desc');
    const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success'|'error', text: string } | null>(null);

    useEffect(() => {
        document.title = seoSettings.global.siteTitle;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', seoSettings.global.metaDescription);
    }, [seoSettings]);
    
    const activeJobs = useMemo(() => jobs.filter(job => getEffectiveJobStatus(job) === 'active' || getEffectiveJobStatus(job) === 'closing-soon'), [jobs]);

    const sortedAndFilteredJobs = useMemo(() => {
        let filtered = activeJobs.filter(job => 
            (job.title.toLowerCase().includes(searchTerm.toLowerCase()) || job.department.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (departmentFilter === 'All Departments' || job.department === departmentFilter) &&
            (qualificationFilter === 'All Qualifications' || job.qualification === qualificationFilter)
        );

        const [key, direction] = sortOption.split('-');

        filtered.sort((a, b) => {
            let valA, valB;
            if (key === 'postedDate' || key === 'lastDate') {
                valA = new Date(a[key as 'postedDate' | 'lastDate']).getTime();
                valB = new Date(b[key as 'postedDate' | 'lastDate']).getTime();
            } else {
                return 0;
            }

            if (direction === 'asc') {
                return valA - valB;
            } else {
                return valB - valA;
            }
        });

        return filtered;
    }, [activeJobs, searchTerm, departmentFilter, qualificationFilter, sortOption]);
    
    const { currentPage, totalPages, paginatedData, goToPage } = usePagination(sortedAndFilteredJobs, { itemsPerPage: JOBS_PER_PAGE });
    
    const departments = useMemo(() => ['All Departments', ...Array.from(new Set(activeJobs.map(j => j.department))).sort()], [activeJobs]);
    const qualifications = useMemo(() => ['All Qualifications', ...Array.from(new Set(activeJobs.map(j => j.qualification))).sort()], [activeJobs]);
    const latestNotices = useMemo(() => posts.filter(p => p.type === 'exam-notices' && p.status === 'published').slice(0, 5), [posts]);
    const latestResults = useMemo(() => posts.filter(p => p.type === 'results' && p.status === 'published').slice(0, 5), [posts]);
    const activeBreakingNews = useMemo(() => breakingNews.filter(n => n.status === 'active'), [breakingNews]);
    const activeSidebarSponsoredAd = useMemo(() => adSettings.sponsoredAds.find(ad => ad.placement === 'sidebar-top' && ad.status === 'active'), [adSettings.sponsoredAds]);


    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubscribeMessage(null);
        if (!email) {
            setSubscribeMessage({ type: 'error', text: 'Please enter a valid email.'});
            return;
        }
        const result = await addSubscriber(email);
        if(result.success) {
            setSubscribeMessage({ type: 'success', text: 'Thank you for subscribing!'});
            setEmail('');
        } else {
            setSubscribeMessage({ type: 'error', text: result.message || 'An error occurred.'});
        }
    };
    
    return (
        <div className="public-website bg-gray-50">
            <PublicHeader navigate={navigate} />
            {adSettings.headerAdEnabled && <AdComponent code={adSettings.headerAdCode} placement="header" />}
            
            {activeBreakingNews.length > 0 && (
                <div className="bg-yellow-400 text-black overflow-hidden">
                    <div className="container mx-auto px-4 flex items-center h-10">
                        <span className="font-bold text-sm flex-shrink-0 mr-4">Breaking News:</span>
                        <div className="relative flex-1 h-full flex items-center overflow-hidden">
                             <div className="animate-marquee whitespace-nowrap">
                                {activeBreakingNews.map(news => (
                                    <a href={news.link} key={news.id} className="text-sm mx-8 hover:underline">{news.text}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <main className="container mx-auto px-4 py-12">
                <section id="job-search" className="mb-12">
                    <h2 className="text-3xl font-bold text-center text-[#1e3c72] mb-6">Find Your Dream Government Job</h2>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Search by job title or keyword..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <select 
                                value={departmentFilter}
                                onChange={e => setDepartmentFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white"
                            >
                                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                            </select>
                        </div>
                         <div className="mt-4 text-right">
                            <button 
                                onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                                className="text-sm font-semibold text-indigo-600 hover:underline"
                            >
                                {isAdvancedFilterOpen ? 'Hide' : 'Show'} Advanced Filters <Icon name={isAdvancedFilterOpen ? 'chevron-up' : 'chevron-down'} className="ml-1 text-xs" />
                            </button>
                        </div>
                        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAdvancedFilterOpen ? 'max-h-40 mt-4 pt-4 border-t' : 'max-h-0'}`}>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Qualification</label>
                                    <select 
                                        value={qualificationFilter}
                                        onChange={e => setQualificationFilter(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
                                    >
                                        {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Sort By</label>
                                    <select 
                                        value={sortOption}
                                        onChange={e => setSortOption(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-sm"
                                    >
                                        <option value="postedDate-desc">Posted Date (Newest First)</option>
                                        <option value="postedDate-asc">Posted Date (Oldest First)</option>
                                        <option value="lastDate-asc">Last Date (Ascending)</option>
                                        <option value="lastDate-desc">Last Date (Descending)</option>
                                    </select>
                                </div>
                           </div>
                        </div>
                    </div>
                </section>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <section id="job-listings">
                            <h2 className="text-2xl font-bold text-[#1e3c72] mb-4">Latest Jobs</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {paginatedData.reduce((acc, job, index) => {
                                    acc.push(<JobCard key={job.id} job={job} onView={(slug) => navigate(`/job/${slug}`)} />);
                                    // Insert ad after the 4th item (index 3)
                                    if (index === 3 && adSettings.inFeedJobsAdEnabled) {
                                        acc.push(
                                            <div key="ad-in-feed" className="md:col-span-2">
                                                <AdComponent code={adSettings.inFeedJobsAdCode} placement="in-feed" />
                                            </div>
                                        );
                                    }
                                    return acc;
                                }, [] as React.ReactNode[])}
                            </div>
                            {totalPages > 1 && (
                                <Pagination 
                                    currentPage={currentPage} 
                                    totalPages={totalPages} 
                                    onPageChange={goToPage} 
                                />
                            )}
                        </section>
                    </div>
                    <aside className="space-y-8 sticky top-24 h-fit">
                        {activeSidebarSponsoredAd && (
                            <div className="widget bg-white p-0 rounded-lg shadow-md overflow-hidden">
                                <a 
                                    href={activeSidebarSponsoredAd.destinationUrl} 
                                    target="_blank" 
                                    rel="nofollow noopener noreferrer sponsored"
                                    onClick={() => trackSponsoredAdClick(activeSidebarSponsoredAd.id)}
                                >
                                    <img 
                                        src={activeSidebarSponsoredAd.imageUrl} 
                                        alt="Sponsored Ad" 
                                        className="w-full h-auto" 
                                    />
                                </a>
                            </div>
                        )}
                        <div className="widget bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-[#1e3c72] mb-4 pb-2 border-b-2 border-purple-500">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                {quickLinks.filter(l => l.status === 'active').map(link => (
                                    <li key={link.id} className="flex items-start">
                                        <Icon name="link" className="text-purple-500 mt-1 mr-2"/>
                                        <a href={link.url} target="_blank" rel="nofollow noopener noreferrer" className="text-gray-700 hover:text-indigo-700">{link.title}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         {adSettings.sidebarAdEnabled && <AdComponent code={adSettings.sidebarAdCode} placement="sidebar" />}
                    </aside>
                </div>

                <section id="content-sections" className="mt-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                             <h3 className="text-xl font-bold text-[#1e3c72] mb-4 pb-2 border-b-2 border-purple-500">Exam Notices & Admit Cards</h3>
                             <div className="space-y-4">
                                {latestNotices.map(post => <PostCard key={post.id} post={post} navigate={navigate} typeLabel="Notice" />)}
                             </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-bold text-[#1e3c72] mb-4 pb-2 border-b-2 border-purple-500">Latest Results</h3>
                            <div className="space-y-4">
                                {latestResults.map(post => <PostCard key={post.id} post={post} navigate={navigate} typeLabel="Result" />)}
                            </div>
                        </div>
                    </div>
                </section>
                
                <section id="newsletter" className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-8 rounded-lg text-center">
                    <h2 className="text-3xl font-bold mb-2">Get Job Alerts</h2>
                    <p className="mb-6">Subscribe to our newsletter and never miss an update.</p>
                    <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex">
                        <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} className="flex-grow px-4 py-2 rounded-l-md text-gray-800" required />
                        <button type="submit" className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-r-md hover:bg-yellow-500">Subscribe</button>
                    </form>
                    {subscribeMessage && <p className={`mt-4 text-sm ${subscribeMessage.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>{subscribeMessage.text}</p>}
                </section>
            </main>

            {adSettings.footerAdEnabled && (
                <div className="container mx-auto px-4">
                    <AdComponent code={adSettings.footerAdCode} placement="footer" />
                </div>
            )}
            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default PublicWebsite;