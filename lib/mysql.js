import mysql from 'mysql2/promise';
import process from 'process';

let pool;

/**
 * Returns a promise that resolves to a MySQL connection pool.
 * Initializes the pool if it doesn't already exist.
 * Throws an error if DATABASE_URL is not set or if the initial connection fails.
 */
export async function getConnection() {
    if (!pool) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL environment variable is not set.');
        }

        const url = new URL(databaseUrl);
        const config = {
            host: url.hostname,
            user: url.username,
            password: url.password,
            database: url.pathname.substring(1), // Remove leading '/'
            port: url.port ? parseInt(url.port, 10) : 3306,
            waitForConnections: true,
            connectionLimit: 10, // Adjust as needed
            queueLimit: 0,
        };

        pool = mysql.createPool(config);

        // Test the connection immediately to ensure the configuration is valid
        // and the database is reachable on startup. This is a "fail-fast" approach.
        let connection;
        try {
            connection = await pool.getConnection(); // Get a single connection to test the pool
        } catch (error) {
            // Log the detailed error for server-side debugging
            console.error('Failed to establish initial MySQL connection from pool:', error);
            // Invalidate the pool so the next attempt will try to recreate it
            pool = undefined; 
            // Re-throw the error to be caught by the application's startup logic or the first request handler
            throw new Error(`Database connection failed: ${error.message}`);
        } finally {
            // Always release the connection back to the pool
            if (connection) connection.release();
        }
    }
    return pool;
}