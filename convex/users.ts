import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { AuthErrors } from "./lib/errors";
import { generateUploadUrl } from "./lib/utils";

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

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
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
    storageId: v.optional(v.id("_storage")),
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

    const updateData: {
      nickname: string;
      bio: string;
      name: string;
      image?: string;
    } = {
      nickname: args.nickname,
      bio: args.bio,
      name: args.username,
    };

    if (args.storageId) {
      const imageUrl = await ctx.storage.getUrl(args.storageId);
      if (imageUrl) {
        updateData.image = imageUrl;
      }
    }

    await ctx.db.patch(user._id, updateData);
    return null;
  },
});

export const generateUserUploadUrl = mutation({
  handler: async (ctx) => {
    return await generateUploadUrl(ctx);
  },
});
