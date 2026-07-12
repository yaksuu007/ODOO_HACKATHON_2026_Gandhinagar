import { assetsRepository } from '../repositories/assets.repository';

export class AssetsService {
  /**
   * Get all assets
   */
  async getAll(organizationId?: string) {
    return await assetsRepository.getAll(organizationId);
  }

  /**
   * Create new asset
   */
  async create(data: any, organizationId?: string) {
    return await assetsRepository.create(data, organizationId);
  }

  /**
   * Delete asset
   */
  async delete(assetTag: string, organizationId?: string) {
    return await assetsRepository.delete(assetTag, organizationId);
  }
}

export const assetsService = new AssetsService();
