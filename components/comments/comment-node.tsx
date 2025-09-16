"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { CommentItem } from "./comment-item";
import { CommentTree } from "./comment-tree";
import type { CommentTree as CommentTreeType, UserProfile } from "./types";

interface CommentNodeProps {
  comment: CommentTreeType;
  postId: Id<"posts">;
  currentUser?: UserProfile | null;
  maxDepth: number;
  showLimit: number;
  slug?: string;
  index: number;
}

export function CommentNode({
  comment,
  postId,
  currentUser,
  maxDepth,
  showLimit,
  slug,
  index,
}: CommentNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasReplies = comment.replies.length > 0;
  const canShowReplies = comment.level < maxDepth;
  
  // Apply progressive disclosure: deeper levels show fewer replies initially
  const effectiveLimit = comment.level >= 3 ? Math.min(showLimit, 2) : showLimit;
  const minimumForCollapse = comment.level >= 3 ? 4 : 6;
  
  const shouldLimitReplies = comment.replies.length >= minimumForCollapse;
  const repliesToShow = shouldLimitReplies && !isExpanded
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
        slug={slug}
      />

      {hasReplies && canShowReplies && (
        <div className="mt-4 ml-4 border-muted border-l-2 pl-4 sm:ml-6">
          <CommentTree
            comments={repliesToShow}
            postId={postId}
            currentUser={currentUser}
            maxDepth={maxDepth}
            showLimit={showLimit}
            slug={slug}
            startIndex={index + 1}
          />

          {shouldLimitReplies && hiddenRepliesCount > 0 && (
            <div className="mt-3">
              <Button
                className="gap-2 text-muted-foreground hover:text-foreground border-dashed"
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
            {comment.replies.length === 1 ? "reply" : "replies"} (maximum nesting reached)
          </p>
        </div>
      )}
    </div>
  );
}