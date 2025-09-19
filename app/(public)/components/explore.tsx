import { Gamepad2 } from "lucide-react";
import type { JSX } from "react/jsx-dev-runtime";
import { Button } from "@/components/ui/button";

export const MockCategories: Topic[] = [
  {
    slug: "gaming",
    name: "Gaming",
    image: <Gamepad2 aria-hidden="true" />,
  },
  {
    slug: "programming",
    name: "Programming",
    image: <Gamepad2 aria-hidden="true" />,
  },
  {
    slug: "design",
    name: "Design",
    image: <Gamepad2 aria-hidden="true" />,
  },
  {
    slug: "technology",
    name: "Technology",
    image: <Gamepad2 aria-hidden="true" />,
  },
  {
    slug: "science",
    name: "Science",
    image: <Gamepad2 aria-hidden="true" />,
  },
  {
    slug: "art",
    name: "Art",
    image: <Gamepad2 aria-hidden="true" />,
  },
  { slug: "music", name: "Music", image: <Gamepad2 aria-hidden="true" /> },
  { slug: "travel", name: "Travel", image: <Gamepad2 aria-hidden="true" /> },
  { slug: "food", name: "Food", image: <Gamepad2 aria-hidden="true" /> },
  { slug: "health", name: "Health", image: <Gamepad2 aria-hidden="true" /> },
  { slug: "fitness", name: "Fitness", image: <Gamepad2 aria-hidden="true" /> },
];

type Topic = {
  slug: string;
  name: string;
  image: JSX.Element;
};

export default function Explore({
  categories,
  className,
}: {
  categories: Topic[];
  className?: string;
}) {
  return (
    <main
      className={`flex w-full max-w-[1024px] flex-col items-center justify-center gap-8 ${className}`}
    >
      <p className="text-secondary text-xl">Explora los trending topics</p>
      <section className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((category) => (
          <Button className="w-fit rounded-full" key={category.slug} size="xs">
            {category.image}
            {category.name}
          </Button>
        ))}
      </section>
    </main>
  );
}
