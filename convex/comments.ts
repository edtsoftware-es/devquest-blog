import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getCurrentUserProfile, requireUser } from "./lib/auth";
import { AuthErrors, PostErrors } from "./lib/errors";
import {
  CommentInputFields,
  CommentUpdateFields,
  CommentValidator,
  CommentWithAuthorValidator,
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
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});

export const getCommentsWithAuthors = query({
  args: {
    postId: v.id("posts"),
    paginationOpts: optionalPaginationOpts,
  },
  returns: createPaginatedResultValidator(CommentWithAuthorValidator),
  handler: async (ctx, args) => {
    const commentsPage = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 50, cursor: null });

    const commentsWithAuthors = await Promise.all(
      commentsPage.page.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          authorName: author?.name || "Unknown User",
          authorImage: author?.image,
        };
      })
    );

    return {
      ...commentsPage,
      page: commentsWithAuthors,
    };
  },
});

export const createComment = mutation({
  args: CommentInputFields,
  returns: v.id("comments"),
  handler: async (ctx, args) => {
    const userProfile = await requireUser(ctx);
    const userId = userProfile.userId;

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw PostErrors.notFound();
    }

    // Rate limiting
    const recentComments = await ctx.db
      .query("comments")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .filter(
        (q) => q.gt(q.field("_creationTime"), Date.now() - 60_000)
      )
      .collect();

    if (recentComments.length >= 5) {
      throw new Error(
        "Rate limit exceeded. Please wait before commenting again."
      );
    }

    if (args.parentId) {
      const parentComment = await ctx.db.get(args.parentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
      if (parentComment.postId !== args.postId) {
        throw new Error("Parent comment does not belong to this post");
      }
      if (parentComment.deletedAt) {
        throw new Error("Cannot reply to a deleted comment");
      }
    }

    const trimmedContent = args.content.trim();
    if (trimmedContent.length === 0) {
      throw new Error("Comment content cannot be empty");
    }
    if (trimmedContent.length > 1000) {
      throw new Error("Comment content cannot exceed 1000 characters");
    }

    // Prevent duplicate replies
    if (args.parentId) {
      const duplicateComment = await ctx.db
        .query("comments")
        .withIndex("by_author", (q) => q.eq("authorId", userId))
        .filter((q) =>
          q.and(
            q.eq(q.field("content"), trimmedContent),
            q.eq(q.field("parentId"), args.parentId),
            q.gt(q.field("_creationTime"), Date.now() - 300_000)
          )
        )
        .first();

      if (duplicateComment) {
        throw new Error(
          "Duplicate comment detected. Please try again with different content."
        );
      }
    }
    const commentId = await ctx.db.insert("comments", {
      postId: args.postId,
      authorId: userId,
      parentId: args.parentId,
      content: trimmedContent,
      likesCount: 0,
    });

    await ctx.db.patch(args.postId, {
      commentsCount: post.commentsCount + 1,
    });

    return commentId;
  },
});

export const updateComment = mutation({
  args: CommentUpdateFields,
  returns: v.null(),
  handler: async (ctx, args) => {
    const userProfile = await getCurrentUserProfile(ctx);
    const userId = userProfile.userId;

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if comment is deleted
    if (comment.deletedAt) {
      throw new Error("Cannot edit deleted comment");
    }

    // Check authorization - only comment owner can edit
    if (comment.authorId !== userId && userProfile.role !== "admin") {
      throw new Error("Not authorized to edit this comment");
    }

    // Validate content
    const trimmedContent = args.content.trim();
    if (trimmedContent.length === 0) {
      throw new Error("Comment content cannot be empty");
    }
    if (trimmedContent.length > 1000) {
      throw new Error("Comment content cannot exceed 1000 characters");
    }

    await ctx.db.patch(args.commentId, {
      content: trimmedContent,
    });

    return null;
  },
});

export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userProfile = await getCurrentUserProfile(ctx);
    const userId = userProfile.userId;

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if comment is already deleted
    if (comment.deletedAt) {
      throw new Error("Comment is already deleted");
    }

    // Check authorization - only comment owner or admin can delete
    if (comment.authorId !== userId && userProfile.role !== "admin") {
      throw new Error("Not authorized to delete this comment");
    }

    // Recursively delete all child comments (replies)
    const deleteChildComments = async (parentId: Id<"comments">): Promise<number> => {
      const childComments = await ctx.db
        .query("comments")
        .withIndex("by_parent", (q) => q.eq("parentId", parentId))
        .filter((q) => q.eq(q.field("deletedAt"), undefined))
        .collect();

      let deletedCount = 0;
      for (const childComment of childComments) {
        // Recursively delete grandchildren
        const grandchildCount = await deleteChildComments(childComment._id);
        deletedCount += grandchildCount;

        // Soft delete the child comment
        await ctx.db.patch(childComment._id, {
          deletedAt: Date.now(),
        });
        deletedCount++;
      }

      return deletedCount;
    };

    // Delete all child comments first
    const deletedChildrenCount = await deleteChildComments(args.commentId);

    // Soft delete the main comment
    await ctx.db.patch(args.commentId, {
      deletedAt: Date.now(),
    });

    // Update post comments count (main comment + all children)
    const totalDeletedCount = 1 + deletedChildrenCount;
    const post = await ctx.db.get(comment.postId);
    if (post) {
      await ctx.db.patch(comment.postId, {
        commentsCount: Math.max(0, post.commentsCount - totalDeletedCount),
      });
    }

    return null;
  },
});

export const getCommentById = query({
  args: { commentId: v.id("comments") },
  returns: v.union(CommentWithAuthorValidator, v.null()),
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.commentId);
    if (!comment || comment.deletedAt) {
      return null;
    }

    const author = await ctx.db.get(comment.authorId);
    return {
      ...comment,
      authorName: author?.name || "Unknown User",
      authorImage: author?.image,
    };
  },
});
