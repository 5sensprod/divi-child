// src/components/UI/Pagination.jsx
import React from "react";

/**
 * Pagination réutilisable (même logique que ProductList.jsx)
 * Props:
 * - currentPage (number)
 * - totalPages (number)
 * - onChange(pageNumber: number)
 * - className (string) - optionnel
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  const go = (p) => {
    if (!onChange) return;
    const page = Math.max(1, Math.min(totalPages, p));
    if (page !== currentPage) onChange(page);
  };

  return (
    <div className={`flex justify-center items-center gap-2 mt-8 ${className}`}>
      <button
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Précédent
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <button
                key={page}
                onClick={() => go(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="px-2">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <button
        onClick={() => go(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Suivant
      </button>
    </div>
  );
};

export default Pagination;
