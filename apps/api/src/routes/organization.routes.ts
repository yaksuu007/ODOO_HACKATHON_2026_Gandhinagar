import { Hono } from 'hono';
import { organizationController } from '../controllers/organization.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const organizationRoutes = new Hono();

// Apply authentication middleware to all organization routes
organizationRoutes.use('*', authMiddleware);

/**
 * GET /organization/departments
 * Get organization departments
 */
organizationRoutes.get('/departments', organizationController.getDepartments);

/**
 * POST /organization/departments
 * Create new department
 */
organizationRoutes.post('/departments', organizationController.createDepartment);

/**
 * GET /organization/metrics
 * Get organization metrics
 */
organizationRoutes.get('/metrics', organizationController.getMetrics);

export { organizationRoutes };
