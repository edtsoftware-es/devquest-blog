import { ArrowRight, Clock, Eye, MessageSquare } from "lucide-react";
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
        "group relative isolate grid max-w-300 grid-cols-1 grid-rows-[auto_1fr] gap-2.5 lg:grid-cols-[auto_1fr] lg:grid-rows-1 lg:gap-3.5",
        variant === "compact" && "lg:grid-cols-1 lg:grid-rows-[auto_1fr]",
        className
      )}
      {...props}
    />
  );
}

function StandardCardImageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-63 overflow-hidden rounded-[1rem] bg-neutral-200 lg:h-80 lg:w-80",
        className
      )}
      {...props}
    />
  );
}

function StandardCardShell({
  className,
  children,
  hasButton = true,
  ...props
}: React.ComponentProps<"div"> & { hasButton?: boolean }) {
  return (
    <div
      className={cn(
        "flex h-full w-full rounded-[1rem] border bg-primary transition-all duration-300 group-hover:border-neutral-600",
        className
      )}
      {...props}
    >
      <div className="flex h-full w-full flex-col gap-y-6 p-6 xs:p-8 pb-5 xs:pb-6">
        <div className="flex h-full flex-col gap-y-3">{children}</div>
      </div>

      {hasButton && (
        <>
          {/* Corner decorations */}
          <div className="absolute right-0 bottom-[53px] z-10 size-6">
            <div className="absolute size-full bg-background" />
            <div className="absolute size-full rounded-br-[1rem] border-neutral-200 border-r border-b bg-primary transition-all duration-300 group-hover:border-neutral-600" />
          </div>
          <div className="absolute right-[53px] bottom-0 z-10 size-6">
            <div className="absolute size-full bg-background" />
            <div className="absolute size-full rounded-br-[1rem] border-neutral-200 border-r border-b bg-primary transition-all duration-300 group-hover:border-neutral-600" />
          </div>

          {/* Footer button */}
          <div className="absolute right-0 bottom-0 h-[54px] w-[54px]">
            <div className="absolute size-full bg-transparent" />
            <div className="absolute size-full rounded-tl-[1.75rem] border-neutral-200 border-t border-l bg-background transition-all duration-300 group-hover:border-neutral-600">
              <div className="absolute right-0 bottom-0">
                <Button
                  className="transition-all duration-300 group-hover:border-neutral-600"
                  size="icon"
                  type="button"
                >
                  <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

type StandardCardTagsProps = {
  tags: string[];
};

function StandardCardTags({
  tags,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & StandardCardTagsProps) {
  const MAX_BACKGROUND_VARIANTS = 5;
  return (
    <div
      className={cn("flex flex-wrap-reverse items-center gap-1.5", className)}
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
      {children}
    </div>
  );
}

function StandardCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-y-3", className)} {...props} />;
}

function StandardCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-baseline gap-1.5", className)}
      {...props}
    />
  );
}

function StandardCardTitle({
  className,
  ...props
}: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn(
        "line-clamp-2 font-semibold text-[1.125rem] text-neutral-900 xs:text-[1.5625rem] leading-[1.2] lg:text-[1.9375rem]",
        className
      )}
      {...props}
    />
  );
}

function StandardCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mr-12 line-clamp-5 font-medium xs:font-normal text-[0.75rem] text-neutral-600 xs:text-[0.875rem] leading-[1.2] xs:leading-[1.5]",
        className
      )}
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
      className={cn(
        "mt-auto mr-12 flex flex-wrap justify-between gap-3",
        className
      )}
      {...props}
    />
  );
}

function StandardCardAuthorContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
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
      className={cn(
        "max-w-40 overflow-hidden overflow-ellipsis whitespace-nowrap font-medium xs:font-normal text-[0.75rem] text-neutral-900 xs:text-[0.875rem] leading-[1.2] xs:leading-[1.5]",
        className
      )}
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
      className={cn(
        "font-medium xs:font-normal text-[0.75rem] text-neutral-600 xs:text-[0.875rem] capitalize leading-[1.2] xs:leading-[1.5]",
        className
      )}
      {...props}
    >
      • {children}
    </span>
  );
}

type StandardCardStatsProps = {
  duration?: number;
  commentsCount?: number;
  viewsCount?: number;
};

function StandardCardStats({
  duration,
  commentsCount = 0,
  viewsCount = 0,
  className,
}: React.ComponentProps<"div"> & StandardCardStatsProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-end gap-x-3 text-neutral-600",
        className
      )}
    >
      {duration !== undefined && (
        <div className="flex items-center gap-x-1">
          <Clock className="size-3 shrink-0" />
          <span className="whitespace-nowrap font-medium text-[0.75rem] text-neutral-600 leading-[1.2]">
            {duration} min
          </span>
        </div>
      )}
      <div className="flex items-center gap-x-1">
        <MessageSquare className="size-3 shrink-0" />
        <span className="font-medium text-[0.75rem] text-neutral-600 leading-[1.2]">
          {commentsCount}
        </span>
      </div>
      <div className="flex items-center gap-x-1">
        <Eye className="size-3 shrink-0" />
        <span className="font-medium text-[0.75rem] text-neutral-600 leading-[1.2]">
          {viewsCount}
        </span>
      </div>
    </div>
  );
}

export {
  StandardCard,
  StandardCardImageContainer,
  StandardCardShell,
  StandardCardTags,
  StandardCardContent,
  StandardCardHeader,
  StandardCardTitle,
  StandardCardDescription,
  StandardCardFooter,
  StandardCardAuthorContainer,
  StandardCardAuthor,
  StandardCardAuthorName,
  StandardCardPublishedAt,
  StandardCardStats,
};
