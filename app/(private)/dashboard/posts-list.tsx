'use client'

import { type Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function PostsList({preloadedPosts}: {preloadedPosts: Preloaded<typeof api.posts.getPostsByUserRole>}) {
  const posts = usePreloadedQuery(preloadedPosts);
  return <div>{posts.map((post) => <div key={post._id}>{post.title}</div>)}</div>;
}