import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  ChevronRight,
  Gamepad2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DesignSystem() {
  return (
    <>
      <header className="sticky top-0 z-10 flex flex-row items-center justify-between border-neutral-200 border-b bg-neutral-50 p-4">
        Design System
      </header>
      <main className="flex flex-col gap-8 p-8">
        <h1 className="text-center font-bold text-4xl">Example components</h1>

        <Button className="w-fit rounded-full" size="sm">
          <Gamepad2 />
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
            <ArrowLeft />
          </Button>
          <Button size="icon" variant="secondary">
            <ArrowRight />
          </Button>
        </div>

        <div className="flex gap-1.5">
          <Button
            className="border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white"
            size="icon"
          >
            <ArrowLeft />
          </Button>
          {Array.from({ length: 5 }).map((_, index) => (
            <Button
              className="border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white"
              // biome-ignore lint/suspicious/noArrayIndexKey : We need to use the index as the key in this case
              key={index}
              size="icon"
            >
              {index + 1}
            </Button>
          ))}
          <Button
            className="border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white"
            size="icon"
          >
            <ArrowRight />
          </Button>
        </div>

        <Button className="w-fit pl-4" size="xs">
          People
          <div className="rounded-md bg-neutral-100 px-1.5 py-1 font-medium text-xs">
            168
          </div>
        </Button>

        <Button className="group w-fit" size="auto" variant="ghost">
          <span className="rounded-full bg-neutral-900 p-1 text-system-white transition-colors group-hover:bg-neutral-900/90">
            <ChevronRight />
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
            <ArrowUpRight />
          </Button>
          <Button variant="secondary">
            View More Testimonials
            <ArrowUpRight />
          </Button>
          <Button variant="destructive">Delete</Button>
        </div>
      </main>
    </>
  );
}
