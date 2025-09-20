import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { getCurrentUserProfile, requireAdmin, requireUser } from "./lib/auth";
import { AuthErrors, PostErrors } from "./lib/errors";
import type { PostWithAuthorData } from "./lib/types";
import {
  createPaginatedResultValidator,
  optionalPaginationOpts,
  PostInputFields,
  PostUpdateFields,
  PostValidator,
  PostWithAuthorValidator,
} from "./lib/validators";

const WORDS_PER_MINUTE = 200;
const WEEKLY_TRENDING_POSTS_LIMIT = 4;
export const HOME_POSTS_LIMIT = 5;
const POPULAR_SLICE_START = 1;
const POPULAR_SLICE_END = 3;
const DEFAULT_POSTS_PER_PAGE = 8;

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
    .query("users")
    .withIndex("by_id", (q) => q.eq("_id", userId))
    .unique();

  if (!userProfile) {
    throw AuthErrors.userNotFound();
  }

  return userProfile;
}

export const getHomePosts = query({
  args: {},
  handler: async (ctx) => {
    const _posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(HOME_POSTS_LIMIT);

    const mainPosts = await Promise.all(
      _posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          authorName: author?.name || "Usuario desconocido",
          authorImage: author?.image || "",
        };
      })
    );

    const _popularPosts = await ctx.db
      .query("posts")
      .withIndex("by_view_count")
      .order("desc")
      .filter((q) => q.eq(q.field("published"), true))
      .take(HOME_POSTS_LIMIT);

    const mainPopularPostAuthor = await ctx.db.get(_popularPosts[0].authorId);

    const mainPopularPost: PostWithAuthorData = {
      ..._popularPosts[0],
      authorName: mainPopularPostAuthor?.name || "Usuario desconocido",
      authorImage: mainPopularPostAuthor?.image || "",
    };

    const highLightPosts = _popularPosts.slice(
      POPULAR_SLICE_START,
      POPULAR_SLICE_END
    );
    const compactPosts = _popularPosts.slice(
      POPULAR_SLICE_END,
      HOME_POSTS_LIMIT
    );

    const weeklys = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(HOME_POSTS_LIMIT);

    const allPublishedPosts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    const tagCount = new Map<string, number>();

    for (const post of allPublishedPosts) {
      for (const tag of post.tags) {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      }
    }

    const popularTags = Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      mainPosts,
      mainPopularPost,
      highLightPosts,
      compactPosts,
      weeklys,
      popularTags,
    };
  },
});

export const getPopularTags = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const DEFAULT_LIMIT = 10;
    const limit = args.limit ?? DEFAULT_LIMIT;

    const allPublishedPosts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .collect();

    const tagCount = new Map<string, number>();

    for (const post of allPublishedPosts) {
      for (const tag of post.tags) {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      }
    }

    const popularTags = Array.from(tagCount.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return popularTags;
  },
});

export const getPublishedPosts = query({
  args: {
    paginationOpts: optionalPaginationOpts,
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });

    return posts;
  },
});

export const getPublishedAuthorPosts = query({
  args: {
    paginationOpts: optionalPaginationOpts,
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });

    const postsWithAuthors = await Promise.all(
      posts.page.map(async (post) => {
        const author = await ctx.db.get(post.authorId);
        return {
          ...post,
          authorName: author?.name || "Usuario desconocido",
          authorImage: author?.image || "",
        };
      })
    );

    return { ...posts, page: postsWithAuthors };
  },
});

export const getPostBySlug = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const getPostBySlugWithAuthor = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!post) {
      return null;
    }

    const author = await ctx.db.get(post.authorId);

    return {
      ...post,
      authorName: author?.name || "Usuario desconocido",
      authorImage: author?.image,
    };
  },
});

export const getPdpPost = query({
  args: {
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!post) {
      return null;
    }

    const author = await ctx.db.get(post.authorId);
    const category = await ctx.db.get(post.categoryId);
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", post.authorId))
      .unique();

    if (!author) {
      return null;
    }
    if (!category) {
      return null;
    }

    // Obtener los últimos 4 posts ordenados por fecha y con más vistas
    const weeklyTrendingPosts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .take(WEEKLY_TRENDING_POSTS_LIMIT);

    const trendingPostsWithDetails = weeklyTrendingPosts.map(
      (trendingPost) => ({
        _id: trendingPost._id,
        title: trendingPost.title,
        slug: trendingPost.slug,
        _creationTime: trendingPost._creationTime,
        duration: trendingPost.duration,
        image: trendingPost.image,
      })
    );

    return {
      ...post,
      author: {
        ...author,
        role: user?.role || "user",
        userProfileId: user?._id,
      },
      category,
      weeklyTrendingPosts: trendingPostsWithDetails,
    };
  },
});

export const getPostsByCategoryId = query({
  args: {
    categoryId: v.id("categories"),
    paginationOpts: optionalPaginationOpts,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId))
      .order("desc")
      .paginate(args.paginationOpts ?? { numItems: 10, cursor: null });
  },
});

export const getPaginatedPostsWithAuthorByNickname = query({
  args: {
    nickname: v.string(),
    page: v.optional(v.number()),
    postsPerPage: v.optional(v.number()),
  },

  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_nickname", (q) => q.eq("nickname", args.nickname))
      .unique();

    if (!user) {
      throw AuthErrors.userNotFound();
    }

    const currentPage = args.page || 1;
    const postsPerPage = args.postsPerPage || DEFAULT_POSTS_PER_PAGE;
    const offset = (currentPage - 1) * postsPerPage;

    const allPosts = await ctx.db
      .query("posts")
      .withIndex("by_author_published", (q) => q.eq("authorId", user._id))
      .filter((q) => q.eq(q.field("published"), true))
      .order("desc")
      .collect();

    const totalPosts = allPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    const paginatedPosts = allPosts.slice(offset, offset + postsPerPage);

    const postsWithAuthorData = paginatedPosts.map((post) => ({
      ...post,
      authorName: user.name || "Usuario desconocido",
      authorImage: user.image || "",
    }));

    return {
      author: {
        username: user.name,
        nickname: user.nickname,
        avatarUrl: user.image,
        bio: user.bio,
      },
      posts: postsWithAuthorData,
      totalPosts,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
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
    const userId = userProfile._id;

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
    const userId = userProfile._id;

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

    const userId = userProfile._id;
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
    const userId = userProfile._id;

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
    const userId = userProfile._id;

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
    const userId = userProfile._id;

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
    const userId = userProfile._id;

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

const MAX_RECOMMENDED_POSTS = 5;

export const recommendedPosts = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return await ctx.db
        .query("posts")
        .withIndex("by_view_count")
        .order("desc")
        .filter((q) => q.eq(q.field("published"), true))
        .take(MAX_RECOMMENDED_POSTS);
    }

    const likes = await ctx.db
      .query("likes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const likedPostIds = likes.map((like) => like.postId).filter(Boolean);

    if (likedPostIds.length === 0) {
      return await ctx.db
        .query("posts")
        .withIndex("by_view_count")
        .order("desc")
        .filter((q) => q.eq(q.field("published"), true))
        .take(MAX_RECOMMENDED_POSTS);
    }

    const likedPosts = await Promise.all(
      likedPostIds.map((postId) => ctx.db.get(postId as Id<"posts">))
    );

    const categoryCount = new Map();
    for (const post of likedPosts) {
      if (post?.categoryId) {
        categoryCount.set(
          post.categoryId,
          (categoryCount.get(post.categoryId) || 0) + 1
        );
      }
    }

    const favoriteCategories = Array.from(categoryCount.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([categoryId]) => categoryId);

    const recommended: PostWithAuthorData[] = [];
    for (const categoryId of favoriteCategories) {
      if (recommended.length >= MAX_RECOMMENDED_POSTS) {
        break;
      }

      const posts = await ctx.db
        .query("posts")
        .withIndex("by_category_and_published", (q) =>
          q.eq("categoryId", categoryId).eq("published", true)
        )
        .order("desc")
        .collect();

      for (const post of posts) {
        if (
          !likedPostIds.some((id) => id && id === post._id) &&
          recommended.length < MAX_RECOMMENDED_POSTS
        ) {
          recommended.push({
            ...post,
            authorName: post.authorId,
            authorImage: post.authorId,
          });
        }
      }
    }

    return recommended.slice(0, MAX_RECOMMENDED_POSTS);
  },
});
