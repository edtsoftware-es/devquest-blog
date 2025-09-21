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

const AUTO_PLAY_INTERVAL = 5000;

export default function Hero({ posts }: { posts: PostWithAuthorData[] }) {
  return (
    <Carousel
      className="w-full max-w-screen px-4 md:px-8 lg:max-w-[1150px] xl:px-0 2xl:max-w-[1400px]"
      opts={{ loop: true }}
      plugins={[
        Autoplay({
          delay: AUTO_PLAY_INTERVAL,
        }),
      ]}
    >
      <CarouselContent className="w-full pl-6 lg:pl-0">
        {posts.map((post, index) => (
          <CarouselItem className="w-full" key={post._id}>
            <HeroItem {...post} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
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
        <StandardCard className="h-full w-full rounded-2xl border bg-primary/60 backdrop-blur-xs lg:ml-24 lg:h-auto lg:max-w-[700px]">
          <StandardCardShell
            className="h-full border-none bg-transparent p-0"
            hasButton={false}
          >
            <StandardCardTags
              className="flex lg:hidden"
              tags={["technology", "react"]}
            />
            <StandardCardContent className="mb-14 p-0 lg:mb-24">
              <StandardCardHeader>
                <Link href={`/posts/${slug}`} prefetch>
                  <span className="absolute inset-0 z-50" />
                  <StandardCardTitle>{title}</StandardCardTitle>
                </Link>
              </StandardCardHeader>
              <StandardCardDescription className="text-secondary">
                {excerpt}
              </StandardCardDescription>
            </StandardCardContent>
            <StandardCardFooter>
              <StandardCardAuthorContainer>
                <StandardCardAuthor>
                  <Avatar className="size-8 xs:size-10">
                    <AvatarImage src={authorImage} />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <StandardCardAuthorName>{authorName}</StandardCardAuthorName>
                </StandardCardAuthor>
                <StandardCardPublishedAt className="text-secondary">
                  {publishedAt}
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
