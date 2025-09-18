"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CommentForm } from "./comment-form";
import { CommentTree } from "./comment-tree";
import { buildCommentTree } from "./utils";

type CommentsContainerProps = {
  postId: Id<"posts">;
  preloadedComments: Preloaded<typeof api.comments.getCommentsWithAuthors>;
  preloadedUser: Preloaded<typeof api.users.getCurrentUserOptional>;
};

export function CommentsContainer({
  postId,
  preloadedComments,
  preloadedUser,
}: CommentsContainerProps) {
  const [showComments, setShowComments] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const commentsData = usePreloadedQuery(preloadedComments);

  const user = usePreloadedQuery(preloadedUser);

  const comments = commentsData.page;
  const commentTree = buildCommentTree(comments);

  const handleCommentSubmitted = () => {
    setShowCommentForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-4 flex items-center gap-2">
          <MessageSquare className="size-5" />
          Comentarios ({comments.length})
        </h2>
        <Button
          className="gap-1"
          onClick={() => setShowComments(!showComments)}
          size="sm"
          variant="ghost"
        >
          {showComments ? (
            <>
              <ChevronUp className="size-4" />
              Ocultar
            </>
          ) : (
            <>
              <ChevronDown className="size-4" />
              Mostrar
            </>
          )}
        </Button>
      </div>

      {showComments && (
        <div className="space-y-6">
          {user ? (
            <div className="space-y-4">
              {showCommentForm ? (
                <CommentForm
                  onCancel={() => setShowCommentForm(false)}
                  onSubmit={handleCommentSubmitted}
                  placeholder="Comparte tus pensamientos..."
                  postId={postId}
                />
              ) : (
                <Button
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setShowCommentForm(true)}
                  variant="outline"
                >
                  Escribe un comentario...
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border bg-muted/50 p-4 text-center">
              <p className="text-muted-foreground text-sm">
                <a className="text-primary hover:underline" href="/auth">
                  Inicia sesión
                </a>{" "}
                para unirte a la conversación
              </p>
            </div>
          )}

          {comments.length > 0 ? (
            <div className="space-y-4">
              <CommentTree
                comments={commentTree}
                currentUser={user}
                postId={postId}
                showLimit={5}
              />
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <MessageSquare className="mx-auto mb-3 size-8 opacity-50" />
              <p>Aún no hay comentarios. ¡Sé el primero en compartir tus pensamientos!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
