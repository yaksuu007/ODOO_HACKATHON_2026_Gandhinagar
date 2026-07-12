import { Context } from 'hono';
import { activityService } from '../services/activity.service';

export class ActivityController {
  /**
   * Get activity logs
   */
  async getActivityLogs(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      
      const query = c.req.query();
      const page = query.page ? parseInt(query.page) : 1;
      const limit = query.limit ? parseInt(query.limit) : 20;

      const result = await activityService.getActivityLogs({ page, limit, entityType: query.entityType, action: query.action, userId: query.userId }, organizationId);

      return c.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const activityController = new ActivityController();
