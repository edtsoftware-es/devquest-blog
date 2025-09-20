// biome-ignore-all lint/a11y: Custom pagination component with appropriate accessibility handling
// biome-ignore-all lint/nursery/useAnchorHref: href not required as anchor elements are used as buttons for pagination navigation

import { ArrowLeft, ArrowRight, MoreHorizontalIcon } from "lucide-react";
import type * as React from "react";
import { type Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      data-slot="pagination"
      role="navigation"
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      data-slot="pagination-content"
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      className={cn(
        buttonVariants({
          variant: isActive ? "secondary" : "default",
          size,
        }),
        !isActive &&
          "border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white",
        "size-9 xs:size-12",
        className
      )}
      data-active={isActive}
      data-slot="pagination-link"
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  size = "icon",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Ir a la página anterior"
      className={cn(
        buttonVariants({
          variant: "default",
          size,
        }),
        "size-9 xs:size-12 gap-0 border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white",
        className
      )}
      {...props}
    >
      <span className="sr-only">Anterior</span>
      <ArrowLeft aria-hidden="true" />
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  size = "icon",
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Ir a la página siguiente"
      className={cn(
        buttonVariants({
          variant: "default",
          size,
        }),
        "size-9 xs:size-12 gap-0 border-none bg-neutral-100 hover:bg-neutral-900 hover:text-system-white",
        className
      )}
      {...props}
    >
      <span className="sr-only">Siguiente</span>
      <ArrowRight aria-hidden="true" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-6 xs:size-9 items-center justify-center",
        className
      )}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Más páginas</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
