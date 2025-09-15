import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { PostForm } from "../../create/post-form";
import { Category, PostId } from "@/types";

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
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <PostForm 
          categories={categories as Category[]} 
          post={post}
          mode="edit"
        />
      </div>
    </div>
  );
}
