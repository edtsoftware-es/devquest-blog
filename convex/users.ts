import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthErrors } from "./lib/errors";
import { UserWithRoleValidator } from "./lib/validators";
import { getUserProfile } from "./posts";

export const getUserRole = query({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw AuthErrors.userNotAuthenticated();
    }
    const userProfile = await getUserProfile(ctx, userId);
    return userProfile.role;
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw AuthErrors.userNotAuthenticated();
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw AuthErrors.userNotFound();
    }

    const userProfile = await getUserProfile(ctx, userId);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: userProfile.role,
      nickname: userProfile.nickname,
      bio: userProfile.bio,
      username: userProfile.username,
    };
  },
});

export const getCurrentUserOptional = query({
  args: {},
  returns: v.union(UserWithRoleValidator, v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }

    try {
      const userProfile = await getUserProfile(ctx, userId);
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: userProfile.role,
        username: userProfile.username,
      };
    } catch {
      return null;
    }
  },
});

export const changeRole = mutation({
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw AuthErrors.userNotAuthenticated();
    }
    const userProfile = await getUserProfile(ctx, userId);
    const nuevoRol = userProfile.role === "admin" ? "user" : "admin";
    await ctx.db.patch(userProfile._id, { role: nuevoRol });
    return null;
  },
});

export const updateUserProfile = mutation({
  args: {
    nickname: v.string(),
    bio: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw AuthErrors.userNotAuthenticated();
    }
    const userProfile = await getUserProfile(ctx, userId);
    await ctx.db.patch(userProfile._id, {
      nickname: args.nickname,
      bio: args.bio,
      username: args.username,
    });
    await ctx.db.patch(userId, {
      name: args.username,
    });
    return null;
  },
});
