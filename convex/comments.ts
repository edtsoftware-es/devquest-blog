import { v } from "convex/values";
import { query } from "./_generated/server";
import {
  CommentValidator,
  createPaginatedResultValidator,
  optionalPaginationOpts,
} from "./lib/validators";

export const getCommentsByPostId = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: optionalPaginationOpts,
  },
  returns: createPaginatedResultValidator(CommentValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});
