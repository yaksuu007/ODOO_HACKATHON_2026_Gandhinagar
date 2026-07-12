import { Context } from 'hono';
import { maintenanceService } from '../services/maintenance.service';

export class MaintenanceController {
  /**
   * Get all maintenance records
   */
  async getAll(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const maintenance = await maintenanceService.getAll(organizationId);

      return c.json({
        success: true,
        data: maintenance,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new maintenance ticket
   */
  async create(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const userId = c.get('userId');
      const body = c.get('validatedData') || await c.req.json();

      const maintenance = await maintenanceService.create(body, organizationId, userId);

      return c.json({
        success: true,
        data: maintenance,
      }, 201);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update maintenance ticket status
   */
  async updateStatus(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const userId = c.get('userId');
      const id = c.req.param('id');
      const ticketStatus = c.req.query('ticket_status');

      if (!ticketStatus) {
        return c.json({ success: false, error: 'Ticket status is required' }, 400);
      }

      const maintenance = await maintenanceService.updateStatus(id, ticketStatus, organizationId, userId);

      return c.json({
        success: true,
        data: maintenance,
      });
    } catch (error) {
      throw error;
    }
  }
}

export const maintenanceController = new MaintenanceController();
