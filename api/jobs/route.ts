import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const session = await getSession(req, res);
    if (!session.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        switch (req.method) {
            case 'POST':
                // Handle both single and bulk creation
                if (Array.isArray(req.body)) {
                    const jobsData = req.body.map(job => ({
                        ...job,
                        status: 'active',
                        postedDate: new Date(job.postedDate),
                        lastDate: new Date(job.lastDate),
                    }));
                    const newJobs = await prisma.$transaction(
                        jobsData.map(data => prisma.job.create({ data }))
                    );
                    await prisma.activityLog.create({ data: { action: 'Bulk Job Upload', details: `${newJobs.length} jobs added.` } });
                    return res.status(201).json(newJobs);
                } else {
                    const { affiliateCourses, affiliateBooks, ...jobData } = req.body;
                    const newJob = await prisma.job.create({
                        data: {
                            ...jobData,
                            postedDate: new Date(jobData.postedDate),
                            lastDate: new Date(jobData.lastDate),
                            affiliateCourses: {
                                connect: (affiliateCourses || []).map((c: { id: string }) => ({ id: c.id }))
                            },
                             affiliateBooks: {
                                connect: (affiliateBooks || []).map((b: { id: string }) => ({ id: b.id }))
                            }
                        },
                         include: { affiliateCourses: true, affiliateBooks: true },
                    });
                    await prisma.activityLog.create({ data: { action: 'Job Created', details: `New job added: ${newJob.title}` } });
                    return res.status(201).json(newJob);
                }

            case 'PUT':
                const { id, affiliateCourses: coursesToConnect, affiliateBooks: booksToConnect, ...updateData } = req.body;
                const updatedJob = await prisma.job.update({
                    where: { id },
                    data: {
                        ...updateData,
                        postedDate: new Date(updateData.postedDate),
                        lastDate: new Date(updateData.lastDate),
                        affiliateCourses: {
                            set: (coursesToConnect || []).map((c: { id: string }) => ({ id: c.id }))
                        },
                         affiliateBooks: {
                            set: (booksToConnect || []).map((b: { id: string }) => ({ id: b.id }))
                        }
                    },
                    include: { affiliateCourses: true, affiliateBooks: true },
                });
                 await prisma.activityLog.create({ data: { action: 'Job Updated', details: `Job updated: ${updatedJob.title}` } });
                return res.status(200).json(updatedJob);

            case 'DELETE':
                 if (req.body.ids) { // Bulk delete
                    const { ids } = req.body;
                    await prisma.job.deleteMany({ where: { id: { in: ids } } });
                    await prisma.activityLog.create({ data: { action: 'Bulk Job Deletion', details: `${ids.length} jobs deleted.` } });
                    return res.status(204).end();
                } else { // Single delete
                    const { id: deleteId } = req.body;
                    await prisma.job.delete({ where: { id: deleteId } });
                    await prisma.activityLog.create({ data: { action: 'Job Deleted', details: `Job with id ${deleteId} deleted.` } });
                    return res.status(204).end();
                }

            default:
                res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/jobs:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}