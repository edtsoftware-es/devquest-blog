"use client";

import type { Preloaded } from "convex/react";
import { CommentsContainer } from "@/components/comments/comments-container";
import { CommentsErrorBoundary } from "@/components/comments/error-boundary";
import type { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type CommentsSectionProps = {
  postId: Id<"posts">;
  preloadedPost: Preloaded<typeof api.posts.getPdpPost>;
  preloadedUser: Preloaded<typeof api.users.getCurrentUserOptional>;
};

export function CommentsSection({
  postId,
  preloadedPost,
  preloadedUser,
}: CommentsSectionProps) {
  return (
    <div className="mt-12">
      <CommentsErrorBoundary>
        <CommentsContainer
          postId={postId}
          preloadedPost={preloadedPost}
          preloadedUser={preloadedUser}
        />
      </CommentsErrorBoundary>
    </div>
  );
}
