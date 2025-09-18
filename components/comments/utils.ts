import type { CommentTree, CommentWithAuthor } from "./types";

export function buildCommentTree(comments: CommentWithAuthor[]): CommentTree[] {
  const commentMap = new Map<string, CommentTree>();
  const rootComments: CommentTree[] = [];

  // First pass: create all comment nodes
  for (const comment of comments) {
    const commentTree: CommentTree = {
      ...comment,
      replies: [],
      level: 0,
    };
    commentMap.set(comment._id, commentTree);
  }

  // Second pass: build the tree structure
  for (const comment of comments) {
    const commentTree = commentMap.get(comment._id);
    if (!commentTree) {
      continue;
    }

    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        commentTree.level = parent.level + 1;
        parent.replies.push(commentTree);
        // Sort replies by creation time (oldest first)
        parent.replies.sort((a, b) => a._creationTime - b._creationTime);
      } else {
        // Parent not found, treat as root comment
        rootComments.push(commentTree);
      }
    } else {
      rootComments.push(commentTree);
    }
  }

  // Sort root comments by creation time (newest first)
  rootComments.sort((a, b) => b._creationTime - a._creationTime);

  return rootComments;
}

export function flattenCommentTree(comments: CommentTree[]): CommentTree[] {
  const result: CommentTree[] = [];

  function traverse(commentList: CommentTree[]) {
    for (const comment of commentList) {
      result.push(comment);
      if (comment.replies.length > 0) {
        traverse(comment.replies);
      }
    }
  }

  traverse(comments);
  return result;
}

export function getCommentById(
  comments: CommentTree[],
  id: string
): CommentTree | null {
  function search(commentList: CommentTree[]): CommentTree | null {
    for (const comment of commentList) {
      if (comment._id === id) {
        return comment;
      }
      const found = search(comment.replies);
      if (found) {
        return found;
      }
    }
    return null;
  }

  return search(comments);
}

export function countTotalComments(comments: CommentTree[]): number {
  let count = 0;

  function traverse(commentList: CommentTree[]) {
    for (const comment of commentList) {
      count++;
      if (comment.replies.length > 0) {
        traverse(comment.replies);
      }
    }
  }

  traverse(comments);
  return count;
}
