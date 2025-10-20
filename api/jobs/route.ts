import { db } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Helper to format job data from DB to frontend format
function formatJob(job: any) {
    return {
      ...job,
      id: job.id,
      postedDate: new Date(job.posted_date).toISOString().split('T')[0],
      lastDate: new Date(job.last_date).toISOString().split('T')[0],
      createdAt: new Date(job.created_at).toISOString(),
    };
}

// POST - Create a new job or multiple jobs
export async function POST(request: NextRequest) {
    const client = await db.connect();
    try {
        const body = await request.json();

        // Handle bulk upload
        if (body.jobs && Array.isArray(body.jobs)) {
            const newJobs = [];
            for (const job of body.jobs) {
                const result = await client.sql`
                    INSERT INTO jobs (title, department, description, qualification, vacancies, posted_date, last_date, apply_link, status)
                    VALUES (${job.title}, ${job.department}, ${job.description}, ${job.qualification}, ${job.vacancies}, ${job.postedDate}, ${job.lastDate}, ${job.applyLink}, 'active')
                    RETURNING *;
                `;
                newJobs.push(formatJob(result.rows[0]));
            }
            return NextResponse.json({ count: newJobs.length, newJobs });
        }
        
        // Handle single job creation
        const { title, department, description, qualification, vacancies, postedDate, lastDate, applyLink, status } = body;
        const result = await client.sql`
            INSERT INTO jobs (title, department, description, qualification, vacancies, posted_date, last_date, apply_link, status)
            VALUES (${title}, ${department}, ${description}, ${qualification}, ${vacancies}, ${postedDate}, ${lastDate}, ${applyLink}, ${status})
            RETURNING *;
        `;
        return NextResponse.json(formatJob(result.rows[0]));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error creating job' }, { status: 500 });
    } finally {
        client.release();
    }
}

// PUT - Update an existing job
export async function PUT(request: NextRequest) {
    const client = await db.connect();
    const id = request.nextUrl.searchParams.get('id');
    if (!id) {
        return NextResponse.json({ message: 'Job ID is required' }, { status: 400 });
    }
    try {
        const { title, department, description, qualification, vacancies, postedDate, lastDate, applyLink, status } = await request.json();
        const result = await client.sql`
            UPDATE jobs
            SET title = ${title}, department = ${department}, description = ${description}, qualification = ${qualification}, vacancies = ${vacancies}, posted_date = ${postedDate}, last_date = ${lastDate}, apply_link = ${applyLink}, status = ${status}
            WHERE id = ${id}
            RETURNING *;
        `;
        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Job not found' }, { status: 404 });
        }
        return NextResponse.json(formatJob(result.rows[0]));
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error updating job' }, { status: 500 });
    } finally {
        client.release();
    }
}

// DELETE - Delete a job or multiple jobs
export async function DELETE(request: NextRequest) {
    const client = await db.connect();
    try {
        const id = request.nextUrl.searchParams.get('id');
        if (id) {
            // Single delete
            await client.sql`DELETE FROM jobs WHERE id = ${id};`;
            return NextResponse.json({ message: 'Job deleted successfully' });
        }

        const { ids } = await request.json();
        if (ids && Array.isArray(ids)) {
            // Bulk delete
            await client.sql`DELETE FROM jobs WHERE id = ANY(${ids});`;
            return NextResponse.json({ message: 'Jobs deleted successfully' });
        }
        
        return NextResponse.json({ message: 'Job ID or IDs are required' }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error deleting job(s)' }, { status: 500 });
    } finally {
        client.release();
    }
}