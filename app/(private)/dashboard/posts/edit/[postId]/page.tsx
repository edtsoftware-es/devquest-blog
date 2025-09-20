import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import type { Category, PostId } from "@/types";
import { PostForm } from "../../create/post-form";

type EditPostPageProps = {
  params: {
    postId: string;
  };
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params;
  const token = await convexAuthNextjsToken();
  const [post, categories] = await Promise.all([
    fetchQuery(api.posts.getPostById, { postId: postId as PostId }, { token }),
    fetchQuery(api.categories.getAllCategories),
  ]);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PostForm
          categories={categories as Category[]}
          mode="edit"
          post={post}
        />
      </div>
    </div>
  );
}
