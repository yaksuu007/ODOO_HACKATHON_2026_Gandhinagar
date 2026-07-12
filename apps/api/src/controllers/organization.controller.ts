import { Context } from 'hono';
import { organizationService } from '../services/organization.service';

export class OrganizationController {
  /**
   * Get organization departments
   */
  async getDepartments(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const departments = await organizationService.getDepartments(organizationId);

      return c.json({
        success: true,
        data: departments,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new department
   */
  async createDepartment(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const body = c.get('validatedData') || await c.req.json();

      const department = await organizationService.createDepartment(body, organizationId);

      return c.json({
        success: true,
        data: department,
      }, 201);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get organization metrics
   */
  async getMetrics(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const metrics = await organizationService.getMetrics(organizationId);

      return c.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const organizationController = new OrganizationController();
