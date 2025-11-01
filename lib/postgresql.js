// lib/postgresql.js
import pg from 'pg';
import process from 'process';

let pool;

/**
 * Returns a promise that resolves to a PostgreSQL connection pool.
 * Initializes the pool if it doesn't already exist.
 * Throws an error if DATABASE_URL is not set or if the initial connection fails.
 */
export async function getPgConnection() {
    if (!pool) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL environment variable is not set.');
        }

        // ✅ Neon + Vercel-safe configuration
        const config = {
            connectionString: databaseUrl,
            ssl: {
                rejectUnauthorized: false, // Required for Neon (cloud Postgres)
            },
            // Optional tuning:
            // max: 10,
            // idleTimeoutMillis: 30000,
            // connectionTimeoutMillis: 5000,
        };

        pool = new pg.Pool(config);

        try {
            // Test the connection immediately
            await pool.query('SELECT 1 + 1 AS solution');
            console.log('✅ PostgreSQL connection pool established successfully.');
        } catch (error) {
            console.error('❌ Failed to establish PostgreSQL connection:', error);
            pool = undefined;
            throw new Error(`Database connection failed: ${error.message}`);
        }
    }

    return pool;
}
