import { Hono } from 'hono';
import { maintenanceController } from '../controllers/maintenance.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const maintenanceRoutes = new Hono();

// Apply authentication middleware to all maintenance routes
maintenanceRoutes.use('*', authMiddleware);

/**
 * GET /maintenance
 * Get all maintenance records
 */
maintenanceRoutes.get('/', maintenanceController.getAll);

/**
 * POST /maintenance
 * Create new maintenance ticket
 */
maintenanceRoutes.post('/', maintenanceController.create);

/**
 * PUT /maintenance/:id
 * Update maintenance ticket status
 */
maintenanceRoutes.put('/:id', maintenanceController.updateStatus);

export { maintenanceRoutes };
