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
import { ModeToggle } from "@/components/mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function DesignSystem() {
  return (
    <>
      <header className="sticky top-0 z-10 flex flex-row items-center justify-between border-neutral-200 border-b bg-neutral-50 px-4 py-2 font-semibold text-lg">
        Design System
        <ModeToggle />
      </header>
      <main className="flex flex-col gap-16 p-8">
        <section className="flex flex-col gap-4">
          <h2 className="mb-4 font-bold text-4xl">BUTTONS</h2>

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
            <Button size="icon">
              <ArrowLeft aria-hidden="true" />
            </Button>
            <Button size="icon" variant="secondary">
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>

          <div className="flex gap-1.5">
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

          <div className="flex gap-x-10">
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
          <h2 className="mb-4 font-bold text-4xl">BADGES</h2>

          <div className="flex items-center gap-x-2">
            <Badge variant="highlight">
              <Zap />
            </Badge>
            <Badge variant="highlight">New</Badge>
          </div>

          <div className="flex items-center gap-x-2">
            <Badge>2024 - 2025</Badge>
            <Badge className="bg-background-1">Frontend</Badge>
            <Badge className="bg-background-2">Backend</Badge>
            <Badge className="bg-background-4">Fullstack</Badge>
            <Badge className="bg-background-5">Mobile</Badge>
            <Badge className="bg-background-3">DevOps</Badge>
          </div>

          <div className="flex items-center gap-x-2">
            <h3 className="font-bold text-3xl">Trends</h3>
            <Badge variant="secondary">85</Badge>
          </div>

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
      </main>
    </>
  );
}
