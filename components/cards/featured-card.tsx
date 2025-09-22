import { ArrowRight, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

function FeaturedCard({
  className,
  ...props
}: React.ComponentProps<"article">) {
  return (
    <article
      className={cn("relative h-100 max-w-146 gap-2.5 lg:h-141", className)}
      {...props}
    />
  );
}

function FeaturedCardImageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-71 overflow-hidden rounded-[1rem] bg-neutral-200 lg:h-105",
        className
      )}
      {...props}
    />
  );
}

function FeaturedCardShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group absolute bottom-0 isolate flex min-h-53 w-full justify-center lg:min-h-64",
        className
      )}
      {...props}
    >
      <div className="relative flex w-11/12 rounded-[1rem] border bg-primary/60 backdrop-blur-lg transition-all duration-300 group-hover:border-neutral-600">
        <div className="flex h-full w-full flex-col gap-y-6 p-6 xs:p-8 pb-5 xs:pb-6 lg:p-10 lg:pb-8">
          <div className="flex h-full flex-col gap-y-3">{children}</div>
        </div>

        {/* Corner decorations */}
        <div className="-right-[1px] absolute bottom-[53px] z-10 size-6">
          <div className="absolute size-full bg-background" />
          <div className="absolute size-full rounded-br-[1rem] border-neutral-200 border-r border-b bg-primary/60 transition-all duration-300 group-hover:border-neutral-600" />
        </div>
        <div className="-bottom-[1px] absolute right-[53px] z-10 size-6">
          <div className="absolute size-full bg-background" />
          <div className="absolute size-full rounded-br-[1rem] border-neutral-200 border-r border-b bg-primary/60 transition-all duration-300 group-hover:border-neutral-600" />
        </div>

        {/* Footer button */}
        <div className="-right-[1px] -bottom-[1px] absolute h-[55px] w-[55px]">
          <div className="absolute size-full bg-transparent" />
          <div className="absolute size-full rounded-tl-[1.75rem] border-neutral-200 border-t border-l bg-background transition-all duration-300 group-hover:border-neutral-600">
            <div className="absolute right-0 bottom-0">
              <Button
                aria-label="Read full article"
                className="transition-all duration-300 group-hover:border-neutral-600"
                size="icon"
                type="button"
              >
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FeaturedCardTagsProps = {
  tags: string[];
};

function FeaturedCardTags({
  tags,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & FeaturedCardTagsProps) {
  const MAX_BACKGROUND_VARIANTS = 5;
  return (
    <div
      className={cn("flex flex-wrap items-center gap-1.5", className)}
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

function FeaturedCardPublishedAt({
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

function FeaturedCardReadingTime({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-medium xs:font-normal text-[0.75rem] text-neutral-600 xs:text-[0.875rem] leading-[1.2] xs:leading-[1.5]",
        className
      )}
      {...props}
    >
      • {children}
    </span>
  );
}

function FeaturedCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-y-3", className)} {...props} />;
}

function FeaturedCardHeader({
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

function FeaturedCardTitle({
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

function FeaturedCardDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "mr-12 line-clamp-2 font-medium xs:font-normal text-[0.75rem] text-neutral-600 xs:text-[0.875rem] leading-[1.2] xs:leading-[1.5] lg:mr-8",
        className
      )}
      {...props}
    />
  );
}

function FeaturedCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-auto mr-12 flex flex-wrap justify-between gap-3 lg:mr-8",
        className
      )}
      {...props}
    />
  );
}

function FeaturedCardAuthorContainer({
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

function FeaturedCardAuthor({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props} />
  );
}

function FeaturedCardAuthorName({
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

type FeaturedCardStatsProps = {
  commentsCount?: number;
  viewsCount?: number;
};

function FeaturedCardStats({
  commentsCount = 0,
  viewsCount = 0,
  className,
}: React.ComponentProps<"div"> & FeaturedCardStatsProps) {
  return (
    <div
      className={cn("flex items-center gap-x-4 text-neutral-600", className)}
    >
      <div className="flex items-center gap-x-1">
        <MessageSquare className="size-4" />
        <span className="font-medium text-[0.75rem] text-neutral-600 leading-[1.2]">
          {commentsCount}
        </span>
      </div>
      <div className="flex items-center gap-x-1">
        <Eye className="size-4" />
        <span className="font-medium text-[0.75rem] text-neutral-600 leading-[1.2]">
          {viewsCount}
        </span>
      </div>
    </div>
  );
}

export {
  FeaturedCard,
  FeaturedCardImageContainer,
  FeaturedCardShell,
  FeaturedCardTags,
  FeaturedCardPublishedAt,
  FeaturedCardReadingTime,
  FeaturedCardContent,
  FeaturedCardHeader,
  FeaturedCardTitle,
  FeaturedCardDescription,
  FeaturedCardFooter,
  FeaturedCardAuthorContainer,
  FeaturedCardAuthor,
  FeaturedCardAuthorName,
  FeaturedCardStats,
};
