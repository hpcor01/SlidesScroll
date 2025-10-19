import React from "react";

/**
 * Props:
 * - page: current page (1-based)
 * - perPage: number per page (default 10)
 * - total: total number of items
 * - onChange: function(newPage)
 */
export default function Pagination({ page, perPage = 10, total = 0, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  if (start > 1) pages.push(1);
  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < totalPages - 1) pages.push("...");
  if (end < totalPages) pages.push(totalPages);

  return (
    <nav aria-label="Paginação">
      <ul className="pagination" style={{ display: "flex", gap: 8, listStyle: "none", padding: 0 }}>
        <li>
          <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} aria-label="Página anterior">
            &laquo;
          </button>
        </li>

        {pages.map((p, idx) =>
          p === "..." ? (
            <li key={`dot-${idx}`} style={{ padding: "6px 8px" }}>
              ...
            </li>
          ) : (
            <li key={p}>
              <button
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                style={{
                  fontWeight: p === page ? "600" : "400",
                  textDecoration: p === page ? "underline" : "none",
                }}
              >
                {p}
              </button>
            </li>
          )
        )}

        <li>
          <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} aria-label="Próxima página">
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}