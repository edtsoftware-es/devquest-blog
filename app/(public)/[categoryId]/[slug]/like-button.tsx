"use client";

import { type Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export function LikeButton({
  postId,
  preloadedHasLiked,
  showCount = false,
  likesCount = 0,
  slug,
}: {
  postId: Id<"posts">;
  preloadedHasLiked: Preloaded<typeof api.likes.hasUserLikedPost>;
  showCount?: boolean;
  likesCount?: number;
  slug?: string;
}) {
  const toggleLike = useMutation(api.likes.toggleLike).withOptimisticUpdate(
    (localStore, args) => {
      // Update like status
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

      // Update post like count optimistically
      if (slug) {
        const existingPost = localStore.getQuery(api.posts.getPostBySlug, {
          slug,
        });
        
        if (existingPost) {
          const newLikesCount = current 
            ? Math.max(0, existingPost.likesCount - 1)
            : existingPost.likesCount + 1;
            
          localStore.setQuery(
            api.posts.getPostBySlug,
            { slug },
            {
              ...existingPost,
              likesCount: newLikesCount,
            }
          );
        }
      }
    }
  );

  const hasLiked = usePreloadedQuery(preloadedHasLiked);

  const handleLike = async () => {
    try {
      await toggleLike({ postId });
    } catch (error) {
      // Optimistic update will be reverted on error
      console.debug("Like toggle failed:", error);
    }
  };

  return (
    <Button
      className="gap-2 text-muted-foreground transition-colors hover:text-red-500"
      onClick={handleLike}
      size="sm"
      type="button"
      variant="ghost"
    >
      <Heart
        className={cn(
          "size-4 transition-all",
          hasLiked && "fill-red-500 text-red-500"
        )}
      />
      {showCount && <span className="text-sm">{likesCount}</span>}
      <span className="sr-only">{hasLiked ? "Unlike post" : "Like post"}</span>
    </Button>
  );
}
