import prisma from '../database/client';

// Map frontend priority strings to Prisma enum values
const TO_PRISMA_PRIORITY: Record<string, string> = {
  'LOW': 'low',
  'MEDIUM': 'normal',
  'HIGH': 'high',
  'low': 'low',
  'normal': 'normal',
  'high': 'high',
  'critical': 'critical',
  'emergency': 'emergency'
};

// Map Prisma enum values to frontend priority strings
const TO_FRONTEND_PRIORITY: Record<string, string> = {
  low: 'LOW',
  normal: 'MEDIUM',
  high: 'HIGH',
  critical: 'CRITICAL',
  emergency: 'EMERGENCY'
};

// Map frontend status strings to Prisma enum values
const TO_PRISMA_STATUS: Record<string, string> = {
  'PENDING': 'pending',
  'IN_PROGRESS': 'in_progress',
  'COMPLETED': 'completed',
  'pending': 'pending',
  'in_progress': 'in_progress',
  'completed': 'completed',
  'approved': 'approved',
  'on_hold': 'on_hold',
  'cancelled': 'cancelled',
  'rejected': 'rejected'
};

// Map Prisma enum values to frontend status strings
const TO_FRONTEND_STATUS: Record<string, string> = {
  pending: 'PENDING',
  in_progress: 'IN_PROGRESS',
  completed: 'COMPLETED',
  approved: 'APPROVED',
  on_hold: 'ON_HOLD',
  cancelled: 'CANCELLED',
  rejected: 'REJECTED'
};

export class MaintenanceRepository {
  /**
   * Get all maintenance records
   */
  async getAll(organizationId?: string) {
    if (!organizationId) {
      return [];
    }

    const maintenanceRequests = await prisma.maintenanceRequest.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        asset: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return maintenanceRequests.map(request => ({
      id: request.id,
      asset_id: request.asset?.assetTag || request.assetId,
      description: request.description,
      priority: TO_FRONTEND_PRIORITY[request.priority] || request.priority.toUpperCase(),
      scheduled_date: request.targetCompletionDate?.toISOString().split('T')[0] || request.requestedDate.toISOString().split('T')[0],
      cost: request.estimatedCost?.toNumber() || 0,
      status: TO_FRONTEND_STATUS[request.status] || request.status.toUpperCase(),
    }));
  }

  /**
   * Create new maintenance ticket
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

    // Generate request number
    const requestNumber = `MR-${Date.now()}`;

    const maintenanceRequest = await prisma.maintenanceRequest.create({
      data: {
        organizationId,
        assetId: asset.id,
        requestNumber,
        requestedBy: userId,
        createdBy: userId,
        type: 'corrective',
        priority: TO_PRISMA_PRIORITY[data.priority] || 'normal',
        status: 'pending',
        description: data.description,
        targetCompletionDate: data.scheduled_date ? new Date(data.scheduled_date) : null,
        estimatedCost: data.cost ? parseFloat(data.cost) : null,
      },
      include: {
        asset: true,
      },
    });

    return {
      id: maintenanceRequest.id,
      asset_id: maintenanceRequest.asset?.assetTag || maintenanceRequest.assetId,
      description: maintenanceRequest.description,
      priority: TO_FRONTEND_PRIORITY[maintenanceRequest.priority] || maintenanceRequest.priority.toUpperCase(),
      scheduled_date: maintenanceRequest.targetCompletionDate?.toISOString().split('T')[0] || maintenanceRequest.requestedDate.toISOString().split('T')[0],
      cost: maintenanceRequest.estimatedCost?.toNumber() || 0,
      status: TO_FRONTEND_STATUS[maintenanceRequest.status] || maintenanceRequest.status.toUpperCase(),
    };
  }

  /**
   * Update maintenance ticket status
   */
  async updateStatus(id: string, newStatus: string, organizationId?: string, userId?: string) {
    if (!organizationId) {
      throw new Error('Organization ID is required');
    }
    if (!userId) {
      throw new Error('User ID is required');
    }

    const prismaStatus = TO_PRISMA_STATUS[newStatus];

    if (!prismaStatus) {
      throw new Error('Invalid status');
    }

    // Find the maintenance request
    const maintenanceRequest = await prisma.maintenanceRequest.findUnique({
      where: {
        id,
        organizationId,
      },
      include: {
        asset: true,
      },
    });

    if (!maintenanceRequest) {
      throw new Error('Maintenance request not found');
    }

    // Update the maintenance request
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: {
        id,
        organizationId,
      },
      data: {
        status: prismaStatus as any,
        actualCompletionDate: prismaStatus === 'completed' ? new Date() : null,
        updatedBy: userId,
        completedBy: prismaStatus === 'completed' ? userId : null,
      },
      include: {
        asset: true,
      },
    });

    // Update the asset's status based on maintenance status
    let assetStatus: string = 'available';
    if (prismaStatus === 'in_progress') {
      assetStatus = 'in_maintenance';
    } else if (prismaStatus === 'completed') {
      assetStatus = 'available';
    }

    await prisma.asset.update({
      where: {
        id: maintenanceRequest.assetId,
      },
      data: {
        status: assetStatus as any,
      },
    });

    return {
      id: updatedRequest.id,
      asset_id: updatedRequest.asset?.assetTag || updatedRequest.assetId,
      description: updatedRequest.description,
      priority: TO_FRONTEND_PRIORITY[updatedRequest.priority] || updatedRequest.priority.toUpperCase(),
      scheduled_date: updatedRequest.targetCompletionDate?.toISOString().split('T')[0] || updatedRequest.requestedDate.toISOString().split('T')[0],
      cost: updatedRequest.estimatedCost?.toNumber() || 0,
      status: TO_FRONTEND_STATUS[updatedRequest.status] || updatedRequest.status.toUpperCase(),
    };
  }
}

export const maintenanceRepository = new MaintenanceRepository();
