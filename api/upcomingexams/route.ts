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
                const newItem = await prisma.upcomingExam.create({
                    data: { ...postData, deadline: new Date(postData.deadline) },
                });
                return res.status(201).json(newItem);
            
            case 'PUT':
                const { id, ...updateData } = req.body;
                const updatedItem = await prisma.upcomingExam.update({
                    where: { id },
                    data: { ...updateData, deadline: new Date(updateData.deadline) },
                });
                return res.status(200).json(updatedItem);

            case 'DELETE':
                await prisma.upcomingExam.delete({ where: { id: req.body.id } });
                return res.status(204).end();

            default:
                res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
                return res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (error) {
        console.error(`Error in /api/upcomingexams:`, error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}