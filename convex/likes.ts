import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericQueryCtx } from "convex/server";
import { v } from "convex/values";
import type { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { AuthErrors, PostErrors } from "./lib/errors";

async function getLoggedInUser(ctx: GenericQueryCtx<DataModel>) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw AuthErrors.userNotAuthenticated();
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw AuthErrors.userNotFound();
  }
  return user;
}

export const hasUserLikedPost = query({
  args: { postId: v.id("posts") },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return false;
    }

    const like = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", userId)
      )
      .unique();

    return !!like;
  },
});

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  returns: v.object({
    liked: v.boolean(),
    likesCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx);
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw PostErrors.notFound();
    }

    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", user._id)
      )
      .unique();

    if (existingLike) {
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.postId, {
        likesCount: Math.max(0, post.likesCount - 1),
      });
      return { liked: false, likesCount: Math.max(0, post.likesCount - 1) };
    }
    await ctx.db.insert("likes", {
      postId: args.postId,
      commentId: undefined,
      userId: user._id,
    });
    await ctx.db.patch(args.postId, {
      likesCount: post.likesCount + 1,
    });
    return { liked: true, likesCount: post.likesCount + 1 };
  },
});
