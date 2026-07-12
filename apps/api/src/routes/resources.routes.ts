import { Hono } from 'hono';
import { resourcesController } from '../controllers/resources.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const resourcesRoutes = new Hono();

// Apply authentication middleware to all resources routes
resourcesRoutes.use('*', authMiddleware);

/**
 * GET /resources
 * Get all resources
 */
resourcesRoutes.get('/', resourcesController.getAll);

/**
 * GET /resources/bookings
 * Get resource bookings
 */
resourcesRoutes.get('/bookings', resourcesController.getBookings);

/**
 * POST /resources/bookings
 * Create new resource booking
 */
resourcesRoutes.post('/bookings', resourcesController.createBooking);

export { resourcesRoutes };
