import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  userProfiles: defineTable({
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("user")),
    nickname: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    username: v.string(),
  }).index("by_user", ["userId"]),
  posts: defineTable({
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
    .index("by_author", ["authorId"])
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_tags", ["tags"])
    .index("by_category", ["categoryId"])
    .index("by_published_and_updated", ["published", "updatedAt"])
    .index("by_category_and_published", ["categoryId", "published"])
    .index("by_published_at", ["publishedAt"])
    .index("by_view_count", ["viewCount"])
    .index("by_not_deleted", ["deletedAt"])
    .searchIndex("search_posts", {
      searchField: "content",
      filterFields: ["published", "categoryId", "authorId", "deletedAt"],
    }),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    parentId: v.optional(v.id("comments")),
    content: v.string(),
    deletedAt: v.optional(v.number()),
    likesCount: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentId"])
    .index("by_post_and_parent", ["postId", "parentId"])
    .index("by_not_deleted", ["deletedAt"]),

  likes: defineTable({
    postId: v.optional(v.id("posts")),
    commentId: v.optional(v.id("comments")),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_comment", ["commentId"])
    .index("by_user", ["userId"])
    .index("by_post_and_user", ["postId", "userId"])
    .index("by_comment_and_user", ["commentId", "userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
