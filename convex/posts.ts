import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getCurrentUserProfile, requireAdmin, requireUser } from "./lib/auth";
import { AuthErrors, PostErrors } from "./lib/errors";

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

const PostType = v.object({
  _id: v.id("posts"),
  _creationTime: v.number(),
  title: v.string(),
  image: v.string(),
  duration: v.number(),
  slug: v.string(),
  categoryId: v.id("categories"),
  content: v.string(),
  excerpt: v.string(),
  authorId: v.id("users"),
  tags: v.array(v.string()),
  likesCount: v.number(),
  commentsCount: v.number(),
  published: v.boolean(),
  updatedAt: v.number(),
  publishedAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
  viewCount: v.number(),
});

const PostWithAuthorType = v.object({
  _id: v.id("posts"),
  _creationTime: v.number(),
  title: v.string(),
  image: v.string(),
  duration: v.number(),
  slug: v.string(),
  categoryId: v.id("categories"),
  content: v.string(),
  excerpt: v.string(),
  authorId: v.id("users"),
  authorName: v.string(),
  tags: v.array(v.string()),
  likesCount: v.number(),
  commentsCount: v.number(),
  published: v.boolean(),
  updatedAt: v.number(),
  publishedAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
  viewCount: v.number(),
});

export const getPublishedPosts = query({
  args: {
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.object({
    page: v.array(PostType),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
    pageStatus: v.optional(v.union(v.string(), v.null())),
    splitCursor: v.optional(v.union(v.string(), v.null())),
  }),
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
  returns: v.union(PostType, v.null()),
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
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.object({
    page: v.array(PostType),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
    pageStatus: v.optional(v.union(v.string(), v.null())),
  }),
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
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.object({
    page: v.array(PostType),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
    pageStatus: v.optional(v.union(v.string(), v.null())),
    splitCursor: v.optional(v.union(v.string(), v.null())),
  }),
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
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.object({
    page: v.array(PostType),
    isDone: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
    pageStatus: v.optional(v.union(v.string(), v.null())),
    splitCursor: v.optional(v.union(v.string(), v.null())),
  }),
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
  returns: v.union(PostType, v.null()),
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
  returns: v.array(PostWithAuthorType),
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
  args: {
    title: v.string(),
    image: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    content: v.string(),
    excerpt: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
  },
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
  args: {
    postId: v.id("posts"),
    title: v.string(),
    image: v.string(),
    slug: v.string(),
    categoryId: v.id("categories"),
    content: v.string(),
    excerpt: v.string(),
    tags: v.array(v.string()),
    published: v.boolean(),
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
