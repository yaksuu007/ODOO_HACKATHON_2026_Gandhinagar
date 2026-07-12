import { resourcesRepository } from '../repositories/resources.repository';

export class ResourcesService {
  /**
   * Get all resources
   */
  async getAll(organizationId?: string) {
    return await resourcesRepository.getAll(organizationId);
  }

  /**
   * Get resource bookings
   */
  async getBookings(organizationId?: string) {
    return await resourcesRepository.getBookings(organizationId);
  }

  /**
   * Create new resource booking
   */
  async createBooking(data: any, organizationId?: string, userId?: string) {
    return await resourcesRepository.createBooking(data, organizationId, userId);
  }
}

export const resourcesService = new ResourcesService();
