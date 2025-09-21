"use client";

import { useMutation } from "convex/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const MAX_COMMENT_LENGTH = 1000;
const WARNING_THRESHOLD = 100;

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const createComment = useMutation(api.comments.createComment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error("El comentario no puede estar vacío");
      return;
    }

    if (trimmedContent.length > MAX_COMMENT_LENGTH) {
      toast.error(
        `El comentario no puede exceder ${MAX_COMMENT_LENGTH} caracteres`
      );
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
      toast.success(
        parentId ? "Respuesta publicada!" : "Comentario publicado!"
      );
      onSubmit?.();
    } catch {
      toast.error(
        "Error al publicar el comentario. Por favor, intenta nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setContent("");
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (content.trim() && !isSubmitting) {
        handleSubmit(e as any);
      }
    }
  };

  const remainingChars = MAX_COMMENT_LENGTH - content.length;

  const getButtonText = () => {
    if (isSubmitting) {
      return "Guardando...";
    }
    if (parentId) {
      return "Responder";
    }
    return "Comentar";
  };

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
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              ref={textareaRef}
              rows={3}
              value={content}
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span
                className={
                  remainingChars < WARNING_THRESHOLD
                    ? "text-destructive"
                    : "text-muted-foreground"
                }
              >
                {remainingChars} caracteres restantes
              </span>
              <span className="text-muted-foreground">
                {navigator.platform.toLowerCase().includes("mac")
                  ? "⌘"
                  : "Ctrl"}
                +Enter para enviar
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
              {getButtonText()}
            </Button>

            {onCancel && (
              <Button
                disabled={isSubmitting}
                onClick={handleCancel}
                size="sm"
                type="button"
                variant="ghost"
              >
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
