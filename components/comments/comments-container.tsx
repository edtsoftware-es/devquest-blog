"use client";

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import type { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CommentForm } from "./comment-form";
import { CommentTree } from "./comment-tree";
import type { UserProfile } from "./types";
import { buildCommentTree } from "./utils";

type CommentsContainerProps = {
  postId: Id<"posts">;
  preloadedComments: Preloaded<typeof api.comments.getCommentsWithAuthors>;
  preloadedUser: Preloaded<typeof api.users.getCurrentUserOptional>;
  slug?: string;
};

export function CommentsContainer({
  postId,
  preloadedComments,
  preloadedUser,
  slug,
}: CommentsContainerProps) {
  const [showComments, setShowComments] = useState(true);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const commentsData = usePreloadedQuery(preloadedComments);
  
  // User is null if not authenticated, UserProfile if authenticated
  const user = usePreloadedQuery(preloadedUser);

  const comments = commentsData.page;
  const commentTree = buildCommentTree(comments);

  const handleCommentSubmitted = () => {
    setShowCommentForm(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="size-5" />
            Comments ({comments.length})
          </CardTitle>
          <Button
            className="gap-1"
            onClick={() => setShowComments(!showComments)}
            size="sm"
            variant="ghost"
          >
            {showComments ? (
              <>
                <ChevronUp className="size-4" />
                Hide
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                Show
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {showComments && (
        <CardContent>
          <div className="space-y-6">
            {user ? (
              <div className="space-y-4">
                {showCommentForm ? (
                  <CommentForm
                    onCancel={() => setShowCommentForm(false)}
                    onSubmit={handleCommentSubmitted}
                    placeholder="Share your thoughts..."
                    postId={postId}
                  />
                ) : (
                  <Button
                    className="w-full justify-start text-muted-foreground"
                    onClick={() => setShowCommentForm(true)}
                    variant="outline"
                  >
                    Write a comment...
                  </Button>
                )}
              </div>
            ) : (
              <Card className="bg-muted/50">
                <CardContent className="py-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    <a className="text-primary hover:underline" href="/auth">
                      Sign in
                    </a>{" "}
                    to join the conversation
                  </p>
                </CardContent>
              </Card>
            )}

            {comments.length > 0 ? (
              <div className="space-y-4">
                <CommentTree
                  comments={commentTree}
                  currentUser={user}
                  postId={postId}
                  showLimit={5}
                  slug={slug}
                />
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <MessageSquare className="mx-auto mb-3 size-8 opacity-50" />
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}