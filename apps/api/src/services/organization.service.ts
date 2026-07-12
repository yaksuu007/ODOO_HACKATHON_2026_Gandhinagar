import { organizationRepository } from '../repositories/organization.repository';

export class OrganizationService {
  /**
   * Get organization departments
   */
  async getDepartments(organizationId?: string) {
    return await organizationRepository.getDepartments(organizationId);
  }

  /**
   * Create new department
   */
  async createDepartment(data: any, organizationId?: string) {
    return await organizationRepository.createDepartment(data, organizationId);
  }

  /**
   * Get organization metrics
   */
  async getMetrics(organizationId?: string) {
    return await organizationRepository.getMetrics(organizationId);
  }
}

export const organizationService = new OrganizationService();
