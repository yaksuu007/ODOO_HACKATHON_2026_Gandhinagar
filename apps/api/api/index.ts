import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

import app from '../src/routes';
import { errorHandler } from '../src/middleware/error-handler.middleware';
import { loggingMiddleware } from '../src/middleware/logging.middleware';
import { initializeDatabase } from '../src/database/connection';
import logger from '../src/logs/logger';

// Apply middleware
app.use('*', loggingMiddleware);
app.use('*', errorHandler);

// Initialize database connection
let dbInitialized = false;

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase();
    dbInitialized = true;
  }
}

// Export for Vercel serverless function
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);

// For Vercel Edge Runtime (optional, if needed)
export default handle(app);
