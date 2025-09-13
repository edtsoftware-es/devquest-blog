import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  posts: defineTable({
    title: v.string(),
    image: v.string(),
    duration: v.optional(v.number()),
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
  })
    .index("by_author", ["authorId"])
    .index("by_slug", ["slug"])
    .index("by_published", ["published"])
    .index("by_tags", ["tags"])
    .index("by_category", ["categoryId"]),

  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_name", ["name"]),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.id("users"),
    content: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_author", ["authorId"]),

  likes: defineTable({
    postId: v.id("posts"),
    userId: v.id("users"),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_and_user", ["postId", "userId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
