import { v } from "convex/values";
import { query } from "./_generated/server";
import { CategoryValidator } from "./lib/validators";

export const getCategoryBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(CategoryValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getAllCategories = query({
  args: {},
  returns: v.array(CategoryValidator),
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getCategoryById = query({
  args: {
    categoryId: v.id("categories"),
  },
  returns: v.union(CategoryValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.categoryId);
  },
});
