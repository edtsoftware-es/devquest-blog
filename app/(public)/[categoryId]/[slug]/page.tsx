import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { PostDisplay } from "./post-display";
import { CommentsSection } from "./comments-section";

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; slug: string }>;
}) {
  const { slug } = await params;
  const token = await convexAuthNextjsToken();

  // Get post for validation
  const post = await fetchQuery(api.posts.getPostBySlug, { slug });

  if (!post || !post.published) {
    notFound();
  }

  // Preload all data for live queries and zero visual jumps
  const [preloadedPost, preloadedCategory, preloadedComments, preloadedHasLiked, preloadedUser] =
    await Promise.all([
      preloadQuery(api.posts.getPostBySlug, { slug }, { token }),
      preloadQuery(api.categories.getCategoryById, { categoryId: post.categoryId }, { token }),
      preloadQuery(api.comments.getCommentsWithAuthors, { postId: post._id }, { token }),
      preloadQuery(api.likes.hasUserLikedPost, { postId: post._id }, { token }),
      preloadQuery(api.users.getCurrentUserOptional, {}, { token }),
    ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <PostDisplay 
        preloadedPost={preloadedPost}
        preloadedCategory={preloadedCategory}
        preloadedHasLiked={preloadedHasLiked}
        slug={slug}
      />
      <CommentsSection
        postId={post._id}
        preloadedComments={preloadedComments}
        preloadedUser={preloadedUser}
        slug={slug}
      />
    </div>
  );
}