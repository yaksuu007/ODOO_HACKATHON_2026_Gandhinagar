import { Hono } from 'hono';
import { activityController } from '../controllers/activity.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const activityRoutes = new Hono();

// Apply authentication middleware to all activity routes
activityRoutes.use('*', authMiddleware);

/**
 * GET /activity
 * Get activity logs
 */
activityRoutes.get('/', activityController.getActivityLogs);

export { activityRoutes };
