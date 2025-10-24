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
                const { action, details } = req.body;
                const newLog = await prisma.activityLog.create({ data: { action, details } });
                return res.status(201).json(newLog);
            
            case 'DELETE':
                if (req.body.clearAll) {
                    await prisma.activityLog.deleteMany({});
                    // Log the clearing action itself
                    await prisma.activityLog.create({ data: { action: 'Logs Cleared', details: 'All activity logs were cleared.' } });
                }
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/activitylogs:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}