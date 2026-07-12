import { Context } from 'hono';
import { auditsService } from '../services/audits.service';

export class AuditsController {
  /**
   * Get all audit records
   */
  async getAll(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const audits = await auditsService.getAll(organizationId);

      return c.json({
        success: true,
        data: audits,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new audit
   */
  async create(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const body = c.get('validatedData') || await c.req.json();

      const audit = await auditsService.create(body, organizationId);

      return c.json({
        success: true,
        data: audit,
      }, 201);
    } catch (error) {
      throw error;
    }
  }
}

export const auditsController = new AuditsController();
