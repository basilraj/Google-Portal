import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ContactSubmission } from '../../types';

const dbToContact = (dbContact: any): ContactSubmission => ({ id: dbContact.id, name: dbContact.name, email: dbContact.email, subject: dbContact.subject, message: dbContact.message, submittedAt: new Date(dbContact.submitted_at).toISOString() });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        switch (req.method) {
            case 'POST':
                const { name, email, subject, message } = req.body;
                if (!name || !email || !subject || !message) return res.status(400).json({ message: 'All fields are required' });
                const postResult = await client.sql`INSERT INTO contacts (name, email, subject, message) VALUES (${name}, ${email}, ${subject}, ${message}) RETURNING *;`;
                res.status(201).json(dbToContact(postResult.rows[0]));
                break;
            case 'DELETE':
                const { id: deleteId } = req.query;
                if (!deleteId || typeof deleteId !== 'string') return res.status(400).json({ message: 'ID is required' });
                await client.sql`DELETE FROM contacts WHERE id = ${deleteId};`;
                res.status(200).json({ message: 'Contact submission deleted successfully' });
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
