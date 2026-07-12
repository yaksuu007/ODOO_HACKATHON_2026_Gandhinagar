import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';
import { AuthenticationError, TokenExpiredError } from '../errors/app.error';
import prisma from '../database/client';

/**
 * Extended Context with user information
 */
export interface AuthContext {
  userId: string;
  organizationId: string;
  user: any;
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user information to context
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationError('No token provided');
  }

  const token = authHeader.substring(7);
  const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';

  try {
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Verify user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organization: true },
    });

    if (!user) {
      throw new AuthenticationError('User not found');
    }

    if (!user.isActive) {
      throw new AuthenticationError('User account is inactive');
    }

    // Attach user info to context
    c.set('userId', user.id);
    c.set('organizationId', user.organizationId);
    c.set('user', user);

    await next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenExpiredError();
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token');
    }
    throw error;
  }
}

/**
 * Optional Authentication Middleware
 * Attaches user info if token is present, but doesn't require it
 */
export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { organization: true },
      });

      if (user && user.isActive) {
        c.set('userId', user.id);
        c.set('organizationId', user.organizationId);
        c.set('user', user);
      }
    } catch (error) {
      // Ignore errors for optional auth
    }
  }

  await next();
}
