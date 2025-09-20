import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { AuthErrors } from "./errors";

/**
 * Gets the current authenticated user identity
 * @throws {AppError} If user is not authenticated
 */
export const getCurrentUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw AuthErrors.userNotAuthenticated();
  }
  return identity;
};

/**
 * Gets the current user profile from database
 * @throws {AppError} If user is not authenticated or profile not found
 */
export const getCurrentUserProfile = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getAuthUserId(ctx);

  const userProfile = await ctx.db
    .query("users")
    .withIndex("by_id", (q) => q.eq("_id", userId as any))
    .unique();

  if (!userProfile) {
    throw AuthErrors.userNotFound();
  }

  return userProfile;
};

/**
 * Requires current user to have admin role
 * @throws {AppError} If user doesn't have admin permissions
 */
export const requireAdmin = async (ctx: QueryCtx | MutationCtx) => {
  const user = await getCurrentUserProfile(ctx);

  if (user.role !== "admin") {
    throw AuthErrors.adminRequired();
  }

  return user;
};

/**
 * Requires current user to have at least user role
 * @throws {AppError} If user doesn't have user permissions
 */
export const requireUser = async (ctx: QueryCtx | MutationCtx) => {
  const userProfile = await getCurrentUserProfile(ctx);

  if (userProfile.role !== "user" && userProfile.role !== "admin") {
    throw AuthErrors.userRequired();
  }

  return userProfile;
};

/**
 * Gets current user profile optionally (returns null if not found)
 */
export const getOptionalUser = async (ctx: QueryCtx | MutationCtx) => {
  try {
    return await getCurrentUserProfile(ctx);
  } catch {
    return null;
  }
};
