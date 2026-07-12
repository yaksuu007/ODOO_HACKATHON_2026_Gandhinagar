import { Hono } from 'hono';
import { cors } from 'hono/cors';
import authRoutes from './auth.routes';
import { dashboardRoutes } from './dashboard.routes';
import { activityRoutes } from './activity.routes';
import { organizationRoutes } from './organization.routes';
import { assetsRoutes } from './assets.routes';
import { allocationsRoutes } from './allocations.routes';
import { resourcesRoutes } from './resources.routes';
import { maintenanceRoutes } from './maintenance.routes';
import { auditsRoutes } from './audits.routes';

const app = new Hono();

/**
 * CORS configuration
 */
app.use('/*', cors({
  origin: (origin) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    if (!origin) return allowedOrigins[0];
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

/**
 * Health check endpoint
 */
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'AssetFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 */
app.route('/api/auth', authRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/activity', activityRoutes);
app.route('/api/organization', organizationRoutes);
app.route('/api/assets', assetsRoutes);
app.route('/api/allocations', allocationsRoutes);
app.route('/api/resources', resourcesRoutes);
app.route('/api/maintenance', maintenanceRoutes);
app.route('/api/audits', auditsRoutes);

/**
 * 404 handler
 */
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  }, 404);
});

export default app;
