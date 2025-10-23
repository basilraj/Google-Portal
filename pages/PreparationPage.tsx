import React, { useMemo } from 'react';
import { useData } from '../contexts/DataContext.tsx';
import { Job, AffiliateCourse, AffiliateBook } from '../types.ts';
import Icon from '../components/Icon.tsx';
import PublicHeader from '../components/PublicHeader.tsx';
import PublicFooter from '../components/PublicFooter.tsx';
import { slugify } from '../utils/slugify.ts';
import { getEffectiveJobStatus } from '../utils/jobUtils.ts';

const UpcomingExamCard: React.FC<{ job: Job; onView: (slug: string) => void }> = ({ job, onView }) => (
    <div className="flex items-center justify-between gap-4 border-b pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
        <div>
            <p className="font-bold text-gray-800">{job.title}</p>
            <p className="text-sm text-gray-500">{job.department}</p>
        </div>
        <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-red-600">Ends: {job.lastDate}</p>
            <a href={`/job/${slugify(job.title)}`} onClick={(e) => { e.preventDefault(); onView(slugify(job.title)); }} className="text-sm text-[var(--primary-color)] hover:underline font-semibold">
                View Details &rarr;
            </a>
        </div>
    </div>
);

const CourseCard: React.FC<{ course: AffiliateCourse }> = ({ course }) => (
    <div className="border rounded-lg p-4 flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
        <div>
            <p className="font-bold text-gray-800">{course.title}</p>
            <p className="text-sm text-gray-500 mb-3">Platform: {course.platform}</p>
        </div>
        <a href={course.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 text-sm bg-[var(--primary-color)] text-white text-center px-3 py-2 rounded-md font-semibold filter hover:brightness-90">
            View Course
        </a>
    </div>
);

const BookCard: React.FC<{ book: AffiliateBook }> = ({ book }) => (
    <div className="border rounded-lg p-4 text-center flex flex-col justify-between bg-white hover:shadow-md transition-shadow">
        {book.imageUrl && <img src={book.imageUrl} alt={book.title} className="h-40 mx-auto mb-3 object-contain" loading="lazy" />}
        <div>
            <p className="font-bold text-gray-800 text-sm">{book.title}</p>
            <p className="text-xs text-gray-500 mb-3">by {book.author}</p>
        </div>
        <a href={book.url} target="_blank" rel="noopener noreferrer nofollow" className="mt-2 text-sm bg-yellow-500 text-black px-3 py-2 rounded-md font-semibold hover:bg-yellow-600">
            Buy on Amazon
        </a>
    </div>
);


const PreparationPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
    const { jobs } = useData();

    const upcomingExams = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return jobs
            .filter(job => (getEffectiveJobStatus(job) === 'active' || getEffectiveJobStatus(job) === 'closing-soon') && new Date(job.lastDate) >= today)
            .sort((a, b) => new Date(a.lastDate).getTime() - new Date(b.lastDate).getTime())
            .slice(0, 10);
    }, [jobs]);
    
    const allCourses = useMemo(() => {
        const coursesMap = new Map<string, AffiliateCourse>();
        jobs.forEach(job => {
            job.affiliateCourses?.forEach(course => {
                if (!coursesMap.has(course.url)) {
                    coursesMap.set(course.url, course);
                }
            });
        });
        return Array.from(coursesMap.values());
    }, [jobs]);

    const allBooks = useMemo(() => {
        const booksMap = new Map<string, AffiliateBook>();
        jobs.forEach(job => {
            job.affiliateBooks?.forEach(book => {
                if (!booksMap.has(book.url)) {
                    booksMap.set(book.url, book);
                }
            });
        });
        return Array.from(booksMap.values());
    }, [jobs]);
    

    return (
        <div className="public-website bg-gray-50">
            <PublicHeader navigate={navigate} />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-extrabold text-center text-[#1e3c72] mb-8">Government Exam Preparation Hub</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-12">
                        {allCourses.length > 0 && (
                            <section>
                                <h2 className="text-3xl font-bold text-[#1e3c72] my-6 pb-2 border-b-4 border-[var(--accent-color)]">Best Courses</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {allCourses.map(course => <CourseCard key={course.id} course={course} />)}
                                </div>
                            </section>
                        )}
                        
                        {allBooks.length > 0 && (
                             <section>
                                <h2 className="text-3xl font-bold text-[#1e3c72] my-6 pb-2 border-b-4 border-[var(--accent-color)]">Top Recommended Books</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    {allBooks.map(book => <BookCard key={book.id} book={book} />)}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8 sticky top-24 h-fit">
                        {upcomingExams.length > 0 && (
                            <div className="widget bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-bold text-[#1e3c72] mb-4 pb-2 border-b-2 border-[var(--accent-color)]">Upcoming Exam Deadlines</h3>
                                <div className="space-y-4">
                                    {upcomingExams.map(job => (
                                        <UpcomingExamCard key={job.id} job={job} onView={(slug) => navigate(`/job/${slug}`)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            <PublicFooter navigate={navigate} />
        </div>
    );
};

export default PreparationPage;