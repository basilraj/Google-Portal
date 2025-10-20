import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Job } from '../../types';

const dbToJob = (dbJob: any): Job => ({ id: dbJob.id, title: dbJob.title, department: dbJob.department, description: dbJob.description, qualification: dbJob.qualification, vacancies: dbJob.vacancies, postedDate: new Date(dbJob.posted_date).toISOString().split('T')[0], lastDate: new Date(dbJob.last_date).toISOString().split('T')[0], applyLink: dbJob.apply_link, status: dbJob.status, createdAt: new Date(dbJob.created_at).toISOString() });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        switch (req.method) {
            case 'GET':
                const getResult = await client.sql`SELECT * FROM jobs ORDER BY created_at DESC;`;
                const jobs = getResult.rows.map(dbToJob);
                res.status(200).json(jobs);
                break;
            case 'POST':
                if (req.body.jobs && Array.isArray(req.body.jobs)) { // Bulk add
                    const jobsData: Omit<Job, 'id' | 'status' | 'createdAt'>[] = req.body.jobs;
                    const newJobs: Job[] = [];
                    for (const job of jobsData) {
                        const result = await client.sql`INSERT INTO jobs (title, department, description, qualification, vacancies, posted_date, last_date, apply_link, status) VALUES (${job.title}, ${job.department}, ${job.description}, ${job.qualification}, ${job.vacancies}, ${job.postedDate}, ${job.lastDate}, ${job.applyLink}, 'active') RETURNING *;`;
                        newJobs.push(dbToJob(result.rows[0]));
                    }
                    res.status(201).json({ count: newJobs.length, newJobs });
                } else { // Add single job
                    const jobData: Omit<Job, 'id' | 'createdAt'> = req.body;
                    const result = await client.sql`INSERT INTO jobs (title, department, description, qualification, vacancies, posted_date, last_date, apply_link, status) VALUES (${jobData.title}, ${jobData.department}, ${jobData.description}, ${jobData.qualification}, ${jobData.vacancies}, ${jobData.postedDate}, ${jobData.lastDate}, ${jobData.applyLink}, ${jobData.status}) RETURNING *;`;
                    const newJob = dbToJob(result.rows[0]);
                    res.status(201).json(newJob);
                }
                break;
            case 'PUT':
                const { id: putId } = req.query;
                if (!putId || typeof putId !== 'string') return res.status(400).json({ message: 'Job ID is required' });
                const jobData: Job = req.body;
                const result = await client.sql`UPDATE jobs SET title = ${jobData.title}, department = ${jobData.department}, description = ${jobData.description}, qualification = ${jobData.qualification}, vacancies = ${jobData.vacancies}, posted_date = ${jobData.postedDate}, last_date = ${jobData.lastDate}, apply_link = ${jobData.applyLink}, status = ${jobData.status} WHERE id = ${putId} RETURNING *;`;
                if (result.rowCount === 0) return res.status(404).json({ message: 'Job not found' });
                res.status(200).json(dbToJob(result.rows[0]));
                break;
            case 'DELETE':
                const { id: deleteId } = req.query;
                if (deleteId && typeof deleteId === 'string') { // Single delete
                    await client.sql`DELETE FROM jobs WHERE id = ${deleteId};`;
                    res.status(200).json({ message: 'Job deleted successfully' });
                } else if (req.body.ids && Array.isArray(req.body.ids)) { // Bulk delete
                    const { ids } = req.body;
                    await client.sql`DELETE FROM jobs WHERE id = ANY(${ids}::uuid[]);`;
                    res.status(200).json({ message: 'Jobs deleted successfully' });
                } else {
                    res.status(400).json({ message: 'Job ID or an array of IDs is required' });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'An internal server error occurred' });
    } finally {
        client.release();
    }
}
