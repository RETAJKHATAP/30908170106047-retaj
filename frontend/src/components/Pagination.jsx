import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary !px-2 !py-2"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pageNumbers.map((n, idx) => {
        const prev = pageNumbers[idx - 1];
        const showEllipsis = prev && n - prev > 1;
        return (
          <span key={n} className="flex items-center gap-1">
            {showEllipsis && <span className="px-1 text-slate-400">&hellip;</span>}
            <button
              onClick={() => onPageChange(n)}
              aria-current={n === page ? 'page' : undefined}
              className={
                n === page
                  ? 'rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white'
                  : 'rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100'
              }
            >
              {n}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="btn-secondary !px-2 !py-2"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
