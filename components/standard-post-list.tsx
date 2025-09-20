"use client";

import {
  type Preloaded,
  usePaginatedQuery,
  usePreloadedQuery,
} from "convex/react";
import { useState } from "react";
import HomePagination from "@/app/(public)/components/home-pagination";
import { DEFAULT_LATEST_POSTS_LIMIT } from "@/app/(public)/page";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

export default function StandardPostList({
  preloaded,
  totalPosts,
  className,
}: {
  preloaded: Preloaded<typeof api.posts.getLatestPosts>;
  totalPosts: number;
  className?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const firstPage = usePreloadedQuery(preloaded);
  const totalPages = Math.ceil(totalPosts / DEFAULT_LATEST_POSTS_LIMIT);

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
      <div className="mt-8 flex w-full max-w-6xl justify-center">
        <HomePagination
          currentPage={currentPage}
          hasNextPage={status === "CanLoadMore"}
          hasPreviousPage={currentPage > 1}
          nextPageAction={() => {
            loadMore(DEFAULT_LATEST_POSTS_LIMIT);
            setCurrentPage((page) => page + 1);
          }}
          totalPages={totalPages}
        />
      </div>
    </section>
  );
}
