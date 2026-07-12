import { auditsRepository } from '../repositories/audits.repository';

export class AuditsService {
  /**
   * Get all audit records
   */
  async getAll(organizationId?: string) {
    return await auditsRepository.getAll(organizationId);
  }

  /**
   * Create new audit
   */
  async create(data: any, organizationId?: string) {
    return await auditsRepository.create(data, organizationId);
  }
}

export const auditsService = new AuditsService();
