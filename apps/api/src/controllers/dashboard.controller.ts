import { Context } from 'hono';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  /**
   * Get dashboard statistics
   */
  async getStats(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const stats = await dashboardService.getStats(organizationId);

      return c.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get utilization data
   */
  async getUtilization(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      
      const query = c.req.query();
      const days = query.days ? parseInt(query.days) : 7;

      const utilization = await dashboardService.getUtilization(days, organizationId);

      return c.json({
        success: true,
        data: utilization.data,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const dashboardController = new DashboardController();
