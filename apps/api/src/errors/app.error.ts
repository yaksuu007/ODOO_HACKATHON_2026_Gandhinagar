import { ErrorCode } from './error.codes';

/**
 * Base Application Error
 * All custom errors should extend this class
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode?: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);

    this.code = code;
    this.statusCode = statusCode || 500;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Authentication Errors
 */
export class AuthenticationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.UNAUTHORIZED, message, 401, true, details);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(details?: any) {
    super(ErrorCode.INVALID_CREDENTIALS, 'Invalid username or password', 401, true, details);
  }
}

export class TokenExpiredError extends AppError {
  constructor(details?: any) {
    super(ErrorCode.TOKEN_EXPIRED, 'Token has expired', 401, true, details);
  }
}

export class AccountLockedError extends AppError {
  constructor(details?: any) {
    super(ErrorCode.ACCOUNT_LOCKED, 'Account has been locked', 403, true, details);
  }
}

export class AccountInactiveError extends AppError {
  constructor(details?: any) {
    super(ErrorCode.ACCOUNT_INACTIVE, 'Account is inactive', 403, true, details);
  }
}

/**
 * Authorization Errors
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access forbidden', details?: any) {
    super(ErrorCode.FORBIDDEN, message, 403, true, details);
  }
}

export class InsufficientPermissionsError extends AppError {
  constructor(details?: any) {
    super(ErrorCode.INSUFFICIENT_PERMISSIONS, 'Insufficient permissions', 403, true, details);
  }
}

/**
 * Validation Errors
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, true, details);
  }
}

export class InvalidInputError extends AppError {
  constructor(field: string, details?: any) {
    super(ErrorCode.INVALID_INPUT, `Invalid input: ${field}`, 400, true, details);
  }
}

/**
 * Resource Errors
 */
export class NotFoundError extends AppError {
  constructor(resource: string, details?: any) {
    super(ErrorCode.RESOURCE_NOT_FOUND, `${resource} not found`, 404, true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.RESOURCE_CONFLICT, message, 409, true, details);
  }
}

export class AlreadyExistsError extends AppError {
  constructor(resource: string, details?: any) {
    super(ErrorCode.RESOURCE_ALREADY_EXISTS, `${resource} already exists`, 409, true, details);
  }
}

/**
 * Database Errors
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(ErrorCode.DATABASE_ERROR, message, 500, false, details);
  }
}

/**
 * External Service Errors
 */
export class EmailSendError extends AppError {
  constructor(details?: any) {
    super(ErrorCode.EMAIL_SEND_FAILED, 'Failed to send email', 502, true, details);
  }
}

/**
 * System Errors
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'Internal server error', details?: any) {
    super(ErrorCode.INTERNAL_SERVER_ERROR, message, 500, false, details);
  }
}

export class RateLimitError extends AppError {
  constructor(details?: any) {
    super(ErrorCode.RATE_LIMIT_EXCEEDED, 'Rate limit exceeded', 429, true, details);
  }
}
