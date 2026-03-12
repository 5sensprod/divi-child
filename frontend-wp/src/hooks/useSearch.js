// src/hooks/useSearch.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { useProductSearch } from "./useProductSearch";

const DEFAULT_FILTERS = {
  category: "",
  priceRange: "all",
  availability: "all",
  sortBy: "name-asc",
};

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState(null);

  const {
    results,
    loading,
    error,
    hasSearched,
    search,
    clearSearch,
    getRecentSearches,
    page,
    perPage,
    total,
    totalPages,
    gotoPage,
    nextPage,
    prevPage,
  } = useProductSearch();

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(
      ([key, value]) => value !== DEFAULT_FILTERS[key],
    );
  }, [filters]);

  const performSearch = useCallback(() => {
    if (!query.trim() && !hasActiveFilters) return;
    search(query, filters, 1);
  }, [query, filters, hasActiveFilters, search]);

  // Debounce
  useEffect(() => {
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const updateQuery = useCallback((newQuery) => setQuery(newQuery), []);
  const updateFilters = useCallback(
    (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters })),
    [],
  );

  const clearQuery = useCallback(() => {
    setQuery("");
    clearSearch();
  }, [clearSearch]);

  const openSearch = useCallback(() => setIsOpen(true), []);
  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setExpandedProduct(null);
  }, []);

  const toggleProductExpansion = useCallback((productId) => {
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  }, []);

  const isEmpty = !query.trim() && !hasActiveFilters;
  const hasResults = results.length > 0;
  const showEmpty = hasSearched && !hasResults && !isEmpty;
  const showSuggestions = isEmpty && !hasSearched;

  return {
    query,
    filters,
    isOpen,
    results,
    loading,
    error,
    hasSearched,
    expandedProduct,
    hasActiveFilters,
    isEmpty,
    hasResults,
    showEmpty,
    showSuggestions,
    page,
    perPage,
    total,
    totalPages,
    gotoPage,
    nextPage,
    prevPage,
    updateQuery,
    updateFilters,
    resetFilters,
    clearQuery,
    openSearch,
    closeSearch,
    performSearch,
    toggleProductExpansion,
    recentSearches: getRecentSearches(),
  };
};
