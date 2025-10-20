import { db } from '@vercel/postgres';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ContentPost } from '../../types';

const dbToPost = (dbPost: any): ContentPost => ({ id: dbPost.id, title: dbPost.title, category: dbPost.category, content: dbPost.content, status: dbPost.status, type: dbPost.type, publishedDate: new Date(dbPost.published_date).toISOString().split('T')[0], createdAt: new Date(dbPost.created_at).toISOString(), examDate: dbPost.exam_date ? new Date(dbPost.exam_date).toISOString().split('T')[0] : undefined, imageUrl: dbPost.image_url || undefined });

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const client = await db.connect();
    try {
        switch (req.method) {
            case 'GET':
                const getResult = await client.sql`SELECT * FROM posts ORDER BY created_at DESC;`;
                res.status(200).json(getResult.rows.map(dbToPost));
                break;
            case 'POST':
                const postData: Omit<ContentPost, 'id' | 'createdAt'> = req.body;
                const postResult = await client.sql`INSERT INTO posts (title, category, content, status, type, published_date, exam_date, image_url) VALUES (${postData.title}, ${postData.category}, ${postData.content}, ${postData.status}, ${postData.type}, ${postData.publishedDate}, ${postData.examDate || null}, ${postData.imageUrl || null}) RETURNING *;`;
                res.status(201).json(dbToPost(postResult.rows[0]));
                break;
            case 'PUT':
                const { id: putId } = req.query;
                if (!putId || typeof putId !== 'string') return res.status(400).json({ message: 'Post ID is required' });
                const putData: ContentPost = req.body;
                const putResult = await client.sql`UPDATE posts SET title = ${putData.title}, category = ${putData.category}, content = ${putData.content}, status = ${putData.status}, type = ${putData.type}, published_date = ${putData.publishedDate}, exam_date = ${putData.examDate || null}, image_url = ${putData.imageUrl || null} WHERE id = ${putId} RETURNING *;`;
                if (putResult.rowCount === 0) return res.status(404).json({ message: 'Post not found' });
                res.status(200).json(dbToPost(putResult.rows[0]));
                break;
            case 'DELETE':
                const { id: deleteId } = req.query;
                if (deleteId && typeof deleteId === 'string') { // Single delete
                    await client.sql`DELETE FROM posts WHERE id = ${deleteId};`;
                    res.status(200).json({ message: 'Post deleted successfully' });
                } else if (req.body.ids && Array.isArray(req.body.ids)) { // Bulk delete
                    const { ids } = req.body;
                    await client.sql`DELETE FROM posts WHERE id = ANY(${ids}::uuid[]);`;
                    res.status(200).json({ message: 'Posts deleted successfully' });
                } else {
                    res.status(400).json({ message: 'Post ID or an array of IDs is required' });
                }
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'An internal server error occurred' });
    } finally {
        client.release();
    }
}
