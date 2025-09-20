"use client";

import {
  type Preloaded,
  usePaginatedQuery,
  usePreloadedQuery,
} from "convex/react";
import { DEFAULT_LATEST_POSTS_LIMIT } from "@/app/(public)/page";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function StandardPostList({
  preloaded,
  className,
}: {
  preloaded: Preloaded<typeof api.posts.getLatestPosts>;
  className?: string;
}) {
  const firstPage = usePreloadedQuery(preloaded);

  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getLatestPosts,
    {},
    { initialNumItems: DEFAULT_LATEST_POSTS_LIMIT }
  );

  const items = results.length ? results : firstPage.page;

  return (
    <section className="flex w-full flex-col gap-6">
      <div className={cn("flex flex-col gap-6", className)}>
        {items.map((post) => (
          <article
            className="flex flex-col rounded-lg border border-border bg-card p-6 hover:shadow-md"
            key={post._id}
          >
            <h3 className="mb-2 font-semibold text-foreground text-lg">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm">{post.excerpt}</p>
          </article>
        ))}
      </div>
      <Button
        disabled={status !== "CanLoadMore"}
        onClick={() => loadMore?.(DEFAULT_LATEST_POSTS_LIMIT)}
      >
        Load More
      </Button>
    </section>
  );
}
