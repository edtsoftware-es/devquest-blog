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

  const [preloadedPost, preloadedUser] = await Promise.all([
    preloadQuery(api.posts.getPdpPost, { slug }, { token }),
    preloadQuery(api.users.getCurrentUserOptional, {}, { token }),
  ]);

  return (
    <div className="mx-auto max-w-6xl max-w-8xl px-4 py-10 lg:px-0">
      <PostDisplay preloadedPost={preloadedPost} />
      <div className="flex w-full">
        <div className="w-full">
          <CommentsSection
            postId={post._id}
            preloadedPost={preloadedPost}
            preloadedUser={preloadedUser}
          />
        </div>
      </div>
    </div>
  );
}
