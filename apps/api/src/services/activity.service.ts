import { activityRepository } from '../repositories/activity.repository';
import { ActivityListQuery } from '../dtos/activity.dto';
import logger from '../logs/logger';

export class ActivityService {
  /**
   * Get activity logs
   */
  async getActivityLogs(query: ActivityListQuery, organizationId?: string) {
    try {
      logger.info({ message: 'Fetching activity logs', query, organizationId });
      
      const result = await activityRepository.getActivityLogs({
        ...query,
        organizationId,
      });
      
      logger.info({ message: 'Activity logs fetched successfully', count: result.data.length });
      
      return result;
    } catch (error) {
      logger.error({ message: 'Failed to fetch activity logs', error });
      throw error;
    }
  }
}

export const activityService = new ActivityService();
