import type { Id } from "@/convex/_generated/dataModel";

export type CommentWithAuthor = {
  _id: Id<"comments">;
  _creationTime: number;
  postId: Id<"posts">;
  authorId: Id<"users">;
  parentId?: Id<"comments">;
  content: string;
  deletedAt?: number;
  likesCount: number;
  authorName: string;
  authorImage?: string;
};

export interface CommentTree extends CommentWithAuthor {
  replies: CommentTree[];
  level: number;
}

export type UserProfile = {
  _id: Id<"users">;
  name?: string;
  email?: string;
  image?: string;
  role: string;
};
