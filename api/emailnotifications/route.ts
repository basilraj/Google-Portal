import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const session = await getSession(req, res);
    if (!session.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        if (req.method === 'DELETE') {
            if (req.body.clearAll) {
                await prisma.emailNotification.deleteMany({});
            } else if (req.body.id) {
                await prisma.emailNotification.delete({ where: { id: req.body.id } });
            }
            return res.status(204).end();
        }
        
        res.setHeader('Allow', ['DELETE']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        console.error(`Error in /api/emailnotifications:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}