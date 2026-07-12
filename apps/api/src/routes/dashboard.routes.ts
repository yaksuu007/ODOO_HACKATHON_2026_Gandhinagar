import { Hono } from 'hono';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const dashboardRoutes = new Hono();

// Apply authentication middleware to all dashboard routes
dashboardRoutes.use('*', authMiddleware);

/**
 * GET /dashboard/stats
 * Get dashboard statistics
 */
dashboardRoutes.get('/stats', dashboardController.getStats);

/**
 * GET /dashboard/utilization
 * Get resource utilization data
 */
dashboardRoutes.get('/utilization', dashboardController.getUtilization);

export { dashboardRoutes };
