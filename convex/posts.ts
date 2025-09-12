import { v } from "convex/values";
import { query } from "./_generated/server";

const LIMIT = 20;

export const getPublishedPosts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? LIMIT;

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(limit);

    return posts;
  },
});
