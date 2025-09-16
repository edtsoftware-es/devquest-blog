import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import type { GenericValidator } from "convex/values";

const optionalCursor = v.union(v.string(), v.null());

export const PostFields = {
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
} as const;

export const PostValidator = v.object(PostFields);

export const PostWithAuthorValidator = v.object({
  ...PostFields,
  authorName: v.string(),
});

export const CategoryValidator = v.object({
  _id: v.id("categories"),
  _creationTime: v.number(),
  name: v.string(),
  slug: v.string(),
  description: v.string(),
});

export const CommentValidator = v.object({
  _id: v.id("comments"),
  _creationTime: v.number(),
  postId: v.id("posts"),
  authorId: v.id("users"),
  parentId: v.optional(v.id("comments")),
  content: v.string(),
  deletedAt: v.optional(v.number()),
  likesCount: v.number(),
});

export const UserWithRoleValidator = v.object({
  _id: v.id("users"),
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  image: v.optional(v.string()),
  role: v.string(),
});

export const PostInputFields = {
  title: v.string(),
  image: v.string(),
  slug: v.string(),
  categoryId: v.id("categories"),
  content: v.string(),
  excerpt: v.string(),
  tags: v.array(v.string()),
  published: v.boolean(),
} as const;

export const PostInputValidator = v.object(PostInputFields);

export const PostUpdateFields = {
  postId: v.id("posts"),
  ...PostInputFields,
} as const;

export const PostUpdateValidator = v.object(PostUpdateFields);

export const optionalPaginationOpts = v.optional(paginationOptsValidator);

export const createPaginatedResultValidator = <
  TItem extends GenericValidator,
>(itemValidator: TItem) =>
  v.object({
    page: v.array(itemValidator),
    isDone: v.boolean(),
    continueCursor: optionalCursor,
    pageStatus: v.optional(optionalCursor),
    splitCursor: v.optional(optionalCursor),
  });
