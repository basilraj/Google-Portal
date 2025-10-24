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
                const newLink = await prisma.quickLink.create({ data: req.body });
                await prisma.activityLog.create({ data: { action: 'Quick Link Created', details: `Link added: ${newLink.title}` } });
                return res.status(201).json(newLink);
            
            case 'PUT':
                const { id, ...updateData } = req.body;
                const updatedLink = await prisma.quickLink.update({ where: { id }, data: updateData });
                await prisma.activityLog.create({ data: { action: 'Quick Link Updated', details: `Link updated: ${updatedLink.title}` } });
                return res.status(200).json(updatedLink);

            case 'DELETE':
                await prisma.quickLink.delete({ where: { id: req.body.id } });
                await prisma.activityLog.create({ data: { action: 'Quick Link Deleted', details: `Link with id ${req.body.id} deleted.` } });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/quicklinks:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}