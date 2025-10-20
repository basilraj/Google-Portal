import { db } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function formatPost(post: any) {
    return {
      ...post,
      id: post.id,
      publishedDate: new Date(post.published_date).toISOString().split('T')[0],
      createdAt: new Date(post.created_at).toISOString(),
      examDate: post.exam_date ? new Date(post.exam_date).toISOString().split('T')[0] : undefined,
      imageUrl: post.image_url,
    };
}

export async function POST(request: NextRequest) {
    const client = await db.connect();
    try {
        const { title, category, content, status, type, publishedDate, examDate, imageUrl } = await request.json();
        const result = await client.sql`
            INSERT INTO posts (title, category, content, status, type, published_date, exam_date, image_url)
            VALUES (${title}, ${category}, ${content}, ${status}, ${type}, ${publishedDate}, ${examDate || null}, ${imageUrl || null})
            RETURNING *;
        `;
        return NextResponse.json(formatPost(result.rows[0]));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(request: NextRequest) {
    const client = await db.connect();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ message: 'Post ID is required' }, { status: 400 });
    }
    try {
        const { title, category, content, status, type, publishedDate, examDate, imageUrl } = await request.json();
        const result = await client.sql`
            UPDATE posts
            SET title = ${title}, category = ${category}, content = ${content}, status = ${status}, type = ${type}, published_date = ${publishedDate}, exam_date = ${examDate || null}, image_url = ${imageUrl || null}
            WHERE id = ${id}
            RETURNING *;
        `;
        return NextResponse.json(formatPost(result.rows[0]));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function DELETE(request: NextRequest) {
    const client = await db.connect();
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (id) {
            await client.sql`DELETE FROM posts WHERE id = ${id};`;
            return NextResponse.json({ message: 'Post deleted' });
        }

        const { ids } = await request.json();
        if (ids && Array.isArray(ids)) {
            await client.sql`DELETE FROM posts WHERE id = ANY(${ids});`;
            return NextResponse.json({ message: 'Posts deleted' });
        }
        
        return NextResponse.json({ message: 'Post ID or IDs are required' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting post(s)' }, { status: 500 });
    } finally {
        client.release();
    }
}