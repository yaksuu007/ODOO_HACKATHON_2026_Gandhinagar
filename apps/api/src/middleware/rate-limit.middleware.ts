import { Context, Next } from 'hono';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { RateLimitError } from '../errors/app.error';

/**
 * Rate Limiter Configuration
 */
const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

const authRateLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
});

/**
 * Rate Limit Middleware
 * Limits request rate to prevent abuse
 */
export async function rateLimitMiddleware(c: Context, next: Next) {
  const key = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

  try {
    await rateLimiter.consume(key);
    await next();
  } catch (error: any) {
    throw new RateLimitError({
      remaining: error.remainingPoints,
      reset: new Date(Date.now() + error.msBeforeNext),
    });
  }
}

/**
 * Strict Rate Limit Middleware for Auth Endpoints
 */
export async function authRateLimitMiddleware(c: Context, next: Next) {
  const key = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';

  try {
    await authRateLimiter.consume(key);
    await next();
  } catch (error: any) {
    throw new RateLimitError({
      remaining: error.remainingPoints,
      reset: new Date(Date.now() + error.msBeforeNext),
    });
  }
}
