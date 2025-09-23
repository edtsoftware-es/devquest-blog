import Image from "next/image";
import Link from "next/link";
import {
  CompactCard,
  CompactCardContent,
  CompactCardFooter,
  CompactCardImageContainer,
  CompactCardPublishedAt,
  CompactCardReadingTime,
  CompactCardStats,
  CompactCardTitle,
} from "@/components/cards/compact-card";
import {
  FeaturedCard,
  FeaturedCardAuthor,
  FeaturedCardAuthorContainer,
  FeaturedCardAuthorName,
  FeaturedCardContent,
  FeaturedCardDescription,
  FeaturedCardFooter,
  FeaturedCardHeader,
  FeaturedCardImageContainer,
  FeaturedCardPublishedAt,
  FeaturedCardShell,
  FeaturedCardStats,
  FeaturedCardTags,
  FeaturedCardTitle,
} from "@/components/cards/featured-card";
import {
  HighlightCard,
  HighlightCardImageContainer,
  HighlightCardTags,
  HighlightCardTitle,
} from "@/components/cards/highlight-card";
import { SectionHeading } from "@/components/headings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PostWithAuthorData } from "@/convex/lib/types";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

export default function Trending({
  compactPosts,
  highLightPosts,
  mainPopularPost,
}: {
  mainPopularPost: PostWithAuthorData;
  highLightPosts: Post[];
  compactPosts: Post[];
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <SectionHeading
        subtitle="Las historias más populares de hoy"
        title="Top Trending"
      />
      <div className="mt-7 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <FeaturedCard className="max-w-full">
          <FeaturedCardImageContainer>
            <Image
              alt={`Image for ${mainPopularPost.title}`}
              className="rounded-[1rem] rounded-br-[1.75rem]"
              layout="fill"
              objectFit="cover"
              src={mainPopularPost.image || ""}
            />
            <FeaturedCardTags
              className="absolute top-4 left-4 z-10 hidden lg:flex"
              tags={mainPopularPost.tags}
            />
          </FeaturedCardImageContainer>
          <FeaturedCardShell>
            <FeaturedCardTags
              className="flex lg:hidden"
              tags={mainPopularPost.tags}
            >
              <FeaturedCardPublishedAt className="ml-0 inline lg:hidden">
                {formatDate(
                  mainPopularPost.publishedAt ?? mainPopularPost._creationTime
                )}
              </FeaturedCardPublishedAt>
            </FeaturedCardTags>
            <FeaturedCardContent>
              <FeaturedCardHeader>
                <Link href={`/posts/${mainPopularPost.slug}`} prefetch>
                  <span className="absolute inset-0 z-50" />
                  <FeaturedCardTitle>{mainPopularPost.title}</FeaturedCardTitle>
                </Link>
              </FeaturedCardHeader>
              <FeaturedCardDescription>
                {mainPopularPost.excerpt}
              </FeaturedCardDescription>
            </FeaturedCardContent>
            <FeaturedCardFooter>
              <FeaturedCardAuthorContainer>
                <FeaturedCardAuthor>
                  <Avatar className="size-8 xs:size-10">
                    <AvatarImage
                      alt={`Profile picture of ${mainPopularPost.authorName}`}
                      aria-hidden
                      src={mainPopularPost.authorImage || ""}
                    />
                    <AvatarFallback>
                      {mainPopularPost.authorName?.charAt(0).toUpperCase() ||
                        "A"}
                    </AvatarFallback>
                  </Avatar>
                  <FeaturedCardAuthorName>
                    {mainPopularPost.authorName}
                  </FeaturedCardAuthorName>
                </FeaturedCardAuthor>
                <FeaturedCardPublishedAt className="hidden lg:inline">
                  {formatDate(
                    mainPopularPost.publishedAt ?? mainPopularPost._creationTime
                  )}
                </FeaturedCardPublishedAt>
              </FeaturedCardAuthorContainer>
              <FeaturedCardStats
                commentsCount={mainPopularPost.commentsCount}
                duration={mainPopularPost.duration}
                viewsCount={mainPopularPost.viewCount}
              />
            </FeaturedCardFooter>
          </FeaturedCardShell>
        </FeaturedCard>
        <div className="mt-4 flex w-full flex-col gap-6 md:mt-0">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            {highLightPosts.map((post) => (
              <HighlightCard className="w-full" key={post._id}>
                <HighlightCardImageContainer>
                  <Image
                    alt={`Image for ${post.title}`}
                    className="rounded-[1rem] rounded-br-[1.75rem]"
                    fill
                    objectFit="cover"
                    quality={65}
                    src={post.image || ""}
                  />
                  <HighlightCardTags tags={post.tags} />
                </HighlightCardImageContainer>
                <Link href={`/posts/${post.slug}`} prefetch>
                  <span className="absolute inset-0 z-50" />
                  <HighlightCardTitle>{post.title}</HighlightCardTitle>
                </Link>
              </HighlightCard>
            ))}
          </div>
          <div className="flex w-full flex-col gap-4">
            {compactPosts.map((post) => (
              <CompactCard className="max-w-full bg-background" key={post._id}>
                <CompactCardImageContainer>
                  <Image
                    alt={`Image for ${post.title}`}
                    className="rounded-[0.625rem]"
                    fill
                    quality={65}
                    src={post.image || ""}
                  />
                </CompactCardImageContainer>
                <CompactCardContent className="xs:mr-0">
                  <Link href={`/posts/${post.slug}`} prefetch>
                    <span className="absolute inset-0 z-50" />
                    <CompactCardTitle>{post.title}</CompactCardTitle>
                  </Link>
                  <CompactCardFooter className="xs:mr-24">
                    <CompactCardPublishedAt>
                      {formatDate(post.publishedAt ?? post._creationTime)}
                    </CompactCardPublishedAt>
                    <CompactCardReadingTime>
                      {post.duration} min
                    </CompactCardReadingTime>
                  </CompactCardFooter>
                  <CompactCardStats
                    className="xs:flex hidden"
                    commentsCount={post.commentsCount}
                  />
                </CompactCardContent>
              </CompactCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
