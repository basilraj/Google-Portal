import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        switch (req.method) {
            case 'POST':
                const { email } = req.body;
                const existing = await prisma.subscriber.findUnique({ where: { email } });
                if (existing) {
                    return res.status(409).json({ message: 'This email is already subscribed.' });
                }
                const newSubscriber = await prisma.subscriber.create({
                    data: {
                        email,
                        status: 'active',
                        subscriptionDate: new Date(),
                    },
                });
                await prisma.activityLog.create({ data: { action: 'New Subscriber', details: `New subscriber: ${email}` } });
                return res.status(201).json(newSubscriber);
            
            case 'DELETE':
                const session = await getSession(req, res);
                if (!session.isAdmin) {
                    return res.status(401).json({ message: 'Unauthorized' });
                }
                await prisma.subscriber.delete({ where: { id: req.body.id } });
                await prisma.activityLog.create({ data: { action: 'Subscriber Deleted', details: `Subscriber with id ${req.body.id} deleted.` } });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/subscribers:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}