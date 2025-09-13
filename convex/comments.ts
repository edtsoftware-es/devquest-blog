import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.object({
    page: v.array(
      v.object({
        _id: v.id("comments"),
        _creationTime: v.number(),
        postId: v.id("posts"),
        authorId: v.id("users"),
        parentId: v.optional(v.id("comments")),
        content: v.string(),
        deletedAt: v.optional(v.number()),
        likesCount: v.number(),
      })
    ),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});
