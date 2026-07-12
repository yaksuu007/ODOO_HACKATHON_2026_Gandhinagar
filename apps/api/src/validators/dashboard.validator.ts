import { z } from 'zod';

/**
 * Dashboard Query Validators
 */
export const dashboardStatsQuerySchema = z.object({
  organizationId: z.string().optional(),
});

export const dashboardUtilizationQuerySchema = z.object({
  organizationId: z.string().optional(),
  days: z.string().optional().transform(val => val ? parseInt(val) : 7),
});
