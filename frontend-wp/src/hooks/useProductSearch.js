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
  });

  // Générer la clé de cache pour une recherche
  const getSearchCacheKey = useCallback((query) => {
    return `${CACHE_KEYS.SEARCH_PREFIX}${query.toLowerCase().trim()}`;
  }, []);

  // Récupérer les résultats depuis le cache
  const getCachedResults = useCallback(
    (query) => {
      const cacheKey = getSearchCacheKey(query);
      return cacheUtils.getWithTTL(cacheKey, CACHE_DURATIONS.SEARCH);
    },
    [getSearchCacheKey]
  );

  // Sauvegarder les résultats en cache
  const setCachedResults = useCallback(
    (query, results) => {
      const cacheKey = getSearchCacheKey(query);
      cacheUtils.setWithTTL(cacheKey, results, CACHE_DURATIONS.SEARCH);
    },
    [getSearchCacheKey]
  );

  // Sauvegarder dans l'historique des recherches récentes
  const saveToRecentSearches = useCallback((query) => {
    if (!query.trim()) return;

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

  // Recherche principale
  const performSearch = useCallback(
    async (query) => {
      if (!query.trim()) {
        setSearchState((prev) => ({
          ...prev,
          query: "",
          results: [],
          hasSearched: false,
          error: null,
        }));
        return;
      }

      const trimmedQuery = query.trim();

      // Vérifier le cache d'abord
      const cachedResults = getCachedResults(trimmedQuery);
      if (cachedResults) {
        setSearchState((prev) => ({
          ...prev,
          query: trimmedQuery,
          results: cachedResults,
          loading: false,
          hasSearched: true,
          error: null,
        }));
        return;
      }

      // Commencer la recherche
      setSearchState((prev) => ({
        ...prev,
        loading: true,
        query: trimmedQuery,
        error: null,
      }));

      try {
        // Import dynamique pour éviter de charger le service avant utilisation
        const { searchProducts } = await import("../services/woocommerce");

        const results = await searchProducts(trimmedQuery, {
          per_page: 20,
          search_fields: ["name", "description", "sku"],
        });

        // Mise en cache des résultats
        setCachedResults(trimmedQuery, results);

        // Sauvegarder dans les recherches récentes
        saveToRecentSearches(trimmedQuery);

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
    [getCachedResults, setCachedResults, saveToRecentSearches]
  );

  // Debouncing pour éviter trop de requêtes
  const debouncedSearch = useMemo(
    () => debounce(performSearch, 300),
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
  };
};
