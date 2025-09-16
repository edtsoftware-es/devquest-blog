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
  CompactCard,
  CompactCardContent,
  CompactCardFooter,
  CompactCardImage,
  CompactCardPublishedAt,
  CompactCardReadingTime,
  CompactCardStats,
  CompactCardTitle,
} from "@/components/cards/compact-card";
import {
  StandardCard,
  StandardCardAuthor,
  StandardCardAuthorName,
  StandardCardCategories,
  StandardCardContent,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardHeader,
  StandardCardImage,
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
  console.log("test");
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

        <h3 className="mb-2 text-heading-4">Standard Card - PLP</h3>
        <StandardCard>
          <StandardCardImage>
            <div className="h-full w-full rounded-[1rem] bg-green-500" />
            <StandardCardCategories
              categories={[
                { _id: "1", slug: "technology", name: "Technology" },
                { _id: "2", slug: "react", name: "React" },
              ]}
              className="absolute bottom-3 left-3 z-10 xs:hidden"
            />
          </StandardCardImage>
          <StandardCardShell>
            <StandardCardHeader>
              <StandardCardCategories
                categories={[
                  { _id: "1", slug: "technology", name: "Technology" },
                  { _id: "2", slug: "react", name: "React" },
                ]}
                className="xs:flex hidden"
              />
              <StandardCardTitle>
                Frontend Development
                <StandardCardReadingTime>6 mins</StandardCardReadingTime>
              </StandardCardTitle>
            </StandardCardHeader>
            <StandardCardContent>
              <StandardCardDescription>
                <p className="text-body-7 text-neutral-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                  ea commodo consequat. Duis aute irure dolor in reprehenderit
                  in voluptate velit esse cillum dolore eu fugiat nulla
                  pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                  in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </StandardCardDescription>
              <StandardCardFooter>
                <StandardCardAuthor>
                  <Avatar className="size-8 xs:size-10">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>AF</AvatarFallback>
                  </Avatar>
                  <StandardCardAuthorName>
                    Jivs Jivs
                    <StandardCardPublishedAt>
                      Sep 13, 2025
                    </StandardCardPublishedAt>
                  </StandardCardAuthorName>
                </StandardCardAuthor>
                <StandardCardStats commentsCount={33} viewsCount={300} />
              </StandardCardFooter>
            </StandardCardContent>
          </StandardCardShell>
        </StandardCard>

        <h3 className="mb-2 text-heading-4">
          Compact Card - HOME & Recommended
        </h3>
        <CompactCard className="border-none bg-background">
          <CompactCardImage>
            <div className="h-full w-full rounded-[0.625rem] bg-green-500" />
          </CompactCardImage>
          <CompactCardContent>
            <CompactCardTitle>Understanding React Hooks</CompactCardTitle>
            <CompactCardFooter>
              <CompactCardPublishedAt>
                Oct 5, 2024
                <CompactCardReadingTime>5 mins</CompactCardReadingTime>
              </CompactCardPublishedAt>
            </CompactCardFooter>
          </CompactCardContent>
        </CompactCard>

        <CompactCard className="bg-background">
          <CompactCardImage>
            <div className="h-full w-full rounded-[0.625rem] bg-green-500" />
          </CompactCardImage>
          <CompactCardContent>
            <CompactCardTitle>Understanding React Hooks</CompactCardTitle>
            <CompactCardFooter>
              <CompactCardPublishedAt>
                Oct 5, 2024
                <CompactCardReadingTime>5 mins</CompactCardReadingTime>
              </CompactCardPublishedAt>
            </CompactCardFooter>
            <CompactCardStats
              className="xs:flex hidden"
              commentsCount={12}
              viewsCount={150}
            />
          </CompactCardContent>
        </CompactCard>

        <CompactCard variant="reverse">
          <CompactCardImage>
            <div className="h-full w-full rounded-[0.625rem] bg-green-500" />
          </CompactCardImage>
          <CompactCardContent className="mr-0">
            <CompactCardTitle>Understanding React Hooks</CompactCardTitle>
            <CompactCardFooter className="mr-0">
              <CompactCardPublishedAt>
                Oct 5, 2024
                <CompactCardReadingTime>5 mins</CompactCardReadingTime>
              </CompactCardPublishedAt>
            </CompactCardFooter>
          </CompactCardContent>
        </CompactCard>
      </section>
    </main>
  );
}
