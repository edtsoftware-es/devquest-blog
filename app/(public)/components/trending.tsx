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
  FeaturedCardReadingTime,
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

export default function Trending() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <SectionHeading
        slug="top-trending"
        subtitle="Las historias más populares de hoy"
        title="Top Trending"
      />
      <div className="mt-10 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <FeaturedCard>
          <FeaturedCardImageContainer>
            <div className="h-full w-full rounded-[1rem] bg-green-500" />
            <FeaturedCardTags
              className="absolute top-4 left-4 z-10 hidden lg:flex"
              tags={["technology", "react"]}
            />
          </FeaturedCardImageContainer>
          <FeaturedCardShell>
            <FeaturedCardTags
              className="flex lg:hidden"
              tags={["technology", "react"]}
            >
              <FeaturedCardPublishedAt className="ml-0 inline lg:hidden">
                Sep 13, 2025
              </FeaturedCardPublishedAt>
              <FeaturedCardReadingTime className="ml-0 inline lg:hidden">
                5 min read
              </FeaturedCardReadingTime>
            </FeaturedCardTags>
            <FeaturedCardContent>
              <FeaturedCardHeader>
                <FeaturedCardTitle>Understanding React</FeaturedCardTitle>
                <FeaturedCardReadingTime className="hidden lg:inline">
                  5 min read
                </FeaturedCardReadingTime>
              </FeaturedCardHeader>
              <FeaturedCardDescription>
                Learn the fundamentals of React and how to build modern, interactive web applications with this comprehensive guide.
              </FeaturedCardDescription>
            </FeaturedCardContent>
            <FeaturedCardFooter>
              <FeaturedCardAuthorContainer>
                <FeaturedCardAuthor>
                  <Avatar className="size-8 xs:size-10">
                    <AvatarImage alt="Jivs Jivs profile picture" src="https://github.com/shadcn.png" />
                    <AvatarFallback>JJ</AvatarFallback>
                  </Avatar>
                  <FeaturedCardAuthorName>Jivs Jivs</FeaturedCardAuthorName>
                </FeaturedCardAuthor>
                <FeaturedCardPublishedAt className="hidden lg:inline">
                  Sep 13, 2025
                </FeaturedCardPublishedAt>
              </FeaturedCardAuthorContainer>
              <FeaturedCardStats commentsCount={33} viewsCount={300} />
            </FeaturedCardFooter>
          </FeaturedCardShell>
        </FeaturedCard>
        <div className="mt-4 flex w-full flex-col gap-6">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <HighlightCard className="w-full">
              <HighlightCardImageContainer>
                <div className="h-full w-full rounded-[1rem] rounded-br-[1.75rem] bg-green-500" />
                <HighlightCardTags tags={["technology", "react"]} />
              </HighlightCardImageContainer>
              <HighlightCardTitle>Understanding React Hooks</HighlightCardTitle>
            </HighlightCard>
            <HighlightCard className="w-full">
              <HighlightCardImageContainer>
                <div className="h-full w-full rounded-[1rem] rounded-br-[1.75rem] bg-green-500" />
                <HighlightCardTags tags={["technology", "react"]} />
              </HighlightCardImageContainer>
              <HighlightCardTitle>Understanding React Hooks</HighlightCardTitle>
            </HighlightCard>
          </div>
          <div className="flex w-full flex-col gap-4">
            <CompactCard className="bg-background">
              <CompactCardImageContainer>
                <div className="h-full w-full rounded-[0.625rem] bg-green-500" />
              </CompactCardImageContainer>
              <CompactCardContent>
                <CompactCardTitle>Understanding React Hooks</CompactCardTitle>
                <CompactCardFooter>
                  <CompactCardPublishedAt>Oct 5, 2024</CompactCardPublishedAt>
                  <CompactCardReadingTime>5 mins</CompactCardReadingTime>
                </CompactCardFooter>
                <CompactCardStats
                  className="xs:flex hidden"
                  commentsCount={12}
                />
              </CompactCardContent>
            </CompactCard>
            <CompactCard className="bg-background">
              <CompactCardImageContainer>
                <div className="h-full w-full rounded-[0.625rem] bg-green-500" />
              </CompactCardImageContainer>
              <CompactCardContent>
                <CompactCardTitle>Understanding React Hooks</CompactCardTitle>
                <CompactCardFooter>
                  <CompactCardPublishedAt>Oct 5, 2024</CompactCardPublishedAt>
                  <CompactCardReadingTime>5 mins</CompactCardReadingTime>
                </CompactCardFooter>
                <CompactCardStats
                  className="xs:flex hidden"
                  commentsCount={12}
                />
              </CompactCardContent>
            </CompactCard>
          </div>
        </div>
      </div>
    </div>
  );
}
