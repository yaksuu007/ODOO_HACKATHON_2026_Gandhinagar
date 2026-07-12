import { z } from 'zod';

/**
 * Activity Query Validators
 */
export const activityListQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  entityType: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
});
