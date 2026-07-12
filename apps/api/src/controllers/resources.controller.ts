import { Context } from 'hono';
import { resourcesService } from '../services/resources.service';

export class ResourcesController {
  /**
   * Get all resources
   */
  async getAll(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const resources = await resourcesService.getAll(organizationId);

      return c.json({
        success: true,
        data: resources,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get resource bookings
   */
  async getBookings(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;

      const bookings = await resourcesService.getBookings(organizationId);

      return c.json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new resource booking
   */
  async createBooking(c: Context) {
    try {
      const user = c.get('user');
      const organizationId = user?.organizationId;
      const userId = c.get('userId');
      const body = c.get('validatedData') || await c.req.json();

      const booking = await resourcesService.createBooking(body, organizationId, userId);

      return c.json({
        success: true,
        data: booking,
      }, 201);
    } catch (error) {
      throw error;
    }
  }
}

export const resourcesController = new ResourcesController();
