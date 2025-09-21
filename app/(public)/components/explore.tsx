import { Button } from "@/components/ui/button";
import type { Category } from "@/convex/lib/types";
import { cn } from "@/lib/utils";

export default function Explore({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex w-full max-w-[1024px] flex-col items-center justify-center gap-8",
        className
      )}
    >
      <h2 className="font-semibold text-secondary text-xl">
        Explora los trending topics
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {categories.map((category) => (
          <Button className="w-fit rounded-full" key={category.slug} size="xs">
            {category.name}
          </Button>
        ))}
      </div>
    </section>
  );
}
