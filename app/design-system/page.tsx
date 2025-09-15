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
  StandardCard,
  StandardCardAuthor,
  StandardCardAuthorName,
  StandardCardCategories,
  StandardCardContent,
  StandardCardFooter,
  StandardCardHeader,
  StandardCardPublishedAt,
  StandardCardReadingTime,
  StandardCardStats,
  StandardCardTitle,
} from "@/components/cards/standard-card";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DesignSystem() {
  return (
    <>
      <header className="sticky top-0 z-10 flex flex-row items-center justify-between border-b bg-background px-4 py-2 font-semibold text-lg">
        Design System
        <ModeToggle />
      </header>
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

          <StandardCard>
            <div className="flex size-full flex-col gap-y-6 p-6">
              <div className="flex max-w-169 flex-col justify-between gap-y-3">
                <StandardCardHeader>
                  <StandardCardCategories
                    categories={[
                      { _id: "1", slug: "technology", name: "Technology" },
                      { _id: "2", slug: "react", name: "React" },
                    ]}
                  />
                  <StandardCardTitle>
                    Frontend Development
                    <StandardCardReadingTime>6 mins</StandardCardReadingTime>
                  </StandardCardTitle>
                </StandardCardHeader>
                <StandardCardContent>
                  <p className="text-body-7 text-neutral-600">
                    When brushstrokes inspire hemlines and canvases shape
                    silhouettes, the result is a striking fusion of visual art
                    and fashion design.
                  </p>
                  <StandardCardFooter>
                    <StandardCardAuthor>
                      <Avatar className="size-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>AF</AvatarFallback>
                      </Avatar>
                      <StandardCardAuthorName>
                        Albert Flores
                        <StandardCardPublishedAt>
                          Jun 13, 2025
                        </StandardCardPublishedAt>
                      </StandardCardAuthorName>
                    </StandardCardAuthor>
                    <StandardCardStats commentsCount={98} viewsCount={162} />
                  </StandardCardFooter>
                </StandardCardContent>
              </div>
            </div>
          </StandardCard>
        </section>
      </main>
    </>
  );
}
