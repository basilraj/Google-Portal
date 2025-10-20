import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
    
    let client;
    try {
        client = await db.connect();
        // A simple query to check the connection
        await client.sql`SELECT 1;`;
        return res.status(200).json({ status: 'ok', message: 'Database connection successful.' });
    } catch (error) {
        console.error('Database health check failed:', error);
        return res.status(503).json({ status: 'error', message: 'Database connection failed.' });
    } finally {
        if (client) {
            client.release();
        }
    }
}
