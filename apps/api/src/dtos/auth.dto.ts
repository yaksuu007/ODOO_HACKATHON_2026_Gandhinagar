import { z } from 'zod';

/**
 * Login Request DTO
 */
export const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginRequest = z.infer<typeof loginSchema>;

/**
 * Register Request DTO
 */
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  ),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  organizationSlug: z.string().min(1, 'Organization slug is required').max(100),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

/**
 * Login Response DTO
 */
export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    avatarUrl?: string;
    organizationId: string;
    organization: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

/**
 * Register Response DTO
 */
export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * Refresh Token Request DTO
 */
export const refreshTokenSchema = z.object({
  refresh_token: z.string(),
});

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;

/**
 * Change Password Request DTO
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  ),
});

export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;

/**
 * Forgot Password Request DTO
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Request DTO
 */
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain uppercase, lowercase, and number'
  ),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
