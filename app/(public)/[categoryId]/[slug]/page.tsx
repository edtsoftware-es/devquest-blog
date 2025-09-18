import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { notFound } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { CommentsSection } from "./comments-section";
import { PostDisplay } from "./post-display";

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; slug: string }>;
}) {
  const { slug } = await params;
  const token = await convexAuthNextjsToken();

  const post = await fetchQuery(api.posts.getPdpPost, { slug });

  if (!post?.published) {
    notFound();
  }

  const [preloadedPost, preloadedComments, preloadedUser] = await Promise.all([
    preloadQuery(api.posts.getPdpPost, { slug }, { token }),
    preloadQuery(
      api.comments.getCommentsWithAuthors,
      { postId: post._id },
      { token }
    ),
    preloadQuery(api.users.getCurrentUserOptional, {}, { token }),
  ]);

  return (
    <div className="container mx-auto max-w-8xl py-10">
      <PostDisplay preloadedPost={preloadedPost} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CommentsSection
            postId={post._id}
            preloadedComments={preloadedComments}
            preloadedUser={preloadedUser}
          />
        </div>
      </div>
    </div>
  );
}
