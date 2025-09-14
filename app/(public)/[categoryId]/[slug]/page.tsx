import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { LikeButton } from "./like-button";

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; slug: string }>;
}) {
  const { categoryId, slug } = await params;
  const post = await fetchQuery(api.posts.getPostBySlug, { slug });
  if (!post) {
    return <div>Post not found</div>;
  }
  const [comments, preloadedHasLiked] = await Promise.all([
    fetchQuery(api.comments.getCommentsByPostId, {
      postId: post._id,
    }),
    preloadQuery(
      api.likes.hasUserLikedPost,
      {
        postId: post._id,
      },
      {
        token: await convexAuthNextjsToken(),
      }
    ),
  ]);

  return (
    <div>
      PostPage {categoryId} {slug} {JSON.stringify(post)}
      {JSON.stringify(comments)}
      <LikeButton postId={post._id} preloadedHasLiked={preloadedHasLiked} />
    </div>
  );
}
