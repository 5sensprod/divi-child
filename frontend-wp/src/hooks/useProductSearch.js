// src/hooks/useProductSearch.js
import { useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";
import { cacheUtils, CACHE_KEYS, CACHE_DURATIONS } from "../utils/cache";

export const useProductSearch = () => {
  const [searchState, setSearchState] = useState({
    query: "",
    results: [],
    loading: false,
    error: null,
    hasSearched: false,
    filters: {},
  });

  // Générer la clé de cache pour une recherche
  const getSearchCacheKey = useCallback((query, filters = {}) => {
    const queryKey = query ? query.toLowerCase().trim() : "no-query";
    const filtersKey = JSON.stringify(filters);
    return `${CACHE_KEYS.SEARCH_PREFIX}${queryKey}_${filtersKey}`;
  }, []);

  // Récupérer les résultats depuis le cache
  const getCachedResults = useCallback(
    (query, filters) => {
      const cacheKey = getSearchCacheKey(query, filters);
      return cacheUtils.getWithTTL(cacheKey, CACHE_DURATIONS.SEARCH);
    },
    [getSearchCacheKey]
  );

  // Sauvegarder les résultats en cache
  const setCachedResults = useCallback(
    (query, filters, results) => {
      const cacheKey = getSearchCacheKey(query, filters);
      cacheUtils.setWithTTL(cacheKey, results, CACHE_DURATIONS.SEARCH);
    },
    [getSearchCacheKey]
  );

  // Sauvegarder dans l'historique des recherches récentes
  const saveToRecentSearches = useCallback((query) => {
    if (!query || !query.trim()) return;

    const recentSearches =
      cacheUtils.getWithTTL(
        CACHE_KEYS.RECENT_SEARCHES,
        CACHE_DURATIONS.RECENT_SEARCHES
      ) || [];

    // Supprimer la recherche si elle existe déjà
    const filteredSearches = recentSearches.filter(
      (search) => search.toLowerCase() !== query.toLowerCase()
    );

    // Ajouter en première position
    const updatedSearches = [query, ...filteredSearches].slice(0, 10); // Garder seulement 10

    cacheUtils.setWithTTL(
      CACHE_KEYS.RECENT_SEARCHES,
      updatedSearches,
      CACHE_DURATIONS.RECENT_SEARCHES
    );
  }, []);

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = useCallback((filters) => {
    if (!filters) return false;

    return (
      (filters.category && filters.category !== "") ||
      (filters.priceRange && filters.priceRange !== "all") ||
      (filters.availability && filters.availability !== "all") ||
      (filters.sortBy && filters.sortBy !== "relevance")
    );
  }, []);

  // Recherche avec filtres
  const performSearch = useCallback(
    async (query = "", searchFilters = {}) => {
      const trimmedQuery = query.trim();
      const hasFilters = hasActiveFilters(searchFilters);

      // Si pas de query ET pas de filtres, réinitialiser
      if (!trimmedQuery && !hasFilters) {
        setSearchState((prev) => ({
          ...prev,
          query: "",
          results: [],
          hasSearched: false,
          error: null,
          filters: searchFilters,
          loading: false,
        }));
        return;
      }

      // Vérifier le cache
      const cachedResults = getCachedResults(trimmedQuery, searchFilters);
      if (cachedResults) {
        setSearchState((prev) => ({
          ...prev,
          query: trimmedQuery,
          results: cachedResults,
          loading: false,
          hasSearched: true,
          error: null,
          filters: searchFilters,
        }));
        return;
      }

      setSearchState((prev) => ({
        ...prev,
        loading: true,
        query: trimmedQuery,
        error: null,
        filters: searchFilters,
      }));

      try {
        const { searchProducts } = await import("../services/woocommerce");

        // Construire les paramètres de recherche
        const searchParams = {
          per_page: 20,
          search_fields: ["name", "description", "sku"],
        };

        // Ajouter les filtres aux paramètres
        if (searchFilters.category && searchFilters.category !== "") {
          searchParams.category = searchFilters.category;
        }

        if (searchFilters.priceRange && searchFilters.priceRange !== "all") {
          // Gérer les prix selon les valeurs définies dans SearchFilters
          switch (searchFilters.priceRange) {
            case "0-50":
              searchParams.min_price = 0;
              searchParams.max_price = 50;
              break;
            case "50-100":
              searchParams.min_price = 50;
              searchParams.max_price = 100;
              break;
            case "100-300":
              searchParams.min_price = 100;
              searchParams.max_price = 300;
              break;
            case "300-500":
              searchParams.min_price = 300;
              searchParams.max_price = 500;
              break;
            case "500+":
              searchParams.min_price = 500;
              break;
          }
        }

        if (
          searchFilters.availability &&
          searchFilters.availability !== "all"
        ) {
          searchParams.stock_status =
            searchFilters.availability === "in-stock"
              ? "instock"
              : searchFilters.availability;
        }

        if (searchFilters.sortBy && searchFilters.sortBy !== "relevance") {
          switch (searchFilters.sortBy) {
            case "price-asc":
              searchParams.orderby = "price";
              searchParams.order = "asc";
              break;
            case "price-desc":
              searchParams.orderby = "price";
              searchParams.order = "desc";
              break;
            case "name-asc":
              searchParams.orderby = "title";
              searchParams.order = "asc";
              break;
            case "date-desc":
              searchParams.orderby = "date";
              searchParams.order = "desc";
              break;
          }
        }

        // Effectuer la recherche
        const results = await searchProducts(trimmedQuery, searchParams);

        // Sauvegarder en cache
        setCachedResults(trimmedQuery, searchFilters, results);

        // Sauvegarder dans les recherches récentes seulement si on a une query
        if (trimmedQuery) {
          saveToRecentSearches(trimmedQuery);
        }

        setSearchState((prev) => ({
          ...prev,
          results,
          loading: false,
          hasSearched: true,
          error: null,
        }));
      } catch (error) {
        console.error("Erreur recherche produits:", error);

        setSearchState((prev) => ({
          ...prev,
          error: "Erreur lors de la recherche",
          loading: false,
          results: [],
          hasSearched: true,
        }));
      }
    },
    [getCachedResults, setCachedResults, saveToRecentSearches, hasActiveFilters]
  );

  // Debouncing pour éviter trop de requêtes
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 500),
    [performSearch]
  );

  // Nettoyer la recherche
  const clearSearch = useCallback(() => {
    setSearchState({
      query: "",
      results: [],
      loading: false,
      error: null,
      hasSearched: false,
      filters: {},
    });
  }, []);

  // Récupérer les recherches récentes
  const getRecentSearches = useCallback(() => {
    return (
      cacheUtils.getWithTTL(
        CACHE_KEYS.RECENT_SEARCHES,
        CACHE_DURATIONS.RECENT_SEARCHES
      ) || []
    );
  }, []);

  // Nettoyer toutes les recherches en cache
  const clearSearchCache = useCallback(() => {
    cacheUtils.clearSearchCache();
    cacheUtils.remove(CACHE_KEYS.RECENT_SEARCHES);
  }, []);

  return {
    ...searchState,
    search: debouncedSearch,
    clearSearch,
    performSearch, // Pour recherche immédiate si besoin
    getRecentSearches,
    clearSearchCache,
    hasActiveFilters,
  };
};
