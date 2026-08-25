import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const result: (number | "...")[] = [1];
  const rangeStart = Math.max(2, current - 1);
  const rangeEnd = Math.min(total - 1, current + 1);

  if (rangeStart === 3) result.push(2);
  else if (rangeStart > 3) result.push("...");

  for (let i = rangeStart; i <= rangeEnd; i++) result.push(i);

  if (rangeEnd === total - 2) result.push(total - 1);
  else if (rangeEnd < total - 2) result.push("...");

  result.push(total);
  return result;
}

function getMobilePageRange(current: number, total: number): (number | "...")[] {
  if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);

  const result: (number | "...")[] = [1];
  if (current > 2) result.push("...");
  if (current !== 1 && current !== total) result.push(current);
  if (current < total - 1) result.push("...");
  result.push(total);
  return result;
}

function PageButtons({
  pages,
  page,
  onPageChange,
}: {
  pages: (number | "...")[];
  page: number;
  onPageChange: (p: number) => void;
}) {
  return (
    <>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-sm select-none">
            ...
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            size="sm"
            className="min-w-9"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        )
      )}
    </>
  );
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex items-center gap-1 sm:hidden">
        <PageButtons pages={getMobilePageRange(page, totalPages)} page={page} onPageChange={onPageChange} />
      </div>
      <div className="hidden sm:flex items-center gap-1">
        <PageButtons pages={getPageRange(page, totalPages)} page={page} onPageChange={onPageChange} />
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
