import { Context } from 'hono';
import { allocationsService } from '../services/allocations.service';

export class AllocationsController {
  /**
   * Get all allocations
   */
  async getAll(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const allocations = await allocationsService.getAll(organizationId);

      return c.json({
        success: true,
        data: allocations,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new allocation
   */
  async create(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const userId = c.get('userId');
      const body = c.get('validatedData') || await c.req.json();

      const allocation = await allocationsService.create(body, organizationId, userId);

      return c.json({
        success: true,
        data: allocation,
      }, 201);
    } catch (error) {
      throw error;
    }
  }
}

export const allocationsController = new AllocationsController();
