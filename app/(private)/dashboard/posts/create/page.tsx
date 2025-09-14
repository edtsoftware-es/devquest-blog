"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PostForm } from "./post-form";

export default function CreatePostPage() {
  const categories = useQuery(api.categories.getAllCategories);

  if (categories === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-gray-900 border-b-2" />
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <PostForm categories={categories} />
      </div>
    </div>
  );
}
