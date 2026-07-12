import { maintenanceRepository } from '../repositories/maintenance.repository';

export class MaintenanceService {
  /**
   * Get all maintenance records
   */
  async getAll(organizationId?: string) {
    return await maintenanceRepository.getAll(organizationId);
  }

  /**
   * Create new maintenance ticket
   */
  async create(data: any, organizationId?: string, userId?: string) {
    return await maintenanceRepository.create(data, organizationId, userId);
  }

  /**
   * Update maintenance ticket status
   */
  async updateStatus(id: string, status: string, organizationId?: string, userId?: string) {
    return await maintenanceRepository.updateStatus(id, status, organizationId, userId);
  }
}

export const maintenanceService = new MaintenanceService();
