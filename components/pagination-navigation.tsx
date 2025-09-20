"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const navigateToPage = (page: number) => {
    if (page === 1) {
      router.push(pathname);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
    return;
  };

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

  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious
              aria-label={`Ir a la página ${currentPage - 1}`}
              onClick={() => navigateToPage(currentPage - 1)}
            />
          </PaginationItem>
        )}

        {rangeStart > 1 && (
          <PaginationItem>
            <PaginationLink
              aria-label="Ir a la página 1"
              isActive={currentPage === 1}
              onClick={() => navigateToPage(1)}
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
              isActive={pageNumber === currentPage}
              onClick={() => navigateToPage(pageNumber)}
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
              isActive={totalPages === currentPage}
              onClick={() => navigateToPage(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {hasNextPage && (
          <PaginationItem>
            <PaginationNext
              aria-label={`Ir a la página ${currentPage + 1}`}
              onClick={() => navigateToPage(currentPage + 1)}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
