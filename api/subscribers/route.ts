import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Subscriber } from '../../types';

const dbToSubscriber = (dbSub: any): Subscriber => ({ id: dbSub.id, email: dbSub.email, subscriptionDate: new Date(dbSub.subscription_date).toISOString().split('T')[0], status: dbSub.status });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        switch (req.method) {
            case 'POST':
                const { email } = req.body;
                if (!email) return res.status(400).json({ message: 'Email is required' });
                
                const existing = await client.sql`SELECT * FROM subscribers WHERE email = ${email};`;
                if (existing.rowCount > 0) {
                    return res.status(200).json({ success: false, message: 'Email already subscribed' });
                }

                const postResult = await client.sql`INSERT INTO subscribers (email, subscription_date, status) VALUES (${email}, ${new Date().toISOString().split('T')[0]}, 'active') RETURNING *;`;
                res.status(201).json({ success: true, subscriber: dbToSubscriber(postResult.rows[0]) });
                break;
            case 'DELETE':
                const { id: deleteId } = req.query;
                if (!deleteId || typeof deleteId !== 'string') return res.status(400).json({ message: 'ID is required' });
                await client.sql`DELETE FROM subscribers WHERE id = ${deleteId};`;
                res.status(200).json({ message: 'Subscriber deleted successfully' });
                break;
            default:
                res.setHeader('Allow', ['POST', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'An internal server error occurred' });
    } finally {
        client.release();
    }
}
