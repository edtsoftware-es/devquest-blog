"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

type CommentFormProps = {
  postId: Id<"posts">;
  parentId?: Id<"comments">;
  onSubmit?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function CommentForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
  placeholder = "Write your comment...",
  autoFocus = false,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createComment = useMutation(api.comments.createComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (trimmedContent.length > 1000) {
      toast.error("Comment cannot exceed 1000 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await createComment({
        postId,
        content: trimmedContent,
        parentId,
      });

      setContent("");
      toast.success(parentId ? "Reply posted!" : "Comment posted!");
      onSubmit?.();
    } catch (error) {
      console.error("Failed to create comment:", error);
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  const remainingChars = 1000 - content.length;

  return (
    <Card className="bg-background">
      <CardContent className="p-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Textarea
              autoFocus={autoFocus}
              className="min-h-24 resize-none"
              disabled={isSubmitting}
              onChange={(e) => setContent(e.target.value)}
              placeholder={placeholder}
              rows={3}
              value={content}
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span
                className={
                  remainingChars < 100
                    ? "text-destructive"
                    : "text-muted-foreground"
                }
              >
                {remainingChars} characters remaining
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="px-4"
              disabled={!content.trim() || isSubmitting}
              size="sm"
              type="submit"
            >
              {isSubmitting ? "Posting..." : parentId ? "Reply" : "Comment"}
            </Button>

            {onCancel && (
              <Button
                disabled={isSubmitting}
                onClick={handleCancel}
                size="sm"
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
