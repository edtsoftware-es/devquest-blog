import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { query } from "./_generated/server";

async function getUserProfile(ctx: QueryCtx, userId: Id<"users">) {
  const userProfile = await ctx.db
    .query("userProfiles")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .unique();

  if (!userProfile) {
    throw new Error("Perfil de usuario no encontrado");
  }

  return userProfile;
}

async function ensureUserIsAuthenticated(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Usuario no autenticado");
  }
  return userId;
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
    const userId = await ensureUserIsAuthenticated(ctx);
    const userProfile = await getUserProfile(ctx, userId);

    if (userProfile.role !== "admin") {
      throw new Error("Acceso denegado: se requiere rol de administrador");
    }

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
    const userId = await ensureUserIsAuthenticated(ctx);
    const userProfile = await getUserProfile(ctx, userId);

    if (userProfile.role !== "user") {
      throw new Error("Acceso denegado: se requiere rol de usuario");
    }

    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});

export const getPostsByUserRole = query({
  args: {},
  returns: v.array(PostType),
  handler: async (ctx) => {
    const userId = await ensureUserIsAuthenticated(ctx);
    const userProfile = await getUserProfile(ctx, userId);

    if (userProfile.role === "admin") {
      return await ctx.db.query("posts").order("desc").take(10);
    }

    return await ctx.db
      .query("posts")
      .withIndex("by_author", (q) => q.eq("authorId", userId))
      .order("desc")
      .take(10);
  },
});
