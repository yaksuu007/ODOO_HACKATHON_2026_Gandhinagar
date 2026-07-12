import { Context } from 'hono';
import AuthService from '../services/auth.service';
import { LoginRequest, RegisterRequest } from '../dtos/auth.dto';
import logger from '../logs/logger';

export class AuthController {
  /**
   * Handle login request
   */
  static async login(c: Context) {
    const body = c.get('validatedData') as LoginRequest;
    const ipAddress = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const userAgent = c.req.header('user-agent') || 'unknown';

    logger.info({ email: body.username }, 'Login attempt');

    const result = await AuthService.login(body, ipAddress, userAgent);

    return c.json({
      success: true,
      data: result,
    });
  }

  /**
   * Handle register request
   */
  static async register(c: Context) {
    const body = c.get('validatedData') as RegisterRequest;

    logger.info({ email: body.email }, 'Registration attempt');

    const result = await AuthService.register(body);

    return c.json({
      success: true,
      data: result,
    }, 201);
  }

  /**
   * Handle logout request
   */
  static async logout(c: Context) {
    const userId = c.get('userId');
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.substring(7) || '';

    await AuthService.logout(userId, token);

    return c.json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  /**
   * Handle logout from all devices
   */
  static async logoutAll(c: Context) {
    const userId = c.get('userId');

    await AuthService.logoutAll(userId);

    return c.json({
      success: true,
      message: 'Logged out from all devices successfully',
    });
  }

  /**
   * Get current user info
   */
  static async me(c: Context) {
    const user = c.get('user');

    return c.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        organizationId: user.organizationId,
        organization: {
          id: user.organization.id,
          name: user.organization.name,
          slug: user.organization.slug,
        },
      },
    });
  }
}

export default AuthController;
