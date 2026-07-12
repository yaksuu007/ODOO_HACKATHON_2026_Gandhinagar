import { Hono } from 'hono';
import { AuthController } from '../controllers/auth.controller';
import { validationMiddleware } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { authRateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { authValidators } from '../validators/auth.validator';

const authRoutes = new Hono();

/**
 * POST /api/auth/login
 * Login user
 */
authRoutes.post(
  '/login',
  authRateLimitMiddleware,
  validationMiddleware(authValidators.login),
  AuthController.login
);

/**
 * POST /api/auth/register
 * Register new user
 */
authRoutes.post(
  '/register',
  authRateLimitMiddleware,
  validationMiddleware(authValidators.register),
  AuthController.register
);

/**
 * POST /api/auth/logout
 * Logout user
 */
authRoutes.post('/logout', authMiddleware, AuthController.logout);

/**
 * POST /api/auth/logout-all
 * Logout from all devices
 */
authRoutes.post('/logout-all', authMiddleware, AuthController.logoutAll);

/**
 * GET /api/auth/me
 * Get current user info
 */
authRoutes.get('/me', authMiddleware, AuthController.me);

export default authRoutes;
