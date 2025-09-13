import { getAuthUserId } from "@convex-dev/auth/server";
import type { GenericQueryCtx } from "convex/server";
import { v } from "convex/values";
import type { DataModel } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

async function getLoggedInUser(ctx: GenericQueryCtx<DataModel>) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not authenticated");
  }
  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export const hasUserLikedPost = query({
  args: { postId: v.id("posts") },
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
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx);
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
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
      userId: user._id,
    });
    await ctx.db.patch(args.postId, {
      likesCount: post.likesCount + 1,
    });
    return { liked: true, likesCount: post.likesCount + 1 };
  },
});
