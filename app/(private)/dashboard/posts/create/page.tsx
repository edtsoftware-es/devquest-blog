import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { PostForm } from "./post-form";

export default async function CreatePostPage() {
  const categories = await fetchQuery(api.categories.getAllCategories);

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PostForm categories={categories} />
      </div>
    </div>
  );
}
