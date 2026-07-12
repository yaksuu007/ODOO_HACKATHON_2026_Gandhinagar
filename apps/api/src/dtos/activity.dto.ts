import { z } from 'zod';

/**
 * Activity Log Response DTO
 */
export interface ActivityLogResponse {
  id: string;
  userId: string;
  username: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

/**
 * Activity List Query DTO
 */
export const activityListQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  entityType: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
});

export type ActivityListQuery = z.infer<typeof activityListQuerySchema>;
