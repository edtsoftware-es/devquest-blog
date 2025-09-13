import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function PostPage({
  params,
}: {
  params: Promise<{ categoryId: string; slug: string }>;
}) {
  const { categoryId, slug } = await params;
  const post = await fetchQuery(api.posts.getPostBySlug, { slug });
  return (
    <div>
      PostPage {categoryId} {slug} {JSON.stringify(post)}
    </div>
  );
}
