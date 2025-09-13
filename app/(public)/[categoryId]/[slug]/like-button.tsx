"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export function LikeButton({
  postId,
  preloadedHasLiked,
}: {
  postId: Id<"posts">;
  preloadedHasLiked: Preloaded<typeof api.likes.hasUserLikedPost>;
}) {
  const toggleLike = useMutation(api.likes.toggleLike).withOptimisticUpdate(
    (localStore, args) => {
      const current = localStore.getQuery(api.likes.hasUserLikedPost, {
        postId: args.postId,
      });
      if (current !== undefined) {
        localStore.setQuery(
          api.likes.hasUserLikedPost,
          { postId: args.postId },
          !current
        );
      }
    }
  );
  const hasLiked = usePreloadedQuery(preloadedHasLiked);
  return (
    <button onClick={() => toggleLike({ postId })} type="button">
      {hasLiked ? "Unlike" : "Like"}
    </button>
  );
}
