import { Context, Next } from 'hono';
import { z } from 'zod';
import { ValidationError } from '../errors/app.error';

/**
 * Validation Middleware Factory
 * Creates middleware that validates request body against a Zod schema
 */
export function validationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (c: Context, next: Next) => {
    try {
      const body = await c.req.json();
      const validatedData = schema.parse(body);
      c.set('validatedData', validatedData);
      await next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ValidationError('Validation failed', { errors });
      }
      throw error;
    }
  };
}
