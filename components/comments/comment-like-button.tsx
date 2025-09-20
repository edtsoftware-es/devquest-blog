"use client";

import { useMutation, useQuery } from "convex/react";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type CommentLikeButtonProps = {
  commentId: Id<"comments">;
  likesCount: number;
  className?: string;
};

export function CommentLikeButton({
  commentId,
  likesCount,
  className,
}: CommentLikeButtonProps) {
  const hasLiked = useQuery(api.likes.hasUserLikedComment, { commentId });
  const toggleLike = useMutation(api.likes.toggleCommentLike);

  const handleLike = async () => {
    try {
      await toggleLike({ commentId });
    } catch {
      toast.error("Error al procesar el like");
    }
  };

  // No mostrar el botón si no hay usuario autenticado
  if (hasLiked === undefined) {
    return null;
  }

  return (
    <Button
      className={cn(
        "h-auto gap-1 p-1 text-muted-foreground hover:text-foreground",
        hasLiked && "text-red-500 hover:text-red-600",
        className
      )}
      onClick={handleLike}
      size="sm"
      variant="ghost"
    >
      <Heart className={cn("size-3", hasLiked && "fill-current")} />
      <span className="text-xs">{likesCount > 0 ? likesCount : ""}</span>
    </Button>
  );
}
