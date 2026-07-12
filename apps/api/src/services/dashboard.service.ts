import { dashboardRepository } from '../repositories/dashboard.repository';
import { DashboardStatsResponse, DashboardUtilizationResponse } from '../dtos/dashboard.dto';
import logger from '../logs/logger';

export class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getStats(organizationId?: string): Promise<DashboardStatsResponse> {
    try {
      logger.info({ message: 'Fetching dashboard stats', organizationId });
      
      const stats = await dashboardRepository.getStats(organizationId);
      
      logger.info({ message: 'Dashboard stats fetched successfully', stats });
      
      return stats;
    } catch (error) {
      logger.error({ message: 'Failed to fetch dashboard stats', error });
      throw error;
    }
  }

  /**
   * Get utilization data
   */
  async getUtilization(days: number = 7, organizationId?: string): Promise<DashboardUtilizationResponse> {
    try {
      logger.info({ message: 'Fetching utilization data', days, organizationId });
      
      const data = await dashboardRepository.getUtilization(days, organizationId);
      
      logger.info({ message: 'Utilization data fetched successfully', dataPoints: data.length });
      
      return { data };
    } catch (error) {
      logger.error({ message: 'Failed to fetch utilization data', error });
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
