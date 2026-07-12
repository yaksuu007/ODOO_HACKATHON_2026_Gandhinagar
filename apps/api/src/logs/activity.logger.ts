import logger from './logger';
import prisma from '../database/client';

export enum ActivityLogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface ActivityLogEntry {
  userId?: string;
  organizationId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
}

export class ActivityLogger {
  static async log(entry: ActivityLogEntry, level: ActivityLogLevel = ActivityLogLevel.INFO): Promise<void> {
    logger[level]({ type: 'activity', ...entry });
    if (entry.userId) {
      try {
        await prisma.activityLog.create({
          data: {
            userId: entry.userId,
            organizationId: entry.organizationId || '',
            action: entry.action as any,
            entityType: entry.entityType,
            entityId: entry.entityId,
            changes: entry.changes || {},
            ipAddress: entry.ipAddress,
            userAgent: entry.userAgent,
          },
        });
      } catch (error) {
        logger.error({ error }, 'Failed to log activity to database');
      }
    }
  }

  static async logAuth(entry: Omit<ActivityLogEntry, 'entityType'>): Promise<void> {
    await this.log({ ...entry, entityType: 'auth' });
  }

  static async logUser(entry: Omit<ActivityLogEntry, 'entityType'>): Promise<void> {
    await this.log({ ...entry, entityType: 'users' });
  }

  static async logAsset(entry: Omit<ActivityLogEntry, 'entityType'>): Promise<void> {
    await this.log({ ...entry, entityType: 'assets' });
  }

  static async logAllocation(entry: Omit<ActivityLogEntry, 'entityType'>): Promise<void> {
    await this.log({ ...entry, entityType: 'allocations' });
  }

  static async logMaintenance(entry: Omit<ActivityLogEntry, 'entityType'>): Promise<void> {
    await this.log({ ...entry, entityType: 'maintenance' });
  }

  static async logAudit(entry: Omit<ActivityLogEntry, 'entityType'>): Promise<void> {
    await this.log({ ...entry, entityType: 'audit' });
  }

  static async logSystem(entry: Omit<ActivityLogEntry, 'entityType'>): Promise<void> {
    await this.log({ ...entry, entityType: 'system' });
  }
}

export default ActivityLogger;
