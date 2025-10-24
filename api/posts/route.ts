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
                const postData = req.body;
                const newPost = await prisma.contentPost.create({
                    data: {
                        ...postData,
                        publishedDate: new Date(postData.publishedDate),
                        examDate: postData.examDate ? new Date(postData.examDate) : null,
                    },
                });
                await prisma.activityLog.create({ data: { action: 'Post Created', details: `Post created: ${newPost.title}` } });
                return res.status(201).json(newPost);
            
            case 'PUT':
                const { id, ...updateData } = req.body;
                const updatedPost = await prisma.contentPost.update({
                    where: { id },
                    data: {
                        ...updateData,
                        publishedDate: new Date(updateData.publishedDate),
                        examDate: updateData.examDate ? new Date(updateData.examDate) : null,
                    },
                });
                await prisma.activityLog.create({ data: { action: 'Post Updated', details: `Post updated: ${updatedPost.title}` } });
                return res.status(200).json(updatedPost);

            case 'DELETE':
                if (req.body.ids) { // Bulk delete
                    await prisma.contentPost.deleteMany({ where: { id: { in: req.body.ids } } });
                    await prisma.activityLog.create({ data: { action: 'Bulk Post Deletion', details: `${req.body.ids.length} posts deleted.` } });
                } else { // Single delete
                    await prisma.contentPost.delete({ where: { id: req.body.id } });
                    await prisma.activityLog.create({ data: { action: 'Post Deleted', details: `Post with id ${req.body.id} deleted.` } });
                }
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/posts:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}