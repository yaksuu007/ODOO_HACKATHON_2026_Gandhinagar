import prisma from '../database/client';

// Map frontend status strings to Prisma enum values
const TO_PRISMA_STATUS: Record<string, string> = {
  'ACTIVE': 'available',
  'MAINTENANCE': 'in_maintenance',
  'RETIRED': 'retired',
  'available': 'available',
  'in_maintenance': 'in_maintenance',
  'retired': 'retired',
};

// Map Prisma enum values to frontend status strings
const TO_FRONTEND_STATUS: Record<string, string> = {
  available: 'ACTIVE',
  in_maintenance: 'MAINTENANCE',
  retired: 'RETIRED',
  allocated: 'ALLOCATED',
};

export class AssetsRepository {
  /**
   * Get all assets
   */
  async getAll(organizationId?: string) {
    if (!organizationId) {
      return [];
    }

    const assets = await prisma.asset.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        category: true,
        location: true,
        assignedToEmployee: true,
        assignedDepartment: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return assets.map(asset => ({
      id: asset.assetTag,
      name: asset.name,
      category: asset.category?.name || 'Uncategorized',
      department_id: asset.assignedDepartmentId,
      status: TO_FRONTEND_STATUS[asset.status] || asset.status.toUpperCase(),
      assigned_to: asset.assignedToEmployee 
        ? `${asset.assignedToEmployee.firstName} ${asset.assignedToEmployee.lastName}`
        : null,
      description: asset.description,
      serial_number: asset.serialNumber,
      cost: asset.purchaseCost?.toNumber() || 0,
      purchase_date: asset.purchaseDate?.toISOString().split('T')[0],
    }));
  }

  /**
   * Create new asset
   */
  async create(data: any, organizationId?: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    // Find or create a default category
    let category = await prisma.assetCategory.findFirst({
      where: {
        organizationId,
        name: data.category,
      },
    });

    if (!category) {
      category = await prisma.assetCategory.create({
        data: {
          organizationId,
          name: data.category,
          code: data.category.toUpperCase().replace(/\s/g, '_'),
        },
      });
    }

    const asset = await prisma.asset.create({
      data: {
        organizationId,
        categoryId: category.id,
        assetTag: data.id,
        serialNumber: data.serial_number,
        name: data.name,
        description: data.description,
        purchaseDate: data.purchase_date ? new Date(data.purchase_date) : null,
        purchaseCost: data.cost ? parseFloat(data.cost) : null,
        status: TO_PRISMA_STATUS[data.status] || 'available',
        assignedDepartmentId: data.department_id || null,
      },
      include: {
        category: true,
        assignedDepartment: true,
      },
    });

    return {
      id: asset.assetTag,
      name: asset.name,
      category: asset.category?.name || 'Uncategorized',
      department_id: asset.assignedDepartmentId,
      status: TO_FRONTEND_STATUS[asset.status] || asset.status.toUpperCase(),
      assigned_to: null,
      description: asset.description,
      serial_number: asset.serialNumber,
      cost: asset.purchaseCost?.toNumber() || 0,
      purchase_date: asset.purchaseDate?.toISOString().split('T')[0],
    };
  }

  /**
   * Delete asset
   */
  async delete(assetTag: string, organizationId?: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }

    await prisma.asset.updateMany({
      where: {
        organizationId,
        assetTag,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

export const assetsRepository = new AssetsRepository();
