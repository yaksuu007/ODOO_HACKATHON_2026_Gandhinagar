import { Hono } from 'hono';
import { assetsController } from '../controllers/assets.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const assetsRoutes = new Hono();

// Apply authentication middleware to all assets routes
assetsRoutes.use('*', authMiddleware);

/**
 * GET /assets
 * Get all assets
 */
assetsRoutes.get('/', assetsController.getAll);

/**
 * POST /assets
 * Create new asset
 */
assetsRoutes.post('/', assetsController.create);

/**
 * DELETE /assets/:id
 * Delete asset
 */
assetsRoutes.delete('/:id', assetsController.delete);

export { assetsRoutes };
