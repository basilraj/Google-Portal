import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method === 'GET') {
        res.status(200).json({ status: 'ok' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
