"use client";

import { useMutation } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { Edit, MoreHorizontal, Reply, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import type { CommentTree, UserProfile } from "./types";

type CommentItemProps = {
  comment: CommentTree;
  postId: Id<"posts">;
  currentUser?: UserProfile | null;
  level: number;
  slug?: string;
  index: number;
};

export function CommentItem({
  comment,
  postId,
  currentUser,
  level,
  slug,
  index,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateComment = useMutation(api.comments.updateComment).withOptimisticUpdate(
    (localStore, args) => {
      // Update comment content optimistically
      const existingComments = localStore.getQuery(api.comments.getCommentsWithAuthors, {
        postId,
      });
      
      if (existingComments) {
        const updatedComments = existingComments.page.map(comment => 
          comment._id === args.commentId 
            ? { ...comment, content: args.content }
            : comment
        );
        
        localStore.setQuery(
          api.comments.getCommentsWithAuthors,
          { postId },
          {
            ...existingComments,
            page: updatedComments,
          }
        );
      }
    }
  );

  const deleteComment = useMutation(api.comments.deleteComment).withOptimisticUpdate(
    (localStore, args) => {
      // Mark comment and all its replies as deleted optimistically
      const existingComments = localStore.getQuery(api.comments.getCommentsWithAuthors, {
        postId,
      });
      
      if (existingComments) {
        const markCommentAndRepliesAsDeleted = (commentId: string, comments: any[]): any[] => {
          return comments.map(comment => {
            if (comment._id === commentId) {
              // Mark this comment as deleted
              return { ...comment, deletedAt: Date.now() };
            } else if (comment.parentId === commentId) {
              // Mark replies as deleted and recursively mark their replies
              const updatedComment = { ...comment, deletedAt: Date.now() };
              return {
                ...updatedComment,
                replies: markCommentAndRepliesAsDeleted(comment._id, comment.replies || [])
              };
            } else if (comment.replies && comment.replies.length > 0) {
              // Recursively check replies
              return {
                ...comment,
                replies: markCommentAndRepliesAsDeleted(commentId, comment.replies)
              };
            }
            return comment;
          });
        };

        const updatedComments = markCommentAndRepliesAsDeleted(args.commentId, existingComments.page);
        
        localStore.setQuery(
          api.comments.getCommentsWithAuthors,
          { postId },
          {
            ...existingComments,
            page: updatedComments,
          }
        );
      }

      // Update post comment count optimistically (we'll estimate the count)
      if (slug) {
        const existingPost = localStore.getQuery(api.posts.getPostBySlug, {
          slug,
        });
        
        if (existingPost) {
          // Estimate: assume at least 1 comment deleted (the main comment)
          // The actual count will be corrected when the server responds
          localStore.setQuery(
            api.posts.getPostBySlug,
            { slug },
            {
              ...existingPost,
              commentsCount: Math.max(0, existingPost.commentsCount - 1),
            }
          );
        }
      }
    }
  );

  const isOwner = currentUser?._id === comment.authorId;
  const isDeleted = !!comment.deletedAt;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSubmit = async (content: string) => {
    try {
      void updateComment({
        commentId: comment._id,
        content: content.trim(),
      });
      setIsEditing(false);
      toast.success("Comment updated!");
    } catch (error) {
      console.error("Failed to update comment:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      void deleteComment({
        commentId: comment._id,
      });
      setShowDeleteDialog(false);
      toast.success("Comment deleted"); 
      setIsDeleting(false);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      toast.error("Failed to delete comment");
      setIsDeleting(false);
    }
  };

  const handleReplySubmit = () => {
    setShowReplyForm(false);
  };

  // Don't render deleted comments at all
  if (isDeleted) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Card className={cn(
        "transition-colors", 
        level > 0 && "bg-muted/20",
        isOwner && "ring-1 ring-primary/20 bg-primary/5"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <Avatar className="size-8 shrink-0">
              <AvatarImage 
                alt={comment.authorName} 
                src={comment.authorImage}
                decoding={index < 5 ? "sync" : "async"}
                loading={index < 5 ? "eager" : "lazy"}
              />
              <AvatarFallback className="bg-primary/10 font-medium text-primary text-xs">
                {comment.authorName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{comment.authorName}</span>
                  <span className="text-muted-foreground">·</span>
                  <time className="text-muted-foreground">
                    {formatDistanceToNow(new Date(comment._creationTime), {
                      addSuffix: true,
                    })}
                  </time>
                </div>

                {/* Actions Menu */}
                {(isOwner || currentUser?.role === "admin") && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="size-8 p-0" size="sm" variant="ghost">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Comment options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {isOwner && (
                        <DropdownMenuItem onClick={handleEdit}>
                          <Edit className="mr-2 size-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Delete
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
                  <p className="whitespace-pre-wrap">{comment.content}</p>
                </div>
              )}

              {/* Actions */}
              {!isEditing && currentUser && (
                <div className="flex items-center gap-2">
                  <Button
                    className="h-auto gap-1 p-1 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowReplyForm(true)}
                    size="sm"
                    variant="ghost"
                  >
                    <Reply className="size-3" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showReplyForm && (
        <div className="ml-8 sm:ml-11">
          <CommentForm
            autoFocus={true}
            onCancel={() => setShowReplyForm(false)}
            onSubmit={handleReplySubmit}
            parentId={comment._id}
            placeholder={`Reply to ${comment.authorName}...`}
            postId={postId}
          />
        </div>
      )}
      <Dialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isDeleting}
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              onClick={handleDelete}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete"}
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
      toast.error("Comment cannot be empty");
      return;
    }

    if (trimmedContent.length > 1000) {
      toast.error("Comment cannot exceed 1000 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedContent);
    } finally {
      setIsSubmitting(false);
    }
  };

  const remainingChars = 1000 - content.length;

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
          <span className={remainingChars < 100 ? "text-destructive" : ""}>
            {remainingChars} characters remaining
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
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={onCancel}
          size="sm"
          type="button"
          variant="ghost"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
