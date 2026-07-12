import prisma from '../database/client';
import bcrypt from 'bcryptjs';
import { NotFoundError, DatabaseError } from '../errors/app.error';

/**
 * User Repository
 * Handles all database operations for users
 */
export class UserRepository {
  /**
   * Find user by ID
   */
  static async findById(id: string) {
    try {
      return await prisma.user.findUnique({
        where: { id },
        include: {
          organization: true,
          department: true,
          employee: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find user by ID');
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string) {
    try {
      return await prisma.user.findUnique({
        where: { email },
        include: {
          organization: true,
          department: true,
          employee: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find user by email');
    }
  }

  /**
   * Find user by email within an organization
   */
  static async findByEmailAndOrganization(email: string, organizationId: string) {
    try {
      return await prisma.user.findUnique({
        where: {
          organizationId_email: {
            organizationId,
            email,
          },
        },
        include: {
          organization: true,
          department: true,
          employee: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to find user by email and organization');
    }
  }

  /**
   * Create a new user
   */
  static async create(data: {
    organizationId: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    phone?: string;
    departmentId?: string;
    jobTitle?: string;
  }) {
    try {
      return await prisma.user.create({
        data,
        include: {
          organization: true,
          department: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to create user');
    }
  }

  /**
   * Update user
   */
  static async update(id: string, data: any) {
    try {
      return await prisma.user.update({
        where: { id },
        data,
        include: {
          organization: true,
          department: true,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to update user');
    }
  }

  /**
   * Update last login information
   */
  static async updateLastLogin(id: string, ipAddress?: string) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          lastLoginAt: new Date(),
          lastLoginIp: ipAddress,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to update last login');
    }
  }

  /**
   * Increment failed login attempts
   */
  static async incrementFailedLogin(id: string) {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundError('User');

      const failedAttempts = user.failedLoginAttempts + 1;
      const maxAttempts = 5;

      const updateData: any = {
        failedLoginAttempts: failedAttempts,
      };

      // Lock account after max failed attempts
      if (failedAttempts >= maxAttempts) {
        updateData.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      }

      return await prisma.user.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      throw new DatabaseError('Failed to increment failed login attempts');
    }
  }

  /**
   * Update password
   */
  static async updatePassword(id: string, passwordHash: string) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          passwordHash,
          passwordChangedAt: new Date(),
          mustChangePassword: false,
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to update password');
    }
  }

  /**
   * Verify password
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Hash password
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, 10);
  }

  /**
   * Delete user (soft delete)
   */
  static async delete(id: string) {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new DatabaseError('Failed to delete user');
    }
  }
}
