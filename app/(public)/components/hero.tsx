"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  StandardCard,
  StandardCardAuthor,
  StandardCardAuthorContainer,
  StandardCardAuthorName,
  StandardCardCategories,
  StandardCardContent,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardHeader,
  StandardCardPublishedAt,
  StandardCardShell,
  StandardCardStats,
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
        {posts.map((post) => (
          <CarouselItem className="w-full" key={post._id}>
            <HeroItem key={post._id} {...post} />
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
  excerpt,
  authorImage,
  authorName,
  publishedAt,
  commentsCount,
  viewCount,
  image,
}: PostWithAuthorData) {
  return (
    <main
      className={
        "mt-8 flex h-[350px] w-full max-w-[1400px] items-center rounded-2xl bg-center bg-cover lg:h-[670px]"
      }
      style={{ backgroundImage: `url(${image})` }}
    >
      <StandardCard className="h-full w-full rounded-2xl border bg-primary/60 backdrop-blur-xs lg:ml-24 lg:h-auto lg:max-w-[700px]">
        <StandardCardShell
          className="h-full border-none bg-transparent p-0"
          hasButton={false}
        >
          <StandardCardCategories
            categories={[
              { _id: "1", slug: "technology", name: "Technology" },
              { _id: "2", slug: "react", name: "React" },
            ]}
            className="flex lg:hidden"
          />
          <StandardCardContent className="mb-14 p-0 lg:mb-24">
            <StandardCardHeader>
              <StandardCardTitle>{title}</StandardCardTitle>
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
    </main>
  );
}
