import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getVisiblePageNumbers = (currentPage: number, totalPages: number) => {
  const maxButtons = 5;
  const pages: (number | "...")[] = [];

  if (totalPages <= maxButtons) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }
  return pages.filter(
    (item, index) => item !== "..." || pages[index - 1] !== "..."
  );
};

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) {
    return null;
  }
  const visiblePages = getVisiblePageNumbers(currentPage, totalPages);

  return (
    <Pagination className="mt-4">
      <PaginationContent>
        {/* PREVIOUS Button */}
        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="gap-1 pl-2.5"
          >
            Previous
          </Button>
        </PaginationItem>

        {visiblePages.map((pageNumber, index) => (
          <PaginationItem key={index}>
            {pageNumber === "..." ? (
              <span className="text-sm text-zinc-400 px-2 py-1">...</span>
            ) : (
              <PaginationLink
                isActive={pageNumber === currentPage}
                onClick={() => onPageChange(pageNumber as number)}
                className="cursor-pointer"
              >
                {pageNumber}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="gap-1 pr-2.5"
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
