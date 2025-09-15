import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserProfile } from "./posts";

export const getUserRole = query({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }
    const userProfile = await getUserProfile(ctx, userId);
    return userProfile.role;
  },
});

export const getCurrentUser = query({
  args: {},
  returns: v.object({
    _id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.string(),
  }),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const userProfile = await getUserProfile(ctx, userId);

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: userProfile.role,
    };
  },
});

export const changeRole = mutation({
  returns: v.null(),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuario no autenticado");
    }
    const userProfile = await getUserProfile(ctx, userId);
    const nuevoRol = userProfile.role === "admin" ? "user" : "admin";
    await ctx.db.patch(userProfile._id, { role: nuevoRol });
    return null;
  },
});
