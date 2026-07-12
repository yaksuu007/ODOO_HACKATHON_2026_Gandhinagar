import { Context, Next } from 'hono';
import logger from '../logs/logger';

/**
 * Logging Middleware
 * Logs incoming requests and outgoing responses
 */
export async function loggingMiddleware(c: Context, next: Next) {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;
  const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
  const userAgent = c.req.header('user-agent') || 'unknown';

  logger.info({ method, path, ip, userAgent }, 'Incoming request');

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  logger.info({ method, path, status, duration }, 'Request completed');
}
