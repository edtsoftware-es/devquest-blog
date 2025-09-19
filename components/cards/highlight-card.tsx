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
        "flex max-w-107 xs:max-w-69 flex-col gap-y-4 bg-transparent",
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
        <Button size="icon" type="button">
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

type HighlightCardCategoriesProps = {
  categories: { _id: string; slug: string; name: string }[];
};

function HighlightCardCategories({
  categories,
  className,
  ...props
}: React.ComponentProps<"div"> & HighlightCardCategoriesProps) {
  const MAX_BACKGROUND_VARIANTS = 5;
  return (
    <div
      className={cn(
        "absolute bottom-2 left-2 mr-16 flex flex-wrap-reverse items-center gap-1.5",
        className
      )}
      {...props}
    >
      {categories.map(({ _id, name }, index) => (
        <Badge
          className={`bg-background-${(index % MAX_BACKGROUND_VARIANTS) + 1}`}
          key={_id}
        >
          {name}
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
  HighlightCardCategories,
  HighlightCardTitle,
};
