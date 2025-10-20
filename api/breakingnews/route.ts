import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { BreakingNews } from '../../types';

const dbToBreakingNews = (dbNews: any): BreakingNews => ({ id: dbNews.id, text: dbNews.text, link: dbNews.link, status: dbNews.status });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        switch (req.method) {
            case 'POST':
                const { text, link, status } = req.body;
                if (!text || !status) return res.status(400).json({ message: 'Text and status are required' });
                const postResult = await client.sql`INSERT INTO breaking_news (text, link, status) VALUES (${text}, ${link || null}, ${status}) RETURNING *;`;
                res.status(201).json(dbToBreakingNews(postResult.rows[0]));
                break;
            case 'PUT':
                const { id: putId } = req.query;
                if (!putId || typeof putId !== 'string') return res.status(400).json({ message: 'ID is required' });
                const putData: BreakingNews = req.body;
                const putResult = await client.sql`UPDATE breaking_news SET text = ${putData.text}, link = ${putData.link || null}, status = ${putData.status} WHERE id = ${putId} RETURNING *;`;
                if (putResult.rowCount === 0) return res.status(404).json({ message: 'News item not found' });
                res.status(200).json(dbToBreakingNews(putResult.rows[0]));
                break;
            case 'DELETE':
                const { id: deleteId } = req.query;
                if (!deleteId || typeof deleteId !== 'string') return res.status(400).json({ message: 'ID is required' });
                await client.sql`DELETE FROM breaking_news WHERE id = ${deleteId};`;
                res.status(200).json({ message: 'News item deleted successfully' });
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
