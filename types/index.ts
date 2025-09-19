import type { JSX } from "react";
import type { Doc, Id } from "../convex/_generated/dataModel";

export type UserProfile = Doc<"userProfiles">;
export type UserProfileId = Id<"userProfiles">;

export type Post = Doc<"posts">;
export type PostId = Id<"posts">;

export type Category = Doc<"categories">;
export type CategoryId = Id<"categories">;

export type Comment = Doc<"comments">;
export type CommentId = Id<"comments">;

export type Like = Doc<"likes">;
export type LikeId = Id<"likes">;

export type User = Doc<"users">;
export type UserId = Id<"users">;

export type Topic = {
  slug: string;
  name: string;
  image: JSX.Element;
};
