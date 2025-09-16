"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";
import { CommentItem } from "./comment-item";
import { CommentTree } from "./comment-tree";
import type { CommentTree as CommentTreeType, UserProfile } from "./types";

const DEEP_LEVEL_THRESHOLD = 3;
const DEEP_LEVEL_REPLY_LIMIT = 2;
const DEEP_LEVEL_COLLAPSE_THRESHOLD = 4;
const SHALLOW_LEVEL_COLLAPSE_THRESHOLD = 6;

type CommentNodeProps = {
  comment: CommentTreeType;
  postId: Id<"posts">;
  currentUser?: UserProfile | null;
  maxDepth: number;
  showLimit: number;
  index: number;
};

export function CommentNode({
  comment,
  postId,
  currentUser,
  maxDepth,
  showLimit,
  index,
}: CommentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasReplies = comment.replies.length > 0;
  const canShowReplies = comment.level < maxDepth;

  // Apply progressive disclosure: deeper levels show fewer replies initially
  const effectiveLimit =
    comment.level >= DEEP_LEVEL_THRESHOLD
      ? Math.min(showLimit, DEEP_LEVEL_REPLY_LIMIT)
      : showLimit;
  const minimumForCollapse =
    comment.level >= DEEP_LEVEL_THRESHOLD
      ? DEEP_LEVEL_COLLAPSE_THRESHOLD
      : SHALLOW_LEVEL_COLLAPSE_THRESHOLD;

  const shouldLimitReplies = comment.replies.length >= minimumForCollapse;
  const repliesToShow =
    shouldLimitReplies && !isExpanded
      ? comment.replies.slice(0, effectiveLimit)
      : comment.replies;
  const hiddenRepliesCount = comment.replies.length - effectiveLimit;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <CommentItem
        comment={comment}
        currentUser={currentUser}
        index={index}
        level={comment.level}
        postId={postId}
      />

      {hasReplies && canShowReplies && (
        <div className="mt-4 ml-4 border-muted border-l-2 pl-4 sm:ml-6">
          <CommentTree
            comments={repliesToShow}
            currentUser={currentUser}
            maxDepth={maxDepth}
            postId={postId}
            showLimit={showLimit}
            startIndex={index + 1}
          />

          {shouldLimitReplies && hiddenRepliesCount > 0 && (
            <div className="mt-3">
              <Button
                className="gap-2 border-dashed text-muted-foreground hover:text-foreground"
                onClick={toggleExpansion}
                size="sm"
                variant="outline"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="size-4" />
                    <span className="text-sm">Show fewer replies</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="size-4" />
                    <span className="text-sm">
                      {hiddenRepliesCount === 1
                        ? "Show 1 more reply"
                        : `Show ${hiddenRepliesCount} more replies`}
                    </span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      )}

      {hasReplies && !canShowReplies && (
        <div className="mt-2 ml-4 sm:ml-6">
          <p className="text-muted-foreground text-xs">
            {comment.replies.length} more{" "}
            {comment.replies.length === 1 ? "reply" : "replies"} (maximum
            nesting reached)
          </p>
        </div>
      )}
    </div>
  );
}
