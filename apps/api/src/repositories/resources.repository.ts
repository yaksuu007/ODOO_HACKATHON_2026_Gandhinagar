import prisma from '../database/client';

const DEFAULT_RESOURCES = [
  {
    code: 'CONF-A',
    name: 'Conference Room A',
    type: 'room' as const,
    description: 'Main conference room',
    capacity: 20,
  },
  {
    code: 'CONF-B',
    name: 'Conference Room B',
    type: 'room' as const,
    description: 'Secondary meeting room',
    capacity: 10,
  },
  {
    code: 'VAN-01',
    name: 'Company Van',
    type: 'vehicle' as const,
    description: 'Corporate transport vehicle',
    capacity: 8,
  },
];

export class ResourcesRepository {
  /**
   * Ensure new organizations have starter bookable resources.
   */
  private async ensureDefaultResources(organizationId: string) {
    const existingCount = await prisma.bookableResource.count({
      where: {
        organizationId,
        deletedAt: null,
      },
    });

    if (existingCount > 0) {
      return;
    }

    let location = await prisma.location.findFirst({
      where: {
        organizationId,
        deletedAt: null,
        isActive: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!location) {
      location = await prisma.location.create({
        data: {
          organizationId,
          name: 'Main Office',
          code: 'MAIN',
          type: 'building',
          address: {
            street: '123 Main St',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105',
          },
          isActive: true,
        },
      });
    }

    for (const resource of DEFAULT_RESOURCES) {
      await prisma.bookableResource.upsert({
        where: {
          organizationId_code: {
            organizationId,
            code: resource.code,
          },
        },
        update: {},
        create: {
          organizationId,
          locationId: location.id,
          ...resource,
          isActive: true,
        },
      });
    }
  }

  /**
   * Get all resources
   */
  async getAll(organizationId?: string) {
    if (!organizationId) {
      return [];
    }

    await this.ensureDefaultResources(organizationId);

    const resources = await prisma.bookableResource.findMany({
      where: {
        organizationId,
        deletedAt: null,
        isActive: true,
      },
      include: {
        location: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return resources.map(resource => ({
      id: resource.id,
      name: resource.name,
      type: resource.type.charAt(0).toUpperCase() + resource.type.slice(1),
      capacity: resource.capacity || 0,
      status: resource.isActive ? 'AVAILABLE' : 'UNAVAILABLE',
      location: resource.location?.name || 'Unknown',
    }));
  }

  /**
   * Get resource bookings
   */
  async getBookings(organizationId?: string) {
    if (!organizationId) {
      return [];
    }

    const bookings = await prisma.booking.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        resource: true,
        bookedByUser: true,
      },
      orderBy: {
        startDatetime: 'desc',
      },
    });

    return bookings.map(booking => ({
      id: booking.id,
      resource_id: booking.resourceId,
      employee_name: booking.bookedByUser 
        ? `${booking.bookedByUser.firstName} ${booking.bookedByUser.lastName}`
        : 'Unknown',
      purpose: booking.description || booking.title,
      start_time: booking.startDatetime.toISOString(),
      end_time: booking.endDatetime.toISOString(),
      status: booking.status.toUpperCase(),
    }));
  }

  /**
   * Create new resource booking
   */
  async createBooking(data: any, organizationId?: string, userId?: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Find the resource
    const resource = await prisma.bookableResource.findFirst({
      where: {
        organizationId,
        id: data.resource_id,
        deletedAt: null,
        isActive: true,
      },
    });

    if (!resource) {
      throw new Error('Resource not found');
    }

    const booking = await prisma.booking.create({
      data: {
        organizationId,
        resourceId: resource.id,
        bookedBy: userId,
        createdBy: userId,
        title: data.purpose || 'Resource Booking',
        description: data.purpose,
        startDatetime: new Date(data.start_time),
        endDatetime: new Date(data.end_time),
        status: 'confirmed',
      },
      include: {
        resource: true,
        bookedByUser: true,
      },
    });

    return {
      id: booking.id,
      resource_id: booking.resourceId,
      employee_name: booking.bookedByUser 
        ? `${booking.bookedByUser.firstName} ${booking.bookedByUser.lastName}`
        : 'Unknown',
      purpose: booking.description || booking.title,
      start_time: booking.startDatetime.toISOString(),
      end_time: booking.endDatetime.toISOString(),
      status: booking.status.toUpperCase(),
    };
  }
}

export const resourcesRepository = new ResourcesRepository();
