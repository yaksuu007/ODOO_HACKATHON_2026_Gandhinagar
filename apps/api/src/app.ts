import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env file BEFORE any other imports
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { serve } from '@hono/node-server';
import app from './routes';
import { errorHandler } from './middleware/error-handler.middleware';
import { loggingMiddleware } from './middleware/logging.middleware';
import { initializeDatabase } from './database/connection';
import logger from './logs/logger';

// Apply global middleware
app.use('*', loggingMiddleware);
app.use('*', errorHandler);

// Start server
const port = parseInt(process.env.PORT || '3001');

async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    logger.info({ port }, 'Starting AssetFlow API server...');
    
    serve({
      fetch: app.fetch,
      port,
    });
    
    logger.info({ port }, 'AssetFlow API server started successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

startServer();
