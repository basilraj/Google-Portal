import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const client = await db.connect();
    try {
        const { type, data } = req.body;
        const validTypes = ['adSettings', 'seoSettings', 'generalSettings', 'socialMediaSettings'];

        if (!type || !validTypes.includes(type)) {
            return res.status(400).json({ message: 'Invalid settings type provided.' });
        }
        if (!data) {
            return res.status(400).json({ message: 'Settings data is required.' });
        }

        const jsonData = JSON.stringify(data);

        // Upsert operation: Insert or update the setting based on its key.
        const result = await client.sql`
            INSERT INTO settings (key, value)
            VALUES (${type}, ${jsonData})
            ON CONFLICT (key) DO UPDATE
            SET value = EXCLUDED.value
            RETURNING value;
        `;
        
        res.status(200).json(result.rows[0].value);
    } catch (error) {
        console.error('API Error saving settings:', error);
        res.status(500).json({ message: 'An internal server error occurred while saving settings.' });
    } finally {
        client.release();
    }
}
