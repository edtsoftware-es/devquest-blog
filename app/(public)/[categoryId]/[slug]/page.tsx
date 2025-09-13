import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

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
  const comments = await fetchQuery(api.comments.getCommentsByPostId, {
    postId: post._id,
  });

  return (
    <div>
      PostPage {categoryId} {slug} {JSON.stringify(post)}
      {JSON.stringify(comments)}
    </div>
  );
}
