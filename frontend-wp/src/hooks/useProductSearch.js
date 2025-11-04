// src/hooks/useProductSearch.js
import { useState, useCallback, useRef, useEffect } from "react";
import { searchProducts } from "../services/woocommerce";

const mapFiltersToWooParams = (filters = {}) => {
  const params = {};

  // Catégorie
  if (filters.category) {
    params.category = String(filters.category);
  }

  // Prix
  if (filters.priceRange && filters.priceRange !== "all") {
    const [min, max] = filters.priceRange.split("-");
    if (min && min !== "0") params.min_price = Number(min);
    if (max && !max.includes("+")) params.max_price = Number(max);
    if (filters.priceRange === "500+") params.min_price = 500;
  }

  // Disponibilité
  if (filters.availability && filters.availability !== "all") {
    if (filters.availability === "in-stock") params.stock_status = "instock";
    if (filters.availability === "pre-order")
      params.stock_status = "onbackorder";
  }

  // Tri
  switch (filters.sortBy) {
    case "price-asc":
      params.orderby = "price";
      params.order = "asc";
      break;
    case "price-desc":
      params.orderby = "price";
      params.order = "desc";
      break;
    case "name-asc":
      params.orderby = "title";
      params.order = "asc";
      break;
    case "name-desc":
      params.orderby = "title";
      params.order = "desc";
      break;
    case "date-desc":
      params.orderby = "date";
      params.order = "desc";
      break;
    case "relevance":
      // WooCommerce ne classe par pertinence que lorsqu'il y a `search`
      params.orderby = "relevance";
      break;
    default:
      break;
  }

  return params;
};

export const useProductSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // garder perPage courant sans recréer les callbacks
  const perPageRef = useRef(perPage);
  useEffect(() => {
    perPageRef.current = perPage;
  }, [perPage]);

  // Pour relancer la même recherche quand on change uniquement la page
  const lastQueryRef = useRef({ q: "", filters: {} });

  // ➜ Fonction stable (réf. ne change jamais)
  const runSearch = useCallback(async (q, filters, pageArg, perPageArg) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...mapFiltersToWooParams(filters),
        page: pageArg ?? 1,
        per_page: perPageArg ?? perPageRef.current,
      };

      const res = await searchProducts(q, params);

      setResults(res.data || []);
      setTotal(res.pagination.total || 0);
      setTotalPages(res.pagination.totalPages || 0);
      setPerPage(res.pagination.perPage || perPageRef.current);
      setHasSearched(true);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Une erreur est survenue lors de la recherche."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []); // ❗ aucune dépendance (stable)

  // ➜ search stable; ne dépend plus de `page`
  const search = useCallback(
    async (q, filters, pageArg = 1) => {
      lastQueryRef.current = { q, filters };
      setPage(pageArg);
      await runSearch(q, filters, pageArg, perPageRef.current);
    },
    [runSearch]
  );

  const gotoPage = useCallback(
    async (newPage) => {
      const { q, filters } = lastQueryRef.current;
      const pageNum = Math.max(1, newPage);
      setPage(pageNum);
      await runSearch(q, filters, pageNum, perPageRef.current);
    },
    [runSearch]
  );

  const nextPage = useCallback(async () => {
    if (page < totalPages) {
      await gotoPage(page + 1);
    }
  }, [page, totalPages, gotoPage]);

  const prevPage = useCallback(async () => {
    if (page > 1) {
      await gotoPage(page - 1);
    }
  }, [page, gotoPage]);

  const clearSearch = useCallback(() => {
    setResults([]);
    setHasSearched(false);
    setError(null);
    setTotal(0);
    setTotalPages(0);
    setPage(1);
  }, []);

  const getRecentSearches = useCallback(() => {
    try {
      const raw = localStorage.getItem("recent_searches");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  return {
    results,
    loading,
    error,
    hasSearched,
    page,
    perPage,
    total,
    totalPages,
    search,
    gotoPage,
    nextPage,
    prevPage,
    clearSearch,
    getRecentSearches,
  };
};
