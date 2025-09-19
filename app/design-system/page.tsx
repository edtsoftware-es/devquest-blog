import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  ChevronRight,
  Gamepad2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import {
  AuthorCard,
  AuthorCardDescription,
  AuthorCardImageContainer,
  AuthorCardName,
} from "@/components/cards/author-card";
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
  StandardCardImageContainer,
  StandardCardPublishedAt,
  StandardCardReadingTime,
  StandardCardShell,
  StandardCardStats,
  StandardCardTitle,
} from "@/components/cards/standard-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DesignSystem() {
  return (
    <main className="flex flex-col gap-16 p-4 sm:p-8">
      <section className="flex flex-col gap-4">
        <h2 className="mb-4 text-heading-2">BUTTONS</h2>

        <Button className="w-fit rounded-full" size="sm">
          <Gamepad2 aria-hidden="true" />
          Gaming
        </Button>

        <Button
          className="w-fit rounded-full font-bold"
          size="lg"
          variant="secondary"
        >
          Subscribe
        </Button>

        <div className="flex gap-4">
          <Button aria-label="Previous page" size="icon">
            <ArrowLeft aria-hidden="true" />
          </Button>
          <Button aria-label="Next page" size="icon" variant="secondary">
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Button
            aria-label="Previous page"
            className="border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white"
            size="icon"
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          {/* biome-ignore lint/style/noMagicNumbers : example */}
          {[1, 2, 3, 4, 5].map((n) => (
            <Button
              className="border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white"
              key={n}
              size="icon"
            >
              {n}
            </Button>
          ))}
          <Button
            aria-label="Next page"
            className="border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white"
            size="icon"
          >
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>

        <Button className="w-fit pl-4" size="xs">
          People
          <Badge variant="tertiary">168</Badge>
        </Button>

        <Button className="group w-fit" size="auto" variant="ghost">
          <span className="rounded-full bg-neutral-900/90 p-1 text-system-white transition-colors group-hover:bg-neutral-900">
            <ChevronRight aria-hidden="true" />
          </span>
          View more
        </Button>

        <div className="flex gap-x-9">
          <Button size="auto" variant="link">
            Privacy policy
          </Button>
          <Button size="auto" variant="link">
            Terms of use
          </Button>
        </div>

        <Button className="size-fit p-1.5" variant="outline">
          <Bookmark className="size-4" />
        </Button>

        <div className="flex flex-wrap gap-10">
          <Button>
            Explore Now
            <ArrowUpRight aria-hidden="true" />
          </Button>
          <Button variant="secondary">
            View More Testimonials
            <ArrowUpRight aria-hidden="true" />
          </Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="mb-4 text-heading-2">BADGES</h2>

        <div className="flex items-center gap-x-2">
          <Badge variant="highlight">
            <Zap />
          </Badge>
          <Badge variant="highlight">New</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge>2024 - 2025</Badge>
          <Badge className="bg-background-1">Frontend</Badge>
          <Badge className="bg-background-2">Backend</Badge>
          <Badge className="bg-background-4">Fullstack</Badge>
          <Badge className="bg-background-5">Mobile</Badge>
          <Badge className="bg-background-3">DevOps</Badge>
        </div>

        <Badge variant="secondary">85</Badge>

        <Button className="w-fit pl-4" size="xs">
          Technology
          <Badge variant="tertiary">85</Badge>
        </Button>

        <div className="flex items-center gap-x-2">
          <Badge variant="outline">Technology</Badge>
          <Link href="#">
            <Badge
              className="hover:text-system-info hover:shadow-xs"
              variant="outline"
            >
              Programming
            </Badge>
          </Link>
        </div>

        <Badge variant="destructive">Error</Badge>
      </section>

      <section className="flex flex-col gap-10">
        <h2 className="text-heading-2">TYPOGRAPHY</h2>

        <div className="flex flex-wrap gap-x-40 gap-y-10">
          <div>
            <h3 className="mb-6 text-body-1">Displays</h3>
            <p className="text-display-1">Display 1</p>
            <p className="text-display-2">Display 2</p>
            <p className="text-display-3">Display 3</p>
            <p className="text-display-4">Display 4</p>
            <p className="text-display-5">Display 5</p>
            <p className="text-display-6">Display 6</p>
          </div>
          <div>
            <h3 className="mb-6 text-body-1">Headings</h3>
            <p className="text-heading-1">Heading 1</p>
            <p className="text-heading-2">Heading 2</p>
            <p className="text-heading-3">Heading 3</p>
            <p className="text-heading-4">Heading 4</p>
            <p className="text-heading-5">Heading 5</p>
            <p className="text-heading-6">Heading 6</p>
          </div>
        </div>

        <div>
          <h3 className="mb-6 text-body-1">Body</h3>
          <p className="text-body-1">Body 1 Lorem ipsum dolor sit amet</p>
          <p className="text-body-2">Body 2 Lorem ipsum dolor sit amet</p>
          <p className="text-body-3">Body 3 Lorem ipsum dolor sit amet</p>
          <p className="text-body-4">Body 4 Lorem ipsum dolor sit amet</p>
          <p className="text-body-5">Body 5 Lorem ipsum dolor sit amet</p>
          <p className="text-body-6">Body 6 Lorem ipsum dolor sit amet</p>
          <p className="text-body-7">Body 7 Lorem ipsum dolor sit amet</p>
          <p className="text-body-8">Body 8 Lorem ipsum dolor sit amet</p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="mb-4 text-heading-2">CARDS</h2>

        <h3 className="mb-2 text-heading-4">Featured Card - Home</h3>
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
                5 mins
              </FeaturedCardReadingTime>
            </FeaturedCardTags>
            <FeaturedCardContent>
              <FeaturedCardHeader>
                <FeaturedCardTitle>Understanding React</FeaturedCardTitle>
                <FeaturedCardReadingTime className="hidden lg:inline">
                  5 mins
                </FeaturedCardReadingTime>
              </FeaturedCardHeader>
              <FeaturedCardDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </FeaturedCardDescription>
            </FeaturedCardContent>
            <FeaturedCardFooter>
              <FeaturedCardAuthorContainer>
                <FeaturedCardAuthor>
                  <Avatar className="size-8 xs:size-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AF</AvatarFallback>
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

        <h3 className="mt-4 mb-2 text-heading-4">Standard Card - PLP</h3>
        <StandardCard>
          <StandardCardImageContainer>
            <div className="h-full w-full rounded-[1rem] bg-green-500" />
            <StandardCardCategories
              categories={[
                { _id: "1", slug: "technology", name: "Technology" },
                { _id: "2", slug: "react", name: "React" },
              ]}
              className="absolute bottom-3 left-3 z-10 xs:hidden"
            />
          </StandardCardImageContainer>
          <StandardCardShell>
            <StandardCardCategories
              categories={[
                { _id: "1", slug: "technology", name: "Technology" },
                { _id: "2", slug: "react", name: "React" },
              ]}
              className="xs:flex hidden"
            />
            <StandardCardContent>
              <StandardCardHeader>
                <StandardCardTitle>Frontend Development</StandardCardTitle>
                <StandardCardReadingTime>6 mins</StandardCardReadingTime>
              </StandardCardHeader>
              <StandardCardDescription>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </StandardCardDescription>
            </StandardCardContent>
            <StandardCardFooter>
              <StandardCardAuthorContainer>
                <StandardCardAuthor>
                  <Avatar className="size-8 xs:size-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <StandardCardAuthorName>Jivs Jivs</StandardCardAuthorName>
                </StandardCardAuthor>
                <StandardCardPublishedAt>Sep 13, 2025</StandardCardPublishedAt>
              </StandardCardAuthorContainer>
              <StandardCardStats commentsCount={33} viewsCount={300} />
            </StandardCardFooter>
          </StandardCardShell>
        </StandardCard>

        <h3 className="mt-4 mb-2 text-heading-4">Highlight Card - Home</h3>
        <HighlightCard>
          <HighlightCardImageContainer>
            <div className="h-full w-full rounded-[1rem] rounded-br-[1.75rem] bg-green-500" />
            <HighlightCardTags tags={["technology", "react"]} />
          </HighlightCardImageContainer>
          <HighlightCardTitle>Understanding React Hooks</HighlightCardTitle>
        </HighlightCard>

        <h3 className="mt-4 mb-2 text-heading-4">
          Compact Card - HOME & Recommended
        </h3>
        <CompactCard className="border-none bg-background">
          <CompactCardImageContainer>
            <div className="h-full w-full rounded-[0.625rem] bg-green-500" />
          </CompactCardImageContainer>
          <CompactCardContent>
            <CompactCardTitle>Understanding React Hooks</CompactCardTitle>
            <CompactCardFooter>
              <CompactCardPublishedAt>Oct 5, 2024</CompactCardPublishedAt>
              <CompactCardReadingTime>5 mins</CompactCardReadingTime>
            </CompactCardFooter>
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
              viewsCount={150}
            />
          </CompactCardContent>
        </CompactCard>

        <CompactCard variant="reverse">
          <CompactCardImageContainer>
            <div className="h-full w-full rounded-[0.625rem] bg-green-500" />
          </CompactCardImageContainer>
          <CompactCardContent className="mr-0">
            <CompactCardTitle>Understanding React Hooks</CompactCardTitle>
            <CompactCardFooter className="mr-0">
              <CompactCardPublishedAt>Oct 5, 2024</CompactCardPublishedAt>
              <CompactCardReadingTime>5 mins</CompactCardReadingTime>
            </CompactCardFooter>
          </CompactCardContent>
        </CompactCard>

        <h3 className="mt-4 mb-2 text-heading-4">
          Author Card - PDP & Author Page
        </h3>
        <AuthorCard>
          <AuthorCardImageContainer>
            <div className="h-full w-full rounded-full bg-green-500" />
          </AuthorCardImageContainer>
          <AuthorCardName>Jivs Jivs</AuthorCardName>
          <AuthorCardDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            quis lorem vitae neque luctus malesuada. Sed ac ipsum sit amet sem
            maximus porta vel ut nunc.
          </AuthorCardDescription>
        </AuthorCard>

        <AuthorCard className="max-w-136 gap-y-3 border-none bg-background">
          <AuthorCardImageContainer className="mb-3">
            <div className="h-full w-full rounded-full bg-green-500" />
          </AuthorCardImageContainer>
          <AuthorCardName className="text-[2.375rem]">Jivs Jivs</AuthorCardName>
          <AuthorCardDescription>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            quis lorem vitae neque luctus malesuada. Sed ac ipsum sit amet sem
            maximus porta vel ut nunc.
          </AuthorCardDescription>
        </AuthorCard>
      </section>
    </main>
  );
}
