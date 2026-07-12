import { cors } from 'hono/cors';

/**
 * CORS Middleware
 * Enables Cross-Origin Resource Sharing
 */
export const corsMiddleware = cors({
  origin: (origin) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
    if (!origin) return allowedOrigins[0];
    return allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
});
