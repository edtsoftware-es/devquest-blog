import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function HighlightCard({
  className,
  ...props
}: React.ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "group relative isolate flex flex-col gap-y-4 bg-transparent",
        className
      )}
      {...props}
    />
  );
}

function HighlightCardImageContainer({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-57 w-full overflow-hidden rounded-[1rem] rounded-br-[1.75rem] bg-neutral-200",
        className
      )}
      {...props}
    >
      {children}
      <div className="absolute right-2 bottom-2">
        <Button aria-label="Read full article" size="icon" type="button">
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

type HighlightCardTagsProps = {
  tags: string[];
};

function HighlightCardTags({
  tags,
  className,
  ...props
}: React.ComponentProps<"div"> & HighlightCardTagsProps) {
  const MAX_BACKGROUND_VARIANTS = 5;
  return (
    <div
      className={cn(
        "absolute bottom-2 left-2 mr-16 flex flex-wrap-reverse items-center gap-1.5",
        className
      )}
      {...props}
    >
      {tags.map((tag, index) => (
        <Badge
          className={`bg-background-${(index % MAX_BACKGROUND_VARIANTS) + 1}`}
          key={tag}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

function HighlightCardTitle({
  className,
  ...props
}: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(
        "line-clamp-2 font-semibold text-[1.125rem] text-neutral-900 leading-[1.2]",
        className
      )}
      {...props}
    />
  );
}

export {
  HighlightCard,
  HighlightCardImageContainer,
  HighlightCardTags,
  HighlightCardTitle,
};
