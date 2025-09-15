import { ArrowRight, Eye, MessageSquare } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

export type StandardCardProps = {
  children?: ReactNode;
  variant?: "default" | "compact";
  onAction?: () => void;
  actionLabel?: string;
  disabled?: boolean;
};

export function StandardCard({
  children,
  variant = "default",
  onAction,
  actionLabel = "Ver detalles",
  disabled = false,
  className,
  ...props
}: React.ComponentProps<"article"> & StandardCardProps) {
  return (
    <article className={cn("relative max-w-200", className)} {...props}>
      <StandardCardShell
        actionLabel={actionLabel}
        disabled={disabled}
        onAction={onAction}
        variant={variant}
      >
        {children}
      </StandardCardShell>
    </article>
  );
}

type StandardCardShellProps = {
  variant?: "default" | "compact";
  onAction?: () => void;
  actionLabel?: string;
  disabled?: boolean;
};

function StandardCardShell({
  className,
  children,
  variant,
  actionLabel = "Ver detalles",
  disabled = false,
  onAction,
  ...props
}: React.ComponentProps<"div"> & StandardCardShellProps) {
  return (
    <div
      className={cn("size-full rounded-[1rem] border bg-primary", className)}
      {...props}
    >
      {children}

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
            <Button
              aria-label={actionLabel}
              disabled={disabled}
              onClick={onAction}
              size="icon"
              type="button"
            >
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StandardCardHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex max-w-169 flex-col gap-y-3", className)}
      {...props}
    />
  );
}

type StandardCardCategoriesProps = {
  categories: { _id: string; slug: string; name: string }[];
};

export function StandardCardCategories({
  categories,
  className,
  ...props
}: React.ComponentProps<"div"> & StandardCardCategoriesProps) {
  return (
    <div className={cn("flex items-center gap-x-2", className)} {...props}>
      {categories.map(({ _id, name }, index) => (
        <Badge className={`bg-background-${index + 1}`} key={_id}>
          {name}
        </Badge>
      ))}
    </div>
  );
}

export function StandardCardTitle({
  className,
  ...props
}: React.ComponentProps<"h6">) {
  return (
    <h6
      className={cn("text-heading-6 text-neutral-900", className)}
      {...props}
    />
  );
}

export function StandardCardReadingTime({
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span className="ml-1.5 text-body-8 text-neutral-600" {...props}>
      • {children}
    </span>
  );
}

export function StandardCardContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mr-10 flex max-w-169 flex-col gap-y-3", className)}
      {...props}
    />
  );
}

export function StandardCardFooter({
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

export function StandardCardAuthor({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-1.5", className)} {...props} />
  );
}

export function StandardCardAuthorName({
  ...props
}: React.ComponentProps<"span">) {
  return <span className="text-body-7 text-neutral-900" {...props} />;
}

export function StandardCardPublishedAt({
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span className="ml-1.5 text-body-7 text-neutral-600" {...props}>
      • {children}
    </span>
  );
}

type StandardCardStatsProps = {
  commentsCount?: number;
  viewsCount?: number;
};

export function StandardCardStats({
  commentsCount = 0,
  viewsCount = 0,
}: StandardCardStatsProps) {
  return (
    <div className="flex items-center gap-x-4 text-neutral-600">
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
