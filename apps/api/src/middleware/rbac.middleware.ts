import { Context, Next } from 'hono';
import { InsufficientPermissionsError } from '../errors/app.error';
import prisma from '../database/client';

/**
 * RBAC Middleware Factory
 * Creates middleware that checks if user has required permissions
 */
export function rbacMiddleware(requiredPermissions: string[]) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    const organizationId = c.get('organizationId');

    if (!userId || !organizationId) {
      throw new InsufficientPermissionsError();
    }

    // Get user's roles and permissions
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gte: new Date() },
      },
      include: {
        role: {
          include: {
            rolePermissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    // Collect all permissions
    const userPermissions = new Set<string>();
    for (const userRole of userRoles) {
      for (const rolePermission of userRole.role.rolePermissions) {
        userPermissions.add(rolePermission.permission.slug);
      }
    }

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission)
    );

    if (!hasAllPermissions) {
      throw new InsufficientPermissionsError({
        required: requiredPermissions,
        available: Array.from(userPermissions),
      });
    }

    await next();
  };
}

/**
 * Role Check Middleware Factory
 * Creates middleware that checks if user has required role
 */
export function roleMiddleware(requiredRoles: string[]) {
  return async (c: Context, next: Next) => {
    const userId = c.get('userId');
    const organizationId = c.get('organizationId');

    if (!userId || !organizationId) {
      throw new InsufficientPermissionsError();
    }

    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
        isActive: true,
        expiresAt: { gte: new Date() },
      },
      include: {
        role: true,
      },
    });

    const userRoleSlugs = userRoles.map((ur) => ur.role.slug);
    const hasRequiredRole = requiredRoles.some((role) => userRoleSlugs.includes(role));

    if (!hasRequiredRole) {
      throw new InsufficientPermissionsError({
        required: requiredRoles,
        available: userRoleSlugs,
      });
    }

    await next();
  };
}
