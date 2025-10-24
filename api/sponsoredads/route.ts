import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from '../../lib/prisma';
import { getSession } from '../../lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Click tracking is public, other actions are admin-only
    if (req.method !== 'PUT' || !req.body.trackClick) {
        const session = await getSession(req, res);
        if (!session.isAdmin) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
    
    try {
        switch (req.method) {
            case 'POST':
                const newItem = await prisma.sponsoredAd.create({ data: req.body });
                await prisma.activityLog.create({ data: { action: 'Sponsored Ad Added', details: `Ad added for ${newItem.destinationUrl}` } });
                return res.status(201).json(newItem);
            
            case 'PUT':
                if (req.body.trackClick) {
                    await prisma.sponsoredAd.update({
                        where: { id: req.body.id },
                        data: { clicks: { increment: 1 } },
                    });
                    return res.status(200).json({ message: 'Click tracked' });
                } else {
                    const { id, ...updateData } = req.body;
                    const updatedItem = await prisma.sponsoredAd.update({ where: { id }, data: updateData });
                    await prisma.activityLog.create({ data: { action: 'Sponsored Ad Updated', details: `Ad updated for ${updatedItem.destinationUrl}` } });
                    return res.status(200).json(updatedItem);
                }

            case 'DELETE':
                await prisma.sponsoredAd.delete({ where: { id: req.body.id } });
                await prisma.activityLog.create({ data: { action: 'Sponsored Ad Deleted', details: `Ad with id ${req.body.id} deleted.` } });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/sponsoredads:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}