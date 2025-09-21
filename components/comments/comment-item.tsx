"use client";

import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Edit, MoreHorizontal, Reply, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { CommentForm } from "./comment-form";
import { CommentLikeButton } from "./comment-like-button";
import type { CommentTree, UserProfile } from "./types";

const PRIORITY_COMMENTS_LIMIT = 5;
const MAX_COMMENT_LENGTH = 1000;
const CHARACTER_WARNING_THRESHOLD = 100;

type CommentItemProps = {
  comment: CommentTree;
  postId: Id<"posts">;
  currentUser?: UserProfile | null;
  level: number;
  index: number;
};

export function CommentItem({
  comment,
  postId,
  currentUser,
  level,
  index,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const updateComment = useMutation(api.comments.updateComment);

  const deleteComment = useMutation(api.comments.deleteComment);
  const isOwner = currentUser?._id === comment.authorId;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSubmit = async (content: string) => {
    try {
      await updateComment({
        commentId: comment._id,
        content: content.trim(),
      });
      setIsEditing(false);
      toast.success("¡Comentario actualizado!");
    } catch (_error) {
      toast.error("Error al actualizar el comentario");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment({
        commentId: comment._id,
      });
      setShowDeleteDialog(false);
      toast.success("Comentario eliminado");
      setIsDeleting(false);
    } catch (_error) {
      toast.error("Error al eliminar el comentario");
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = () => {
    setShowReplyForm(false);
  };

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "rounded-lg border bg-card p-4 transition-colors",
          level > 0 && "bg-muted/20",
          isOwner && "bg-primary/5 ring-1 ring-primary/20"
        )}
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="size-8 shrink-0">
            <AvatarImage
              alt={comment.authorName}
              decoding={index < PRIORITY_COMMENTS_LIMIT ? "sync" : "async"}
              loading={index < PRIORITY_COMMENTS_LIMIT ? "eager" : "lazy"}
              src={comment.authorImage}
            />
            <AvatarFallback className="bg-primary/10 font-medium text-primary text-xs">
              {comment.authorName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-foreground">
                  {comment.authorName}
                </span>
                <span className="text-muted-foreground">·</span>
                <time className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(comment._creationTime), {
                    addSuffix: true,
                    locale: es,
                  })}
                </time>
              </div>

              {/* Actions Menu */}
              {(isOwner || currentUser?.role === "admin") && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="size-8 p-0" size="sm" variant="ghost">
                      <MoreHorizontal className="size-4" />
                      <span className="sr-only">Opciones del comentario</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwner && (
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="mr-2 size-4" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => setShowDeleteDialog(true)}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Content */}
            {isEditing ? (
              <EditCommentForm
                initialContent={comment.content}
                onCancel={handleEditCancel}
                onSubmit={handleEditSubmit}
              />
            ) : (
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {comment.content}
                </p>
              </div>
            )}

            {/* Actions */}
            {!isEditing && (
              <div className="flex items-center gap-2">
                <CommentLikeButton
                  commentId={comment._id}
                  likesCount={comment.likesCount}
                />
                {currentUser && (
                  <Button
                    className="h-auto gap-1 p-1 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowReplyForm(true)}
                    size="sm"
                    variant="ghost"
                  >
                    <Reply className="size-3" />
                    <span className="text-xs">Responder</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="ml-8 sm:ml-11">
          <CommentForm
            autoFocus={true}
            onCancel={() => setShowReplyForm(false)}
            onSubmit={handleReplySubmit}
            parentId={comment._id}
            placeholder={`Responder a ${comment.authorName}...`}
            postId={postId}
          />
        </div>
      )}
      <Dialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar comentario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este comentario? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isDeleting}
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              disabled={isDeleting}
              onClick={handleDelete}
              variant="destructive"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

type EditCommentFormProps = {
  initialContent: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
};

function EditCommentForm({
  initialContent,
  onSubmit,
  onCancel,
}: EditCommentFormProps) {
  const [content, setContent] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await onSubmit(trimmedContent);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = MAX_COMMENT_LENGTH - content.length;

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <textarea
          autoFocus
          className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          value={content}
        />
        <div className="mt-1 text-right text-muted-foreground text-xs">
          <span
            className={
              remainingChars < CHARACTER_WARNING_THRESHOLD
                ? "text-destructive"
                : ""
            }
          >
            {remainingChars} caracteres restantes
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          disabled={
            !content.trim() || isSubmitting || content === initialContent
          }
          size="sm"
          type="submit"
        >
          {isSubmitting ? "Guardando..." : "Guardar"}
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          size="sm"
          type="button"
          variant="ghost"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
