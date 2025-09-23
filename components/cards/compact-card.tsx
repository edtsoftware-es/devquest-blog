import { Clock, Eye, MessageSquare } from "lucide-react";
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
        "relative isolate flex max-w-146 items-center gap-4 rounded-[1rem] border border-neutral-200 bg-primary py-4 pr-6 pl-4 transition-all duration-300 hover:border-neutral-600",
        variant === "reverse" && "flex-row-reverse pr-4 pl-6",
        className
      )}
      {...props}
    />
  );
}

function CompactCardImageContainer({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative flex h-21 w-27 shrink-0 overflow-hidden rounded-[0.625rem] bg-neutral-200",
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
      className={cn("xs:mr-18 flex flex-wrap gap-1.5", className)}
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
        "font-medium text-[0.75rem] text-neutral-600 capitalize leading-[1.2]",
        className
      )}
      {...props}
    />
  );
}

type CompactCardStatsProps = {
  duration?: number;
  commentsCount?: number;
  viewsCount?: number;
};

function CompactCardStats({
  duration,
  commentsCount = 0,
  viewsCount = 0,
  className,
}: React.ComponentProps<"div"> & CompactCardStatsProps) {
  return (
    <div
      className={cn(
        "absolute right-6 bottom-4 flex items-center gap-x-3 text-neutral-600",
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
  CompactCard,
  CompactCardImageContainer,
  CompactCardContent,
  CompactCardTitle,
  CompactCardFooter,
  CompactCardPublishedAt,
  CompactCardStats,
};
