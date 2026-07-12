import prisma from '../database/client';
import { DatabaseError } from '../errors/app.error';

/**
 * Session Repository
 * Handles all database operations for sessions
 */
export class SessionRepository {
  /**
   * Create a new session
   */
  static async create(data: {
    userId: string;
    token: string;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
    location?: any;
    expiresAt: Date;
  }) {
    try {
      return await prisma.session.create({
        data,
        include: {
          user: {
            include: {
              organization: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to create session');
    }
  }

  /**
   * Find session by token
   */
  static async findByToken(token: string) {
    try {
      return await prisma.session.findUnique({
        where: { token },
        include: {
          user: {
            include: {
              organization: true,
            },
          },
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find session by token');
    }
  }

  /**
   * Find active sessions by user ID
   */
  static async findByUserId(userId: string) {
    try {
      return await prisma.session.findMany({
        where: {
          userId,
          isActive: true,
          expiresAt: { gte: new Date() },
        },
        orderBy: { lastActivity: 'desc' },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find sessions by user ID');
    }
  }

  /**
   * Update session last activity
   */
  static async updateLastActivity(token: string) {
    try {
      return await prisma.session.update({
        where: { token },
        data: { lastActivity: new Date() },
      });
    } catch (error) {
      throw new DatabaseError('Failed to update session last activity');
    }
  }

  /**
   * Deactivate session
   */
  static async deactivate(token: string) {
    try {
      return await prisma.session.update({
        where: { token },
        data: { isActive: false },
      });
    } catch (error) {
      throw new DatabaseError('Failed to deactivate session');
    }
  }

  /**
   * Deactivate all sessions for a user
   */
  static async deactivateAllForUser(userId: string) {
    try {
      return await prisma.session.updateMany({
        where: { userId },
        data: { isActive: false },
      });
    } catch (error) {
      throw new DatabaseError('Failed to deactivate all sessions for user');
    }
  }

  /**
   * Delete expired sessions
   */
  static async deleteExpired() {
    try {
      return await prisma.session.deleteMany({
        where: {
          expiresAt: { lt: new Date() },
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to delete expired sessions');
    }
  }
}
