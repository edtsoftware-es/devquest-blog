import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { AuthErrors } from "./lib/errors";

export const getUserRole = query({
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
    return user.role;
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
    let avatarUrl = user.image;
    try {
      avatarUrl =
        (await ctx.storage.getUrl(user.image as Id<"_storage">)) ?? user.image;
    } catch {
      avatarUrl = user.image;
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: avatarUrl,
      role: user.role,
      nickname: user.nickname,
      bio: user.bio,
      username: user.name,
    };
  },
});

export const getCurrentUserOptional = query({
  args: {},
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
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        username: user.name,
      };
    } catch {
      return null;
    }
  },
});

export const changeRole = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw AuthErrors.userNotAuthenticated();
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw AuthErrors.userNotFound();
    }
    const nuevoRol = user.role === "admin" ? "user" : "admin";
    await ctx.db.patch(user._id, { role: nuevoRol });
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
    const user = await ctx.db.get(userId);
    if (!user) {
      throw AuthErrors.userNotFound();
    }
    await ctx.db.patch(user._id, {
      nickname: args.nickname,
      bio: args.bio,
      name: args.username,
    });
    return null;
  },
});

export const sendImage = mutation({
  args: {
    storageId: v.id("_storage"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw AuthErrors.userNotFound();
    }
    await ctx.db.patch(user._id, {
      image: args.storageId,
    });
    return null;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
