import { Context } from 'hono';
import { assetsService } from '../services/assets.service';

export class AssetsController {
  /**
   * Get all assets
   */
  async getAll(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const assets = await assetsService.getAll(organizationId);

      return c.json({
        success: true,
        data: assets,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new asset
   */
  async create(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const body = c.get('validatedData') || await c.req.json();

      const asset = await assetsService.create(body, organizationId);

      return c.json({
        success: true,
        data: asset,
      }, 201);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete asset
   */
  async delete(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const assetTag = c.req.param('id');

      await assetsService.delete(assetTag, organizationId);

      return c.json({
        success: true,
        message: 'Asset deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  }
}

export const assetsController = new AssetsController();
