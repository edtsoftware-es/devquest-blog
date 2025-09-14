import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getUserProfile } from "./posts";
import { getAuthUserId } from "@convex-dev/auth/server";

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