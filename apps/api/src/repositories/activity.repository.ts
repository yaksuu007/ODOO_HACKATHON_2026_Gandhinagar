import prisma from '../database/client';
import { ActivityLogResponse } from '../dtos/activity.dto';

export class ActivityRepository {
  /**
   * Get activity logs with pagination and filtering
   */
  async getActivityLogs(options: {
    page?: number;
    limit?: number;
    entityType?: string;
    action?: string;
    userId?: string;
    organizationId?: string;
  }) {
    const { page = 1, limit = 20, entityType, action, userId, organizationId } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (organizationId) {
      where.organizationId = organizationId;
    }
    if (entityType) {
      where.entityType = entityType;
    }
    if (action) {
      where.action = action;
    }
    if (userId) {
      where.userId = userId;
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    const response: ActivityLogResponse[] = logs.map((log: any) => ({
      id: log.id,
      userId: log.userId,
      username: log.user?.email || 'Unknown',
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      changes: log.changes,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
    }));

    return {
      data: response,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export const activityRepository = new ActivityRepository();
