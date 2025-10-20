import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { QuickLink } from '../../types';

const dbToQuickLink = (dbLink: any): QuickLink => ({ id: dbLink.id, title: dbLink.title, category: dbLink.category, url: dbLink.url, description: dbLink.description, status: dbLink.status });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        switch (req.method) {
            case 'POST':
                const linkData: Omit<QuickLink, 'id'> = req.body;
                const postResult = await client.sql`INSERT INTO quick_links (title, category, url, description, status) VALUES (${linkData.title}, ${linkData.category}, ${linkData.url}, ${linkData.description}, ${linkData.status}) RETURNING *;`;
                res.status(201).json(dbToQuickLink(postResult.rows[0]));
                break;
            case 'PUT':
                const { id: putId } = req.query;
                if (!putId || typeof putId !== 'string') return res.status(400).json({ message: 'ID is required' });
                const putData: QuickLink = req.body;
                const putResult = await client.sql`UPDATE quick_links SET title = ${putData.title}, category = ${putData.category}, url = ${putData.url}, description = ${putData.description}, status = ${putData.status} WHERE id = ${putId} RETURNING *;`;
                if (putResult.rowCount === 0) return res.status(404).json({ message: 'Link not found' });
                res.status(200).json(dbToQuickLink(putResult.rows[0]));
                break;
            case 'DELETE':
                const { id: deleteId } = req.query;
                if (!deleteId || typeof deleteId !== 'string') return res.status(400).json({ message: 'ID is required' });
                await client.sql`DELETE FROM quick_links WHERE id = ${deleteId};`;
                res.status(200).json({ message: 'Link deleted successfully' });
                break;
            default:
                res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'An internal server error occurred' });
    } finally {
        client.release();
    }
}
