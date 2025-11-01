
import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

const parseJsonField = (jsonString) => {
    if (!jsonString) return [];
    // PostgreSQL's `pg` driver often parses JSONB columns directly into JS objects.
    // So, we only parse if it's still a string, implying a TEXT column or driver setting.
    if (typeof jsonString === 'string') {
        try { return JSON.parse(jsonString); } catch (e) { return []; }
    }
    return jsonString; // Assume it's already an object if not a string
};

const validateJob = (job) => {
    const requiredFields = ['title', 'department', 'category', 'description', 'qualification', 'vacancies', 'postedDate', 'lastDate', 'applyLink', 'status']; // Added status to validation
    for (const field of requiredFields) {
        if (!job.hasOwnProperty(field) || !job[field]) {
            return `Missing required field: ${field}`;
        }
    }
    if (isNaN(new Date(job.postedDate).getTime()) || isNaN(new Date(job.lastDate).getTime())) {
        return 'Invalid date format for postedDate or lastDate. Use YYYY-MM-DD.';
    }
    // Validate status field
    if (!['active', 'closing-soon', 'expired'].includes(job.status)) {
        return 'Invalid status value. Must be "active", "closing-soon", or "expired".';
    }
    return null;
};

router.post('/', async (req, res, next) => {
    try {
        const connection = req.db;
        if (Array.isArray(req.body)) {
            // Bulk Insert for PostgreSQL requires building a dynamic query
            const jobsToInsert = req.body;
            if (jobsToInsert.length === 0) return res.status(201).json([]);

            for (const [index, job] of jobsToInsert.entries()) {
                const validationError = validateJob(job);
                if (validationError) {
                    const err = new Error(`Validation Error on item ${index + 1}: ${validationError}`);
                    err.statusCode = 400;
                    throw err;
                }
            }

            const paramPlaceholders = [];
            const values = [];
            const newJobIds = [];

            jobsToInsert.forEach((job, index) => {
                const id = uuidv4();
                newJobIds.push(id);
                const baseIndex = index * 14; // 14 columns per row
                paramPlaceholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, $${baseIndex + 10}, $${baseIndex + 11}, $${baseIndex + 12}, $${baseIndex + 13}, $${baseIndex + 14})`);
                values.push(
                    id, job.title, job.department, job.category, job.description, job.qualification,
                    job.vacancies, new Date(job.postedDate), new Date(job.lastDate), job.applyLink,
                    job.status || 'active', // Default to active if not provided in bulk
                    new Date(), JSON.stringify(job.affiliateCourses || []), JSON.stringify(job.affiliateBooks || [])
                );
            });

            const queryText = `INSERT INTO Job (id, title, department, category, description, qualification, vacancies, postedDate, lastDate, applyLink, status, createdAt, "affiliateCoursesJson", "affiliateBooksJson") VALUES ${paramPlaceholders.join(', ')}`;
            const result = await connection.query(queryText, values);

            await connection.query('INSERT INTO ActivityLog (action, details) VALUES ($1, $2)', ['Bulk Job Upload', `${result.rowCount} jobs added.`]);
            
            const newJobsResult = await connection.query(`SELECT * FROM Job WHERE id IN (${newJobIds.map((_, i) => `$${i + 1}`).join(', ')})`, newJobIds);
            const parsedNewJobs = newJobsResult.rows.map(job => ({
                ...job,
                affiliateCourses: parseJsonField(job.affiliateCoursesJson),
                affiliateBooks: parseJsonField(job.affiliateBooksJson)
            }));
            return res.status(201).json(parsedNewJobs);

        } else {
            // Single Job Insert
            const { affiliateCourses, affiliateBooks, ...jobData } = req.body;
            const validationError = validateJob(jobData);
            if (validationError) {
                const err = new Error(`Validation Error: ${validationError}`);
                err.statusCode = 400;
                throw err;
            }
            const id = uuidv4();
            const result = await connection.query(`INSERT INTO Job (id, title, department, category, description, qualification, vacancies, postedDate, lastDate, applyLink, status, createdAt, "affiliateCoursesJson", "affiliateBooksJson") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
                [id, jobData.title, jobData.department, jobData.category, jobData.description, jobData.qualification, jobData.vacancies, new Date(jobData.postedDate), new Date(jobData.lastDate), jobData.applyLink, jobData.status, new Date(), JSON.stringify(affiliateCourses || []), JSON.stringify(affiliateBooks || [])]
            );
            
            const newJobResult = await connection.query(`SELECT * FROM Job WHERE id = $1`, [id]);
            const newJob = { ...newJobResult.rows[0], affiliateCourses: parseJsonField(newJobResult.rows[0].affiliateCoursesJson), affiliateBooks: parseJsonField(newJobResult.rows[0].affiliateBooksJson) };
            await connection.query('INSERT INTO ActivityLog (action, details) VALUES ($1, $2)', ['Job Created', `New job added: ${newJob.title}`]);
            return res.status(201).json(newJob);
        }
    } catch (error) {
        next(error);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const { id, affiliateCourses, affiliateBooks, createdAt, ...updateData } = req.body;
        if (!id) {
            const err = new Error('Job ID is required for updates.');
            err.statusCode = 400;
            throw err;
        }
        const validationError = validateJob(updateData);
        if (validationError) {
            const err = new Error(`Validation Error: ${validationError}`);
            err.statusCode = 400;
            throw err;
        }
        const updateResult = await req.db.query(`UPDATE Job SET title = $1, department = $2, category = $3, description = $4, qualification = $5, vacancies = $6, postedDate = $7, lastDate = $8, applyLink = $9, status = $10, "affiliateCoursesJson" = $11, "affiliateBooksJson" = $12 WHERE id = $13`,
            [updateData.title, updateData.department, updateData.category, updateData.description, updateData.qualification, updateData.vacancies, new Date(updateData.postedDate), new Date(updateData.lastDate), updateData.applyLink, updateData.status, JSON.stringify(affiliateCourses || []), JSON.stringify(affiliateBooks || []), id]
        );
        if (updateResult.rowCount === 0) return res.status(404).json({ message: `Job with ID ${id} not found.` });
        
        const updatedJobResult = await req.db.query(`SELECT * FROM Job WHERE id = $1`, [id]);
        const updatedJob = { ...updatedJobResult.rows[0], affiliateCourses: parseJsonField(updatedJobResult.rows[0].affiliateCoursesJson), affiliateBooks: parseJsonField(updatedJobResult.rows[0].affiliateBooksJson) };
        await req.db.query('INSERT INTO ActivityLog (action, details) VALUES ($1, $2)', ['Job Updated', `Job updated: ${updatedJob.title}`]);
        res.status(200).json(updatedJob);
    } catch (error) {
        next(error);
    }
});

router.delete('/', async (req, res, next) => {
    try {
        const { ids, id } = req.body;
        if (!ids && !id) {
            const err = new Error('An ID or an array of IDs is required for deletion.');
            err.statusCode = 400;
            throw err;
        }
        if (ids) {
            // For deleting multiple, use the ANY operator or unnest an array
            const deleteResult = await req.db.query(`DELETE FROM Job WHERE id = ANY($1)`, [ids]);
            await req.db.query('INSERT INTO ActivityLog (action, details) VALUES ($1, $2)', ['Bulk Job Deletion', `${deleteResult.rowCount} jobs deleted.`]);
        } else {
            const deleteResult = await req.db.query(`DELETE FROM Job WHERE id = $1`, [id]);
            if (deleteResult.rowCount === 0) return res.status(404).json({ message: `Job with ID ${id} not found.` });
            await req.db.query('INSERT INTO ActivityLog (action, details) VALUES ($1, $2)', ['Job Deleted', `Job with id ${id} deleted.`]);
        }
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export default router;