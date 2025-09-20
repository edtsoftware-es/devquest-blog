"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGES_AROUND_CURRENT = 1;

type PaginationNavigationProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export function PaginationNavigation({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}: PaginationNavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null;
  }

  const shouldShowStartEllipsis = currentPage > PAGES_AROUND_CURRENT + 2;
  const shouldShowEndEllipsis =
    currentPage < totalPages - PAGES_AROUND_CURRENT - 1;

  const rangeStart = Math.max(1, currentPage - PAGES_AROUND_CURRENT);
  const rangeEnd = Math.min(totalPages, currentPage + PAGES_AROUND_CURRENT);

  const pageNumbers = Array.from(
    { length: rangeEnd - rangeStart + 1 },
    (_, i) => rangeStart + i
  );

  const getPageHref = (page: number) => {
    if (page === 1) {
      return pathname;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious
              aria-label={`Ir a la página ${currentPage - 1}`}
              href={getPageHref(currentPage - 1)}
            />
          </PaginationItem>
        )}

        {rangeStart > 1 && (
          <PaginationItem>
            <PaginationLink
              aria-label="Ir a la página 1"
              href={getPageHref(1)}
              isActive={currentPage === 1}
            >
              1
            </PaginationLink>
          </PaginationItem>
        )}

        {shouldShowStartEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              aria-label={`Ir a la página ${pageNumber}`}
              href={getPageHref(pageNumber)}
              isActive={pageNumber === currentPage}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}

        {shouldShowEndEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {rangeEnd < totalPages && (
          <PaginationItem>
            <PaginationLink
              aria-label={`Ir a la página ${totalPages}`}
              href={getPageHref(totalPages)}
              isActive={totalPages === currentPage}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {hasNextPage && (
          <PaginationItem>
            <PaginationNext
              aria-label={`Ir a la página ${currentPage + 1}`}
              href={getPageHref(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
