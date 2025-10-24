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
                const newItem = await prisma.emailTemplate.create({ data: req.body });
                await prisma.activityLog.create({ data: { action: 'Email Template Created', details: `Template created: ${newItem.name}` } });
                return res.status(201).json(newItem);
            
            case 'PUT':
                const { id, ...updateData } = req.body;
                const updatedItem = await prisma.emailTemplate.update({ where: { id }, data: updateData });
                await prisma.activityLog.create({ data: { action: 'Email Template Updated', details: `Template updated: ${updatedItem.name}` } });
                return res.status(200).json(updatedItem);

            case 'DELETE':
                await prisma.emailTemplate.delete({ where: { id: req.body.id } });
                await prisma.activityLog.create({ data: { action: 'Email Template Deleted', details: `Template with id ${req.body.id} deleted.` } });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/emailtemplates:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}