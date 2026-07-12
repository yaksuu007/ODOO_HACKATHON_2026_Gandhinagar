import prisma from '../database/client';
import { UtilizationDataPoint } from '../dtos/dashboard.dto';

export class DashboardRepository {
  /**
   * Get dashboard statistics
   */
  async getStats(organizationId?: string) {
    const where = organizationId ? { organizationId } : {};

    const [
      totalAssets,
      pendingMaintenance,
      criticalMaintenance,
      activeAudits,
      totalUsers,
    ] = await Promise.all([
      prisma.asset.count({ where }),
      prisma.maintenanceRequest.count({
        where: {
          ...where,
          status: 'pending',
        },
      }),
      prisma.maintenanceRequest.count({
        where: {
          ...where,
          status: 'pending',
          priority: 'critical',
        },
      }),
      prisma.auditCycle.count({
        where: {
          ...where,
          status: 'in_progress',
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Calculate resource capacity based on users vs some baseline
    const resourceCapacity = totalUsers > 0 ? Math.min(100, Math.round((totalUsers / 100) * 100)) : 0;

    return {
      totalAssets,
      resourceCapacity,
      pendingMaintenance,
      criticalMaintenance,
      activeAudits,
    };
  }

  /**
   * Get utilization data for the chart
   */
  async getUtilization(days: number = 7, _organizationId?: string) {
    const data: UtilizationDataPoint[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Generate mock utilization data based on day
      // In a real implementation, this would query actual allocation/usage data
      const baseValue = 60 + Math.random() * 30;
      const value = Math.round(baseValue);

      data.push({
        day: dayName,
        value,
      });
    }

    return data;
  }
}

export const dashboardRepository = new DashboardRepository();
