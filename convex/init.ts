import { faker } from "@faker-js/faker";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { calculateReadingDuration } from "./posts";

const DEFAULT_USERS_COUNT = 10;
const DEFAULT_CATEGORIES_COUNT = 5;
const DEFAULT_POSTS_COUNT = 20;
const DEFAULT_COMMENTS_COUNT = 50;
const DEFAULT_LIKES_COUNT = 100;
const COMMENT_REPLY_PROBABILITY = 0.2;
const POST_PUBLISHED_PROBABILITY = 0.8;

type FakeDataCounts = {
  usersCount: number;
  categoriesCount: number;
  postsCount: number;
  commentsCount: number;
  likesCount: number;
};

async function createUsers(
  ctx: MutationCtx,
  count: number
): Promise<Id<"users">[]> {
  const userIds: Id<"users">[] = [];
  for (let i = 0; i < count; i++) {
    const userId = await ctx.db.insert("users", {
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      email: faker.internet.email(),
      emailVerificationTime: Date.now(),
    });
    userIds.push(userId);
  }
  return userIds;
}

async function createCategories(
  ctx: MutationCtx,
  count: number
): Promise<Id<"categories">[]> {
  const categoryIds: Id<"categories">[] = [];
  const categories = [
    {
      name: "Tecnología",
      description: "Artículos sobre tecnología y programación",
    },
    { name: "Ciencia", description: "Descubrimientos científicos y avances" },
    { name: "Arte", description: "Expresiones artísticas y cultura" },
    { name: "Deportes", description: "Noticias y análisis deportivos" },
    { name: "Viajes", description: "Destinos y experiencias de viaje" },
  ];

  for (let i = 0; i < count; i++) {
    const category = categories[i] || {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
    };

    const categoryId = await ctx.db.insert("categories", {
      name: category.name,
      slug: category.name.toLowerCase().replace(/\s+/g, "-"),
      description: category.description,
    });
    categoryIds.push(categoryId);
  }
  return categoryIds;
}

async function createPosts(
  ctx: MutationCtx,
  count: number,
  userIds: Id<"users">[],
  categoryIds: Id<"categories">[]
): Promise<Id<"posts">[]> {
  const postIds: Id<"posts">[] = [];
  for (let i = 0; i < count; i++) {
    const title = faker.lorem.sentence({ min: 3, max: 8 });
    const content = faker.lorem.paragraphs({ min: 4, max: 40 }, "\n\n");
    const duration = calculateReadingDuration(content);
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    const tags = Array.from(
      { length: faker.number.int({ min: 1, max: 4 }) },
      () => faker.lorem.word()
    );

    const published = faker.datatype.boolean({
      probability: POST_PUBLISHED_PROBABILITY,
    });

    const postId = await ctx.db.insert("posts", {
      title,
      image: faker.image.url({ width: 800, height: 400 }),
      duration,
      slug,
      categoryId: faker.helpers.arrayElement(categoryIds),
      content,
      excerpt: faker.lorem.paragraph(),
      authorId: faker.helpers.arrayElement(userIds),
      tags,
      likesCount: 0,
      commentsCount: 0,
      published,
      updatedAt: Date.now(),
      publishedAt: published ? Date.now() : undefined,
      deletedAt: undefined,
      viewCount: faker.number.int({ min: 0, max: 1000 }),
    });
    postIds.push(postId);
  }
  return postIds;
}

async function createComments(
  ctx: MutationCtx,
  count: number,
  userIds: Id<"users">[],
  postIds: Id<"posts">[]
): Promise<number> {
  let commentsCreated = 0;
  for (let i = 0; i < count; i++) {
    const postId = faker.helpers.arrayElement(postIds);
    const authorId = faker.helpers.arrayElement(userIds);

    let parentId: Id<"comments"> | undefined;
    if (faker.datatype.boolean({ probability: COMMENT_REPLY_PROBABILITY })) {
      const existingComments = await ctx.db
        .query("comments")
        .withIndex("by_post", (q) => q.eq("postId", postId))
        .collect();

      if (existingComments.length > 0) {
        const randomComment = faker.helpers.arrayElement(existingComments);
        parentId = randomComment._id;
      }
    }

    await ctx.db.insert("comments", {
      postId,
      authorId,
      parentId,
      content: faker.lorem.paragraph(),
      deletedAt: undefined,
      likesCount: 0,
    });
    commentsCreated++;

    const post = await ctx.db.get(postId);
    if (post) {
      await ctx.db.patch(postId, {
        commentsCount: post.commentsCount + 1,
      });
    }
  }
  return commentsCreated;
}

async function createLikes(
  ctx: MutationCtx,
  count: number,
  userIds: Id<"users">[],
  postIds: Id<"posts">[]
): Promise<number> {
  let likesCreated = 0;
  const likedPosts = new Set<string>();

  for (let i = 0; i < count; i++) {
    const postId = faker.helpers.arrayElement(postIds);
    const userId = faker.helpers.arrayElement(userIds);
    const likeKey = `${postId}-${userId}`;

    if (!likedPosts.has(likeKey)) {
      await ctx.db.insert("likes", {
        postId,
        commentId: undefined,
        userId,
      });
      likedPosts.add(likeKey);
      likesCreated++;

      const post = await ctx.db.get(postId);
      if (post) {
        await ctx.db.patch(postId, {
          likesCount: post.likesCount + 1,
        });
      }
    }
  }
  return likesCreated;
}

const createFakeData = internalMutation({
  args: {
    usersCount: v.optional(v.number()),
    categoriesCount: v.optional(v.number()),
    postsCount: v.optional(v.number()),
    commentsCount: v.optional(v.number()),
    likesCount: v.optional(v.number()),
  },
  returns: v.object({
    usersCreated: v.number(),
    categoriesCreated: v.number(),
    postsCreated: v.number(),
    commentsCreated: v.number(),
    likesCreated: v.number(),
  }),
  handler: async (ctx, args) => {
    const counts: FakeDataCounts = {
      usersCount: args.usersCount ?? DEFAULT_USERS_COUNT,
      categoriesCount: args.categoriesCount ?? DEFAULT_CATEGORIES_COUNT,
      postsCount: args.postsCount ?? DEFAULT_POSTS_COUNT,
      commentsCount: args.commentsCount ?? DEFAULT_COMMENTS_COUNT,
      likesCount: args.likesCount ?? DEFAULT_LIKES_COUNT,
    };

    const userIds = await createUsers(ctx, counts.usersCount);
    const categoryIds = await createCategories(ctx, counts.categoriesCount);
    const postIds = await createPosts(
      ctx,
      counts.postsCount,
      userIds,
      categoryIds
    );
    const commentsCreated = await createComments(
      ctx,
      counts.commentsCount,
      userIds,
      postIds
    );
    const likesCreated = await createLikes(
      ctx,
      counts.likesCount,
      userIds,
      postIds
    );

    return {
      usersCreated: counts.usersCount,
      categoriesCreated: counts.categoriesCount,
      postsCreated: counts.postsCount,
      commentsCreated,
      likesCreated,
    };
  },
});

export default createFakeData;
