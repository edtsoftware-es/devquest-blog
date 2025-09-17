import type { Infer } from "convex/values";
import type {
  CategoryValidator,
  CommentValidator,
  PostInputValidator,
  PostValidator,
  PostWithAuthorDataValidator,
  PostWithAuthorValidator,
  UserWithRoleValidator,
} from "./validators";

export type Post = Infer<typeof PostValidator>;
export type PostWithAuthor = Infer<typeof PostWithAuthorValidator>;
export type PostWithAuthorData = Infer<typeof PostWithAuthorDataValidator>;
export type Category = Infer<typeof CategoryValidator>;
export type Comment = Infer<typeof CommentValidator>;
export type UserWithRole = Infer<typeof UserWithRoleValidator>;
export type PostInput = Infer<typeof PostInputValidator>;

export type PaginatedResult<TItem> = {
  page: TItem[];
  isDone: boolean;
  continueCursor: string | null;
  pageStatus?: string | null;
  splitCursor?: string | null;
};
