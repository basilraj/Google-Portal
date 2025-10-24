import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const session = await getSession(req, res);
    if (!session.isAdmin || session.isDemo) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        switch (req.method) {
            case 'POST':
                const { subject, body } = req.body;
                const newEmail = await prisma.customEmail.create({ data: { subject, body } });
                await prisma.activityLog.create({ data: { action: 'Email Campaign Sent', details: `Campaign sent: ${subject}` } });
                // In a real app, you would queue the email sending job here.
                return res.status(201).json(newEmail);
            
            case 'DELETE':
                await prisma.customEmail.delete({ where: { id: req.body.id } });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/customemails:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}