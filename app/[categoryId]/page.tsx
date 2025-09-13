import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const category = await fetchQuery(api.categories.getCategoryBySlug, {
    slug: categoryId,
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  const posts = await fetchQuery(api.posts.getPostsByCategoryId, {
    categoryId: category._id,
  });
  return (
    <div>
      CategoryPage {categoryId} {JSON.stringify(category)}{" "}
      {JSON.stringify(posts)}
    </div>
  );
}
