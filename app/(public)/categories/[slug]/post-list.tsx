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
import {
  StandardCard,
  StandardCardAuthor,
  StandardCardAuthorContainer,
  StandardCardAuthorName,
  StandardCardContent,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardHeader,
  StandardCardImageContainer,
  StandardCardPublishedAt,
  StandardCardReadingTime,
  StandardCardShell,
  StandardCardStats,
  StandardCardTags,
  StandardCardTitle,
} from "@/components/cards/standard-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { formatDate } from "@/lib/utils";
import { DEFAULT_CATEGORY_POSTS_LIMIT } from "./page";

export default function PostList({
  categoryId,
  preloaded,
}: {
  categoryId: Id<"categories">;
  preloaded: Preloaded<typeof api.posts.getPostsByCategoryId>;
}) {
  const firstPage = usePreloadedQuery(preloaded);

  const { results, status, loadMore } = usePaginatedQuery(
    api.posts.getPostsByCategoryId,
    { categoryId },
    { initialNumItems: DEFAULT_CATEGORY_POSTS_LIMIT }
  );

  const { ref, inView } = useInView({
    threshold: 0.7,
  });

  useEffect(() => {
    if (inView && status === "CanLoadMore") {
      loadMore(DEFAULT_CATEGORY_POSTS_LIMIT);
    }
  }, [inView, status, loadMore]);

  const items = results.length ? results : firstPage.page;

  if (status === "LoadingFirstPage") {
    return (
      <section className="flex w-full max-w-6xl flex-col justify-center">
        <h2 className="font-normal text-base text-neutral-600">Cargando...</h2>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="flex w-full max-w-6xl flex-col justify-center">
        <h2 className="font-normal text-base text-neutral-600">
          No se han encontrado resultados
        </h2>
      </section>
    );
  }

  return (
    <section className="mt-4 mb-8 flex w-full max-w-6xl flex-col justify-center">
      <div
        className="grid grid-cols-1 gap-x-6 gap-y-8 [@media(min-width:936px)]:grid-cols-2"
        ref={ref}
      >
        {items.map((post) => (
          <StandardCard key={post._id} variant="compact">
            <StandardCardImageContainer className="lg:w-full">
              <Image
                alt={post.title}
                className="h-full w-full object-cover"
                fill
                src={"/images/galaxia.jpg"}
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
                    <StandardCardTitle>{post.title}</StandardCardTitle>
                  </Link>
                  <StandardCardReadingTime>
                    {`${post.duration} mins`}
                  </StandardCardReadingTime>
                </StandardCardHeader>
                <StandardCardDescription>
                  {post.excerpt}
                </StandardCardDescription>
              </StandardCardContent>
              <StandardCardFooter>
                <StandardCardAuthorContainer>
                  <StandardCardAuthor>
                    <Avatar className="size-8 xs:size-10">
                      <AvatarImage src={post.authorImage} />
                      <AvatarFallback>
                        {post.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <StandardCardAuthorName>
                      {post.authorName}
                    </StandardCardAuthorName>
                  </StandardCardAuthor>
                  <StandardCardPublishedAt>
                    {formatDate(post.publishedAt)}
                  </StandardCardPublishedAt>
                </StandardCardAuthorContainer>
                <StandardCardStats
                  commentsCount={post.commentsCount}
                  viewsCount={post.viewCount}
                />
              </StandardCardFooter>
            </StandardCardShell>
          </StandardCard>
        ))}
      </div>
    </section>
  );
}
