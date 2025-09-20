import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function HomePagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  nextPageAction,
}: {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPageAction: () => void;
}) {
  return (
    <Pagination>
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationItem>
            <PaginationPrevious
              aria-label={`Ir a la página ${currentPage - 1}`}
              href={""}
            />
          </PaginationItem>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                aria-label={`Ir a la página ${pageNumber}`}
                href={""}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        {hasNextPage && (
          <PaginationItem>
            <PaginationNext
              aria-label={`Ir a la página ${currentPage + 1}`}
              href={""}
              onClick={nextPageAction}
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
