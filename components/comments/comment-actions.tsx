"use client";

import { Edit, MoreHorizontal, Reply, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CommentWithAuthor, UserProfile } from "./types";

type CommentActionsProps = {
  comment: CommentWithAuthor;
  currentUser?: UserProfile | null;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showReplyButton?: boolean;
};

export function CommentActions({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  showReplyButton = true,
}: CommentActionsProps) {
  const isOwner = currentUser?._id === comment.authorId;
  const canModerate = currentUser?.role === "admin";
  const canEdit = isOwner && onEdit;
  const canDelete = (isOwner || canModerate) && onDelete;

  return (
    <div className="flex items-center gap-1">
      {/* Reply Button */}
      {showReplyButton && currentUser && (
        <Button
          className="h-auto gap-1 p-1 text-muted-foreground hover:text-foreground"
          onClick={onReply}
          size="sm"
          variant="ghost"
        >
          <Reply className="size-3" />
          <span className="text-xs">Reply</span>
        </Button>
      )}

      {/* Edit/Delete Actions */}
      {(canEdit || canDelete) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="size-7 p-0" size="sm" variant="ghost">
              <MoreHorizontal className="size-3" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {canEdit && (
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="mr-2 size-3" />
                <span className="text-xs">Edit</span>
              </DropdownMenuItem>
            )}
            {canDelete && (
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 size-3" />
                <span className="text-xs">Delete</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
