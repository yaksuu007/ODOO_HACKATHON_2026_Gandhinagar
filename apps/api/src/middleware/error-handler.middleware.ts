import { Context, Next } from 'hono';
import { AppError } from '../errors/app.error';
import logger from '../logs/logger';

/**
 * Error Handler Middleware
 * Catches and formats errors consistently across the application
 */
export async function errorHandler(c: Context, next: Next) {
  try {
    await next();
  } catch (error) {
    logger.error({ error }, 'Unhandled error occurred');

    if (error instanceof AppError) {
      return c.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
            details: error.details,
          },
        },
        error.statusCode as any
      );
    }

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as any;
      if (prismaError.code === 'P2002') {
        return c.json(
          {
            success: false,
            error: {
              code: 'RESOURCE_ALREADY_EXISTS',
              message: 'A record with this value already exists',
            },
          },
          409 as any
        );
      }
      if (prismaError.code === 'P2025') {
        return c.json(
          {
            success: false,
            error: {
              code: 'RESOURCE_NOT_FOUND',
              message: 'Record not found',
            },
          },
          404 as any
        );
      }
    }

    // Generic error
    return c.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      500 as any
    );
  }
  return;
}
