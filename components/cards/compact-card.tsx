import { Eye, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type CompactCardProps = {
  variant?: "default" | "reverse";
};

function CompactCard({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"article"> & CompactCardProps) {
  return (
    <article
      className={cn(
        "relative flex max-w-146 items-center gap-4 rounded-[1rem] border border-neutral-200 bg-primary py-4 pr-6 pl-4",
        variant === "reverse" && "flex-row-reverse pr-4 pl-6",
        className
      )}
      {...props}
    />
  );
}

function CompactCardImage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex h-21 w-27 shrink-0 rounded-[0.625rem] bg-neutral-200",
        className
      )}
      {...props}
    />
  );
}

function CompactCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "xs:mr-12 flex w-full flex-col justify-between gap-y-3",
        className
      )}
      {...props}
    />
  );
}

function CompactCardTitle({ className, ...props }: React.ComponentProps<"h6">) {
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

function CompactCardFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("xs:mr-18 flex flex-wrap justify-between gap-3", className)}
      {...props}
    />
  );
}

function CompactCardPublishedAt({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "font-medium text-[0.75rem] text-neutral-600 leading-[1.2]",
        className
      )}
      {...props}
    />
  );
}

function CompactCardReadingTime({
  children,
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "ml-1.5 font-medium text-[0.75rem] text-neutral-600 leading-[1.2]",
        className
      )}
      {...props}
    >
      • {children}
    </span>
  );
}

type CompactCardStatsProps = {
  commentsCount?: number;
  viewsCount?: number;
};

function CompactCardStats({
  commentsCount = 0,
  viewsCount = 0,
  className,
}: React.ComponentProps<"div"> & CompactCardStatsProps) {
  return (
    <div
      className={cn(
        "absolute right-6 bottom-4 flex items-center gap-x-4 text-neutral-600",
        className
      )}
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
  CompactCard,
  CompactCardImage,
  CompactCardContent,
  CompactCardTitle,
  CompactCardFooter,
  CompactCardPublishedAt,
  CompactCardReadingTime,
  CompactCardStats,
};
