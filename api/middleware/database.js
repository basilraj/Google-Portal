

import { getPgConnection } from '../../lib/postgresql.js';

export const attachDb = async (req, res, next) => {
    try {
        // Attach the connection pool to the request object
        req.db = await getPgConnection();
        next();
    } catch (error) {
        // Pass database connection errors to the central error handler
        next(error);
    }
};