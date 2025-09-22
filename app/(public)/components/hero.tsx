"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import {
  StandardCard,
  StandardCardAuthor,
  StandardCardAuthorContainer,
  StandardCardAuthorName,
  StandardCardContent,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardHeader,
  StandardCardPublishedAt,
  StandardCardShell,
  StandardCardStats,
  StandardCardTags,
  StandardCardTitle,
} from "@/components/cards/standard-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { PostWithAuthorData } from "@/convex/lib/types";
import { formatDate } from "@/lib/utils";

const AUTO_PLAY_INTERVAL = 8000;

export default function Hero({ posts }: { posts: PostWithAuthorData[] }) {
  return (
    <Carousel
      className="w-full max-w-screen lg:max-w-6xl lg:px-2 2xl:max-w-[1400px]"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: AUTO_PLAY_INTERVAL,
        }),
      ]}
    >
      <CarouselContent className="w-full">
        {posts.map((post, index) => (
          <CarouselItem className="w-full" key={post._id}>
            <HeroItem {...post} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex" />
      <CarouselNext className="hidden lg:flex" />
    </Carousel>
  );
}

function HeroItem({
  title,
  slug,
  excerpt,
  authorImage,
  authorName,
  publishedAt,
  commentsCount,
  viewCount,
  image,
  _creationTime,
  index,
}: PostWithAuthorData & { index: number }) {
  return (
    <div className="relative mt-8 h-[350px] w-full max-w-[1400px] overflow-hidden rounded-2xl lg:h-[670px]">
      <Image
        alt={title}
        className="object-cover"
        decoding={index === 0 ? "async" : "auto"}
        fill
        loading={index === 0 ? "eager" : "lazy"}
        priority={index === 0}
        src={image}
      />
      <div className="absolute inset-0 flex items-center">
        <StandardCard className="h-full w-full grid-rows-1 rounded-2xl border border-transparent bg-primary/60 backdrop-blur-xs transition-all duration-300 hover:border-neutral-600 lg:ml-24 lg:h-auto lg:max-w-[700px] lg:grid-cols-1">
          <StandardCardShell
            className="h-full border-none bg-transparent p-0"
            hasButton={false}
          >
            <StandardCardTags
              className="flex lg:hidden"
              tags={["technology", "react"]}
            />
            <StandardCardContent className="mb-6 p-0">
              <StandardCardHeader>
                <Link href={`/posts/${slug}`} prefetch>
                  <span className="absolute inset-0 z-50" />
                  <StandardCardTitle>{title}</StandardCardTitle>
                </Link>
              </StandardCardHeader>
              <StandardCardDescription className="mr-0 text-secondary">
                {excerpt}
              </StandardCardDescription>
            </StandardCardContent>
            <StandardCardFooter className="mr-0">
              <StandardCardAuthorContainer>
                <StandardCardAuthor>
                  <Avatar className="size-8 xs:size-10">
                    <AvatarImage src={authorImage} />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <StandardCardAuthorName>{authorName}</StandardCardAuthorName>
                </StandardCardAuthor>
                <StandardCardPublishedAt className="text-secondary">
                  {formatDate(publishedAt ?? _creationTime)}
                </StandardCardPublishedAt>
              </StandardCardAuthorContainer>
              <StandardCardStats
                className="text-secondary [&_span]:text-secondary"
                commentsCount={commentsCount}
                viewsCount={viewCount}
              />
            </StandardCardFooter>
          </StandardCardShell>
        </StandardCard>
      </div>
    </div>
  );
}
