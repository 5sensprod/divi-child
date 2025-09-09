// src/hooks/useSearch.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { useProductSearch } from "./useProductSearch";

const DEFAULT_FILTERS = {
  category: "",
  priceRange: "all",
  availability: "all",
  sortBy: "relevance",
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
  } = useProductSearch();

  // Vérifie si des filtres sont actifs
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      return value !== DEFAULT_FILTERS[key];
    });
  }, [filters]);

  // Fonction de recherche optimisée
  const performSearch = useCallback(() => {
    if (!query.trim() && !hasActiveFilters) {
      return;
    }
    search(query, filters);
  }, [query, filters, hasActiveFilters, search]);

  // Déclenchement automatique de la recherche
  useEffect(() => {
    const timeoutId = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [performSearch]);

  // Gestionnaires
  const updateQuery = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const clearQuery = useCallback(() => {
    setQuery("");
  }, []);

  const openSearch = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setFilters(DEFAULT_FILTERS);
    setExpandedProduct(null);
    clearSearch();
  }, [clearSearch]);

  const toggleProductExpansion = useCallback((productId) => {
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  }, []);

  // État calculé
  const isEmpty = !query.trim() && !hasActiveFilters;
  const hasResults = results.length > 0;
  const showEmpty = hasSearched && !hasResults && !isEmpty;
  const showSuggestions = isEmpty && !hasSearched;

  return {
    // État
    query,
    filters,
    isOpen,
    results,
    loading,
    error,
    hasSearched,
    expandedProduct,

    // État calculé
    hasActiveFilters,
    isEmpty,
    hasResults,
    showEmpty,
    showSuggestions,

    // Actions
    updateQuery,
    updateFilters,
    resetFilters,
    clearQuery,
    openSearch,
    closeSearch,
    performSearch,
    toggleProductExpansion,

    // Données
    recentSearches: getRecentSearches(),
  };
};
