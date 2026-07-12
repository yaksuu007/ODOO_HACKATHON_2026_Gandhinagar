import { Hono } from 'hono';
import { allocationsController } from '../controllers/allocations.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const allocationsRoutes = new Hono();

// Apply authentication middleware to all allocations routes
allocationsRoutes.use('*', authMiddleware);

/**
 * GET /allocations
 * Get all allocations
 */
allocationsRoutes.get('/', allocationsController.getAll);

/**
 * POST /allocations
 * Create new allocation
 */
allocationsRoutes.post('/', allocationsController.create);

export { allocationsRoutes };
