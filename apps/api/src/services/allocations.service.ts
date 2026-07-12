import { allocationsRepository } from '../repositories/allocations.repository';

export class AllocationsService {
  /**
   * Get all allocations
   */
  async getAll(organizationId?: string) {
    return await allocationsRepository.getAll(organizationId);
  }

  /**
   * Create new allocation
   */
  async create(data: any, organizationId?: string, userId?: string) {
    return await allocationsRepository.create(data, organizationId, userId);
  }
}

export const allocationsService = new AllocationsService();
