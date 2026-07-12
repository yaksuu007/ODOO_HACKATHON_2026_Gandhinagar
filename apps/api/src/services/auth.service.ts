import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import prisma from '../database/client';
import {
  InvalidCredentialsError,
  AccountLockedError,
  AccountInactiveError,
  AlreadyExistsError,
} from '../errors/app.error';
import { LoginRequest, RegisterRequest, LoginResponse } from '../dtos/auth.dto';
import ActivityLogger from '../logs/activity.logger';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  private static readonly SESSION_EXPIRY_DAYS = 7;

  static async login(
    credentials: LoginRequest,
    ipAddress?: string,
    userAgent?: string
  ): Promise<LoginResponse> {
    const user = await UserRepository.findByEmail(credentials.username);

    if (!user) {
      await ActivityLogger.logAuth({
        action: 'login_failed',
        changes: { reason: 'User not found', email: credentials.username },
        ipAddress,
        userAgent,
      });
      throw new InvalidCredentialsError();
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await ActivityLogger.logAuth({
        userId: user.id,
        organizationId: user.organizationId,
        action: 'login_failed',
        changes: { reason: 'Account locked' },
        ipAddress,
        userAgent,
      });
      throw new AccountLockedError();
    }

    if (!user.isActive) {
      await ActivityLogger.logAuth({
        userId: user.id,
        organizationId: user.organizationId,
        action: 'login_failed',
        changes: { reason: 'Account inactive' },
        ipAddress,
        userAgent,
      });
      throw new AccountInactiveError();
    }

    const isValidPassword = await UserRepository.verifyPassword(
      credentials.password,
      user.passwordHash
    );

    if (!isValidPassword) {
      await UserRepository.incrementFailedLogin(user.id);
      await ActivityLogger.logAuth({
        userId: user.id,
        organizationId: user.organizationId,
        action: 'login_failed',
        changes: { reason: 'Invalid password' },
        ipAddress,
        userAgent,
      });
      throw new InvalidCredentialsError();
    }

    await UserRepository.updateLastLogin(user.id, ipAddress);

    const token = this.generateToken(user.id, user.organizationId);

    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.SESSION_EXPIRY_DAYS);

    await SessionRepository.create({
      userId: user.id,
      token: sessionToken,
      ipAddress,
      userAgent,
      deviceType: this.parseDeviceType(userAgent),
      expiresAt,
    });

    await ActivityLogger.logAuth({
      userId: user.id,
      organizationId: user.organizationId,
      action: 'login_success',
      ipAddress,
      userAgent,
    });

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: 7 * 24 * 60 * 60,
      user: {
        id: user.id,
        email: user.email,
        username: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName || undefined,
        avatarUrl: user.avatarUrl || undefined,
        organizationId: user.organizationId,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
        },
      },
    };
  }

  static async register(data: RegisterRequest): Promise<any> {
    let organization = await prisma.organization.findUnique({
      where: { slug: data.organizationSlug },
    });

    if (!organization) {
      organization = await prisma.organization.create({
        data: {
          name: data.organizationSlug,
          slug: data.organizationSlug,
          email: data.email,
          isActive: true,
        },
      });
    }

    const existingUser = await UserRepository.findByEmailAndOrganization(
      data.email,
      organization.id
    );

    if (existingUser) {
      throw new AlreadyExistsError('User with this email already exists in the organization');
    }

    const passwordHash = await UserRepository.hashPassword(data.password);

    const user = await UserRepository.create({
      organizationId: organization.id,
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.firstName + ' ' + data.lastName,
    });

    const defaultRole = await prisma.role.findFirst({
      where: {
        organizationId: organization.id,
        slug: 'employee',
      },
    });

    if (defaultRole) {
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: defaultRole.id,
          isActive: true,
        },
      });
    }

    await ActivityLogger.logAuth({
      userId: user.id,
      organizationId: organization.id,
      action: 'register_success',
      changes: { email: data.email },
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  static async logout(userId: string, token: string): Promise<void> {
    await SessionRepository.deactivate(token);
    await ActivityLogger.logAuth({
      userId,
      action: 'logout_success',
    });
  }

  static async logoutAll(userId: string): Promise<void> {
    await SessionRepository.deactivateAllForUser(userId);
    await ActivityLogger.logAuth({
      userId,
      action: 'logout_all_success',
    });
  }

  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  private static generateToken(userId: string, organizationId: string): string {
    return jwt.sign(
      {
        userId,
        organizationId,
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  private static parseDeviceType(userAgent?: string): string {
    if (!userAgent) return 'unknown';

    if (/mobile/i.test(userAgent)) return 'mobile';
    if (/tablet/i.test(userAgent)) return 'tablet';
    if (/desktop/i.test(userAgent)) return 'desktop';

    return 'desktop';
  }
}

export default AuthService;
