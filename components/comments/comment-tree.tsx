"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { CommentItem } from "./comment-item";
import { CommentNode } from "./comment-node";
import type { CommentTree as CommentTreeType, UserProfile } from "./types";

interface CommentTreeProps {
  comments: CommentTreeType[];
  postId: Id<"posts">;
  currentUser?: UserProfile | null;
  maxDepth?: number;
  showLimit?: number;
  slug?: string;
  startIndex?: number;
}

export function CommentTree({
  comments,
  postId,
  currentUser,
  maxDepth = 5,
  showLimit = 3,
  slug,
  startIndex = 0,
}: CommentTreeProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <CommentNode
          key={comment._id}
          comment={comment}
          postId={postId}
          currentUser={currentUser}
          maxDepth={maxDepth}
          showLimit={showLimit}
          slug={slug}
          index={startIndex + index}
        />
      ))}
    </div>
  );
}