import { ConvexError } from "convex/values";

export const ERROR_TYPES = {
  AUTHENTICATION: "AUTHENTICATION",
  AUTHORIZATION: "AUTHORIZATION",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION: "VALIDATION",
  PERMISSION: "PERMISSION",
} as const;

export type ErrorType = (typeof ERROR_TYPES)[keyof typeof ERROR_TYPES];

export const ERROR_MESSAGES = {
  USER_NOT_AUTHENTICATED: "User not authenticated",
  USER_NOT_FOUND: "User not found",
  ACCESS_DENIED_ADMIN: "Access denied: admin role required",
  ACCESS_DENIED_USER: "Access denied: user role required",
  ACCESS_DENIED_EDIT_POST: "Access denied: no permission to edit this post",
  ACCESS_DENIED_DELETE_POST: "Access denied: no permission to delete this post",
  POST_NOT_FOUND: "Post not found",
  PROFILE_NOT_FOUND: "User profile not found",
  INVALID_POST_DATA: "Invalid post data",
  SLUG_ALREADY_EXISTS: "Post with this slug already exists in category",
} as const;

export class AppError extends ConvexError<string> {
  type: ErrorType;
  code?: string;

  constructor(message: string, type: ErrorType, code?: string) {
    super(message);
    this.type = type;
    this.code = code;
  }
}

export const createAuthenticationError = (message?: string) => {
  return new AppError(
    message || ERROR_MESSAGES.USER_NOT_AUTHENTICATED,
    ERROR_TYPES.AUTHENTICATION,
    "AUTH_001"
  );
};

export const createAuthorizationError = (message?: string) => {
  return new AppError(
    message || ERROR_MESSAGES.ACCESS_DENIED_USER,
    ERROR_TYPES.AUTHORIZATION,
    "AUTH_002"
  );
};

export const createNotFoundError = (message?: string) => {
  return new AppError(
    message || ERROR_MESSAGES.POST_NOT_FOUND,
    ERROR_TYPES.NOT_FOUND,
    "NOT_FOUND_001"
  );
};

export const createValidationError = (message?: string) => {
  return new AppError(
    message || ERROR_MESSAGES.INVALID_POST_DATA,
    ERROR_TYPES.VALIDATION,
    "VALIDATION_001"
  );
};

export const createPermissionError = (message?: string) => {
  return new AppError(
    message || ERROR_MESSAGES.ACCESS_DENIED_EDIT_POST,
    ERROR_TYPES.PERMISSION,
    "PERMISSION_001"
  );
};

export const AuthErrors = {
  userNotAuthenticated: () =>
    createAuthenticationError(ERROR_MESSAGES.USER_NOT_AUTHENTICATED),
  userNotFound: () => createNotFoundError(ERROR_MESSAGES.USER_NOT_FOUND),
  profileNotFound: () => createNotFoundError(ERROR_MESSAGES.PROFILE_NOT_FOUND),
  adminRequired: () =>
    createAuthorizationError(ERROR_MESSAGES.ACCESS_DENIED_ADMIN),
  userRequired: () =>
    createAuthorizationError(ERROR_MESSAGES.ACCESS_DENIED_USER),
} as const;

export const PostErrors = {
  notFound: () => createNotFoundError(ERROR_MESSAGES.POST_NOT_FOUND),
  cannotEdit: () =>
    createPermissionError(ERROR_MESSAGES.ACCESS_DENIED_EDIT_POST),
  cannotDelete: () =>
    createPermissionError(ERROR_MESSAGES.ACCESS_DENIED_DELETE_POST),
  slugExists: () => createValidationError(ERROR_MESSAGES.SLUG_ALREADY_EXISTS),
} as const;
