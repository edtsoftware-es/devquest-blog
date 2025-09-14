import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getPublishedPosts = query({
  args: {
    paginationOpts: v.optional(paginationOptsValidator),
  },
  returns: v.object({
    page: v.array(
      v.object({
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
      })
    ),
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
  returns: v.union(
    v.object({
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
    }),
    v.null()
  ),
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
    page: v.array(
      v.object({
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
      })
    ),
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
