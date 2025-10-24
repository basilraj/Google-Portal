import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        switch (req.method) {
            case 'POST':
                const newSubmission = await prisma.contactSubmission.create({ data: req.body });
                return res.status(201).json(newSubmission);
            
            case 'DELETE':
                const session = await getSession(req, res);
                if (!session.isAdmin) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                await prisma.contactSubmission.delete({ where: { id: req.body.id } });
                await prisma.activityLog.create({ data: { action: 'Contact Deleted', details: `Contact message with id ${req.body.id} deleted.` } });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/contacts:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}