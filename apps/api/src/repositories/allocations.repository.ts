import prisma from '../database/client';

export class AllocationsRepository {
  /**
   * Get all allocations
   */
  async getAll(organizationId?: string) {
    if (!organizationId) {
      return [];
    }

    const allocations = await prisma.allocation.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        asset: true,
        allocatedToEmployee: true,
        allocatedToDepartment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return allocations.map(allocation => ({
      id: allocation.id,
      asset_id: allocation.asset?.assetTag || allocation.assetId,
      employee_name: allocation.allocatedToEmployee 
        ? `${allocation.allocatedToEmployee.firstName} ${allocation.allocatedToEmployee.lastName}`
        : null,
      department: allocation.allocatedToDepartment?.name || null,
      allocated_at: allocation.allocationDate.toISOString().split('T')[0],
      notes: allocation.purpose,
    }));
  }

  /**
   * Create new allocation
   */
  async create(data: any, organizationId?: string, userId?: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Find the asset by assetTag
    const asset = await prisma.asset.findFirst({
      where: {
        organizationId,
        assetTag: data.asset_id,
        deletedAt: null,
      },
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    // When creating an allocation, update asset status to allocated
    await prisma.asset.update({
      where: { id: asset.id },
      data: { status: 'allocated' },
    });

    // Find employee by name (simplified - in real app would use employee ID)
    let employeeId = null;
    if (data.employee_name) {
      const nameParts = data.employee_name.split(' ');
      const employee = await prisma.employee.findFirst({
        where: {
          organizationId,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
        },
      });
      employeeId = employee?.id || null;
    }

    // Find department by name
    let departmentId = null;
    if (data.department) {
      const department = await prisma.department.findFirst({
        where: {
          organizationId,
          name: data.department,
        },
      });
      departmentId = department?.id || null;
    }

    const allocation = await prisma.allocation.create({
      data: {
        organizationId,
        assetId: asset.id,
        allocatedToEmployeeId: employeeId,
        allocatedToDepartmentId: departmentId,
        allocatedBy: userId,
        createdBy: userId,
        purpose: data.notes,
        status: 'active',
      },
      include: {
        asset: true,
        allocatedToEmployee: true,
        allocatedToDepartment: true,
      },
    });

    return {
      id: allocation.id,
      asset_id: allocation.asset?.assetTag || allocation.assetId,
      employee_name: allocation.allocatedToEmployee 
        ? `${allocation.allocatedToEmployee.firstName} ${allocation.allocatedToEmployee.lastName}`
        : null,
      department: allocation.allocatedToDepartment?.name || null,
      allocated_at: allocation.allocationDate.toISOString().split('T')[0],
      notes: allocation.purpose,
    };
  }
}

export const allocationsRepository = new AllocationsRepository();
