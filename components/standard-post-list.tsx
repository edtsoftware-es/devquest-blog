"use client";

import {
  type Preloaded,
  usePaginatedQuery,
  usePreloadedQuery,
} from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { DEFAULT_LATEST_POSTS_LIMIT } from "@/app/(public)/page";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";
import {
  StandardCard,
  StandardCardContent,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardHeader,
  StandardCardImageContainer,
  StandardCardReadingTime,
  StandardCardShell,
  StandardCardStats,
  StandardCardTags,
  StandardCardTitle,
} from "./cards/standard-card";

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

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "500px",
  });

  useEffect(() => {
    if (inView && status === "CanLoadMore") {
      loadMore(DEFAULT_LATEST_POSTS_LIMIT);
    }
  }, [inView, status, loadMore]);

  const items = results.length ? results : firstPage.page;

  return (
    <section className="flex w-full flex-col gap-6">
      <div className={cn("flex flex-col gap-6", className)}>
        {items.map((post) => (
          <StandardCard className="" key={post._id}>
            <StandardCardImageContainer className="lg:h-[245px] lg:w-[225px]">
              <Image
                alt={post.title}
                className="h-full w-full object-cover"
                fill
                src={post.image || ""}
              />
              <StandardCardTags
                className="absolute bottom-3 left-3 z-10 xs:hidden"
                tags={post.tags}
              />
            </StandardCardImageContainer>
            <StandardCardShell>
              <StandardCardTags className="xs:flex hidden" tags={post.tags} />
              <StandardCardContent>
                <StandardCardHeader>
                  <Link href={`/posts/${post.slug}`} prefetch>
                    <span className="absolute inset-0 z-50" />
                    <StandardCardTitle className="line-clamp-1 lg:text-xl">
                      {post.title}
                    </StandardCardTitle>
                  </Link>
                  <StandardCardReadingTime>
                    {`${post.duration} mins`}
                  </StandardCardReadingTime>
                </StandardCardHeader>
                <StandardCardDescription className="line-clamp-2">
                  {post.excerpt}
                </StandardCardDescription>
              </StandardCardContent>
              <StandardCardFooter>
                <StandardCardStats
                  commentsCount={post.commentsCount}
                  viewsCount={post.viewCount}
                />
              </StandardCardFooter>
            </StandardCardShell>
          </StandardCard>
        ))}
      </div>
      <div className="h-1 w-full" ref={ref} />
    </section>
  );
}
