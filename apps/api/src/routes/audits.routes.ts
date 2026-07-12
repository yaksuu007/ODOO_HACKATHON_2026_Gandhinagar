import { Hono } from 'hono';
import { auditsController } from '../controllers/audits.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const auditsRoutes = new Hono();

// Apply authentication middleware to all audits routes
auditsRoutes.use('*', authMiddleware);

/**
 * GET /audits
 * Get all audit records
 */
auditsRoutes.get('/', auditsController.getAll);

/**
 * POST /audits
 * Create new audit
 */
auditsRoutes.post('/', auditsController.create);

export { auditsRoutes };
