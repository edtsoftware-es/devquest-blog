import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getCurrentUserProfile, requireAdmin, requireUser } from "./lib/auth";
import { AuthErrors, PostErrors } from "./lib/errors";
import {
  createPaginatedResultValidator,
  optionalPaginationOpts,
  PostInputFields,
  PostUpdateFields,
  PostValidator,
  PostWithAuthorValidator,
} from "./lib/validators";

const WORDS_PER_MINUTE = 200;

export function calculateReadingDuration(content: string): number {
  const cleanContent = content
    .replace(/<[^>]*>/g, "")
    .replace(/[#*_`~[\]()]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = cleanContent
    .split(" ")
    .filter((word) => word.length > 0).length;

  const duration = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return duration;
}

export async function getUserProfile(ctx: QueryCtx, userId: Id<"users">) {
  const userProfile = await ctx.db
    .query("userProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  if (!userProfile) {
    throw AuthErrors.profileNotFound();
  }

  return userProfile;
}

export const getPublishedPosts = query({
  args: {
    paginationOpts: optionalPaginationOpts,
  },
  returns: createPaginatedResultValidator(PostValidator),
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });

    return posts;
  },
});

export const getPostBySlug = query({
  args: {
    slug: v.string(),
  },
  returns: v.union(PostValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getPostsByCategoryId = query({
  args: {
    categoryId: v.id("categories"),
    paginationOpts: optionalPaginationOpts,
  },
  returns: createPaginatedResultValidator(PostValidator),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});

export const getAdminPosts = query({
  args: {
    paginationOpts: optionalPaginationOpts,
  },
  returns: createPaginatedResultValidator(PostValidator),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    return await ctx.db
      .query("posts")
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});

export const getUserPosts = query({
  args: {
    paginationOpts: optionalPaginationOpts,
  },
  returns: createPaginatedResultValidator(PostValidator),
  handler: async (ctx, args) => {
    const userProfile = await requireUser(ctx);
    const userId = userProfile.userId;

    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});

export const getPostById = query({
  args: { postId: v.id("posts") },
  returns: v.union(PostValidator, v.null()),
  handler: async (ctx, args) => {
    const userProfile = await getCurrentUserProfile(ctx);
    const userId = userProfile.userId;

    const post = await ctx.db.get(args.postId);
    if (!post) {
      return null;
    }

    if (userProfile.role !== "admin" && post.authorId !== userId) {
      throw PostErrors.cannotEdit();
    }

    return post;
  },
});

export const getPostsByUserRole = query({
  args: {},
  returns: v.array(PostWithAuthorValidator),
  handler: async (ctx) => {
    const userProfile = await getCurrentUserProfile(ctx);

    if (userProfile.role === "admin") {
      const posts = await ctx.db.query("posts").order("desc").collect();

      const postsWithAuthors = await Promise.all(
        posts.map(async (post) => {
          const author = await ctx.db.get(post.authorId);
          return {
            ...post,
            authorName: author?.name || "Usuario desconocido",
          };
        })
      );

      return postsWithAuthors;
    }

    const userId = userProfile.userId;
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .collect();

    return posts.map((post) => ({
      ...post,
      authorName: "",
    }));
  },
});

export const createPost = mutation({
  args: PostInputFields,
  returns: v.id("posts"),
  handler: async (ctx, args) => {
    const userProfile = await requireUser(ctx);
    const userId = userProfile.userId;

    const duration = calculateReadingDuration(args.content);
    const now = Date.now();

    return await ctx.db.insert("posts", {
      title: args.title,
      image: args.image,
      duration,
      slug: args.slug,
      categoryId: args.categoryId,
      content: args.content,
      excerpt: args.excerpt,
      authorId: userId,
      tags: args.tags,
      likesCount: 0,
      commentsCount: 0,
      published: args.published,
      updatedAt: now,
      publishedAt: args.published ? now : undefined,
      viewCount: 0,
    });
  },
});

export const updatePost = mutation({
  args: PostUpdateFields,
  returns: v.null(),
  handler: async (ctx, args) => {
    const userProfile = await getCurrentUserProfile(ctx);
    const userId = userProfile.userId;

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw PostErrors.notFound();
    }

    if (userProfile.role !== "admin" && post.authorId !== userId) {
      throw PostErrors.cannotEdit();
    }

    const duration = calculateReadingDuration(args.content);
    const now = Date.now();

    await ctx.db.patch(args.postId, {
      title: args.title,
      image: args.image,
      duration,
      slug: args.slug,
      categoryId: args.categoryId,
      content: args.content,
      excerpt: args.excerpt,
      tags: args.tags,
      published: args.published,
      updatedAt: now,
      publishedAt: args.published && !post.published ? now : post.publishedAt,
    });

    return null;
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userProfile = await getCurrentUserProfile(ctx);
    const userId = userProfile.userId;

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw PostErrors.notFound();
    }

    if (userProfile.role === "admin") {
      await ctx.db.delete(args.postId);
      return null;
    }

    if (post.authorId !== userId) {
      throw PostErrors.cannotDelete();
    }

    await ctx.db.delete(args.postId);
    return null;
  },
});

export const togglePostPublished = mutation({
  args: {
    postId: v.id("posts"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userProfile = await getCurrentUserProfile(ctx);
    const userId = userProfile.userId;

    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw PostErrors.notFound();
    }

    if (userProfile.role !== "admin" && post.authorId !== userId) {
      throw PostErrors.cannotEdit();
    }

    const now = Date.now();
    const newPublishedState = !post.published;

    await ctx.db.patch(args.postId, {
      published: newPublishedState,
      updatedAt: now,
      publishedAt: newPublishedState ? now : undefined,
    });

    return null;
  },
});
