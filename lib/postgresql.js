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

        // The 'pg' library can often use the full connection string directly.
        // It also accepts an object for more granular control.
        const config = {
            connectionString: databaseUrl,
            // Add other pg pool configurations if necessary, e.g.:
            // max: 10, // set pool max size to 10
            // idleTimeoutMillis: 30000, // close idle clients after 30 seconds
            // connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
        };

        pool = new pg.Pool(config);

        // Test the connection immediately to ensure the configuration is valid
        // and the database is reachable on startup. This is a "fail-fast" approach.
        try {
            await pool.query('SELECT 1 + 1 AS solution'); // A simple query to test connection
        } catch (error) {
            // Log the detailed error for server-side debugging
            console.error('Failed to establish initial PostgreSQL connection from pool:', error);
            // Invalidate the pool so the next attempt will try to recreate it
            pool = undefined;
            // Re-throw the error to be caught by the application's startup logic or the first request handler
            throw new Error(`Database connection failed: ${error.message}`);
        }
    }
    return pool;
}