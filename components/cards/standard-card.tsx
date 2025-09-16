import { ArrowRight, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type StandardCardProps = {
  variant?: "default" | "compact";
};

function StandardCard({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"article"> & StandardCardProps) {
  return (
    <article
      className={cn(
        "relative grid max-w-300 grid-cols-1 grid-rows-[auto_auto] gap-2.5 lg:grid-cols-[auto_auto] lg:grid-rows-1 lg:gap-3.5",
        variant === "compact" && "lg:grid-cols-1 lg:grid-rows-[auto_auto]",
        className
      )}
      {...props}
    />
  );
}

function StandardCardImage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-63 rounded-[1rem] bg-neutral-200 lg:h-80 lg:min-w-80",
        className
      )}
      {...props}
    />
  );
}

function StandardCardShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-full w-full rounded-[1rem] border bg-primary",
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full flex-col gap-y-6 p-6 xs:p-8">
        <div className="flex h-full flex-col justify-between gap-y-3">
          {children}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute right-0 bottom-[53px] z-10 size-6">
        <div className="absolute size-full bg-background" />
        <div className="absolute size-full rounded-br-[1rem] border-neutral-200 border-r border-b bg-primary" />
      </div>
      <div className="absolute right-[53px] bottom-0 z-10 size-6">
        <div className="absolute size-full bg-background" />
        <div className="absolute size-full rounded-br-[1rem] border-neutral-200 border-r border-b bg-primary" />
      </div>

      {/* Footer button */}
      <div className="absolute right-0 bottom-0 h-[54px] w-[54px]">
        <div className="absolute size-full bg-primary" />
        <div className="absolute size-full rounded-tl-[1.75rem] border-neutral-200 border-t border-l bg-background">
          <div className="absolute right-0 bottom-0">
            <Button size="icon" type="button">
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StandardCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-y-3", className)} {...props} />;
}

type StandardCardCategoriesProps = {
  categories: { _id: string; slug: string; name: string }[];
};

function StandardCardCategories({
  categories,
  className,
  ...props
}: React.ComponentProps<"div"> & StandardCardCategoriesProps) {
  const MAX_BACKGROUND_VARIANTS = 5;
  return (
    <div
      className={cn("flex flex-wrap-reverse items-center gap-2", className)}
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

function StandardCardTitle({
  className,
  ...props
}: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(
        "font-semibold text-[1.125rem] text-neutral-900 xs:text-[1.5625rem] leading-[1.2] lg:text-[1.9375rem]",
        className
      )}
      {...props}
    />
  );
}

function StandardCardReadingTime({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-1.5 font-medium text-[0.75rem] text-neutral-600 xs:text-[0.875rem] leading-[1.2] lg:text-[1rem]",
        className
      )}
      {...props}
    >
      • {children}
    </span>
  );
}

function StandardCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mr-12 flex h-full flex-col justify-between gap-y-3",
        className
      )}
      {...props}
    />
  );
}

function StandardCardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("line-clamp-5 max-h-42 overflow-hidden", className)}
      {...props}
    />
  );
}

function StandardCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap justify-between gap-3", className)}
      {...props}
    />
  );
}

function StandardCardAuthor({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props} />
  );
}

function StandardCardAuthorName({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("text-body-7 text-neutral-900", className)}
      {...props}
    />
  );
}

function StandardCardPublishedAt({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn("ml-1.5 text-body-7 text-neutral-600", className)}
      {...props}
    >
      • {children}
    </span>
  );
}

type StandardCardStatsProps = {
  commentsCount?: number;
  viewsCount?: number;
};

function StandardCardStats({
  commentsCount = 0,
  viewsCount = 0,
  className,
}: React.ComponentProps<"div"> & StandardCardStatsProps) {
  return (
    <div
      className={cn("flex items-center gap-x-4 text-neutral-600", className)}
    >
      <div className="flex items-center gap-x-1">
        <MessageSquare className="size-4" />
        <span className="text-body-8 text-neutral-600">{commentsCount}</span>
      </div>
      <div className="flex items-center gap-x-1">
        <Eye className="size-4" />
        <span className="text-body-8 text-neutral-600">{viewsCount}</span>
      </div>
    </div>
  );
}

export {
  StandardCard,
  StandardCardImage,
  StandardCardShell,
  StandardCardHeader,
  StandardCardCategories,
  StandardCardTitle,
  StandardCardReadingTime,
  StandardCardContent,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardAuthor,
  StandardCardAuthorName,
  StandardCardPublishedAt,
  StandardCardStats,
};
