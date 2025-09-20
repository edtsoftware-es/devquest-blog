"use client";

import type { Id } from "@/convex/_generated/dataModel";
import { CommentNode } from "./comment-node";
import type { CommentTree as CommentTreeType } from "./types";

type CommentTreeProps = {
  comments: CommentTreeType[];
  postId: Id<"posts">;
  currentUser?: any;
  maxDepth?: number;
  showLimit?: number;
  startIndex?: number;
};

export function CommentTree({
  comments,
  postId,
  currentUser,
  maxDepth = 5,
  showLimit = 3,
  startIndex = 0,
}: CommentTreeProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment, index) => (
        <CommentNode
          comment={comment}
          currentUser={currentUser}
          index={startIndex + index}
          key={comment._id}
          maxDepth={maxDepth}
          postId={postId}
          showLimit={showLimit}
        />
      ))}
    </div>
  );
}
