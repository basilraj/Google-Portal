import 'dotenv/config'; // Ensure dotenv is loaded first
import express from 'express';
import { sessionMiddleware } from '../lib/session.js';
import { attachDb } from './middleware/database.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import the master API router
import apiRouter from './routes/index.js';

const app = express();

// --- Global Middleware ---
app.use(express.json({ limit: '10mb' }));
app.use(sessionMiddleware);
app.use(attachDb);

// --- Mount Master API Router ---
// All API routes are now handled by this single router.
// FIX: Mount apiRouter at '/api'. Vercel's rewrite in vercel.json sends requests with the /api prefix.
app.use('/api', apiRouter); 

console.log('Express app initialized and API router mounted at /api.'); // Diagnostic log

// --- Centralized Error Handler ---
app.use(errorHandler);

export default app;