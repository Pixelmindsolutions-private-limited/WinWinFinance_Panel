import { memo, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Builds: 1 … n-1 n n+1 … last
 * If only one page is hidden between two numbers, it is shown instead of "…".
 */
export function getPageItems(current, total) {
  const pages = [
    ...new Set([1, total, current - 1, current, current + 1]),
  ]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const items = [];
  pages.forEach((p, i) => {
    const prev = pages[i - 1];
    if (prev) {
      if (p - prev === 2) items.push(prev + 1);
      else if (p - prev > 2) items.push(`gap-${p}`);
    }
    items.push(p);
  });
  return items;
}

const baseBtn =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition-colors";

function Pagination({ page, totalPages, totalItems, pageSize, onChange }) {
  const items = useMemo(
    () => getPageItems(page, totalPages),
    [page, totalPages]
  );

  if (totalItems === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:justify-between sm:px-5">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{from}</span>–
        <span className="font-medium text-slate-700">{to}</span> of{" "}
        <span className="font-medium text-slate-700">{totalItems}</span>
      </p>

      <nav aria-label="Pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={`${baseBtn} border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ChevronLeft size={16} />
        </button>

        {/* Mobile: compact label */}
        <span className="px-2 text-sm text-slate-600 sm:hidden">
          Page {page} of {totalPages}
        </span>

        {/* ≥ sm: numbered buttons with ellipsis */}
        <div className="hidden items-center gap-1.5 sm:flex">
          {items.map((item) =>
            typeof item === "string" ? (
              <span key={item} className="px-1 text-slate-400">
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? "page" : undefined}
                className={`${baseBtn} ${
                  item === page
                    ? "border-winwin-600 bg-winwin-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className={`${baseBtn} border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

export default memo(Pagination);