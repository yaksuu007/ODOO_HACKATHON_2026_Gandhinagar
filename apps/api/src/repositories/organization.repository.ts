import prisma from '../database/client';

export class OrganizationRepository {
  /**
   * Get organization departments
   */
  async getDepartments(organizationId?: string) {
    if (!organizationId) {
      return [];
    }

    const departments = await prisma.department.findMany({
      where: {
        organizationId,
        deletedAt: null,
        isActive: true,
      },
      include: {
        manager: true,
        location: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return departments.map(dept => ({
      id: dept.id,
      name: dept.name,
      manager: dept.manager ? `${dept.manager.firstName} ${dept.manager.lastName}` : 'Unassigned',
      location: dept.location?.name || 'Unknown',
    }));
  }

  /**
   * Create new department
   */
  async createDepartment(data: any, organizationId?: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    // Generate unique department code
    const baseCode = data.name.toUpperCase().replace(/\s+/g, '_').substring(0, 40);
    let code = baseCode;
    let counter = 1;

    // Check if code already exists and generate unique code
    while (true) {
      const existing = await prisma.department.findFirst({
        where: {
          organizationId,
          code,
        },
      });

      if (!existing) {
        break;
      }

      code = `${baseCode}_${counter}`;
      counter++;
    }

    const department = await prisma.department.create({
      data: {
        organizationId,
        name: data.name,
        code,
        description: data.description || null,
        managerId: data.manager_id || null,
        locationId: data.location_id || null,
      },
      include: {
        manager: true,
        location: true,
      },
    });

    return {
      id: department.id,
      name: department.name,
      manager: department.manager ? `${department.manager.firstName} ${department.manager.lastName}` : 'Unassigned',
      location: department.location?.name || 'Unknown',
    };
  }

  /**
   * Get organization metrics
   */
  async getMetrics(organizationId?: string) {
    if (!organizationId) {
      return {
        name: 'Unknown',
        department_count: 0,
        employee_count: 0,
      };
    }

    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    const departmentCount = await prisma.department.count({
      where: {
        organizationId,
        deletedAt: null,
        isActive: true,
      },
    });

    const employeeCount = await prisma.employee.count({
      where: {
        organizationId,
        deletedAt: null,
        employmentStatus: 'active',
      },
    });

    return {
      name: organization?.name || 'Unknown',
      department_count: departmentCount,
      employee_count: employeeCount,
    };
  }
}

export const organizationRepository = new OrganizationRepository();
