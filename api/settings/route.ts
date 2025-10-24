import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const session = await getSession(req, res);
    if (!session.isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        if (req.method === 'POST') {
            const { key, value } = req.body;
            if (!key || value === undefined) {
                return res.status(400).json({ message: 'Bad Request: key and value are required.' });
            }
            await prisma.keyValueStore.upsert({
                where: { key },
                update: { value },
                create: { key, value },
            });
            await prisma.activityLog.create({ data: { action: 'Settings Updated', details: `${key} settings updated.` } });
            return res.status(200).json({ message: 'Settings updated' });
        }
        
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        console.error(`Error in /api/settings:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}