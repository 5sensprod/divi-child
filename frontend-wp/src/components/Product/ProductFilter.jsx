// src/components/Product/ProductFilter.jsx
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useWordPress } from "../../context/WordPressContext";
import { useSearch } from "../../hooks/useSearch";
import SearchFilters from "../Search/SearchFilters";
import ProductGrid from "./ProductGrid";

const ProductFilter = forwardRef(
  (
    {
      initialProducts = [],
      className = "",
      showTitle = true,
      title = "Rechercher et filtrer",
      initialLoading = false, // ✅ Prop pour gérer le loading initial
    },
    ref
  ) => {
    const { categories } = useWordPress();
    const [displayProducts, setDisplayProducts] = useState(initialProducts);

    const {
      query,
      filters,
      results,
      loading,
      error,
      hasResults,
      hasActiveFilters,
      updateQuery,
      updateFilters,
      resetFilters,
      clearQuery,
    } = useSearch();

    // Exposer des méthodes pour contrôler le composant depuis l'extérieur
    useImperativeHandle(ref, () => ({
      setCategory: (categoryId) => {
        console.log("📦 ProductFilter reçoit categoryId:", categoryId);
        updateFilters({ category: categoryId });

        // Scroll vers la section des produits vedettes
        setTimeout(() => {
          console.log("🎯 Tentative de scroll vers #ProduitsVedettes");
          const element = document.getElementById("ProduitsVedettes");
          console.log("🔍 Élément trouvé:", !!element);

          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            console.log("✅ Scroll effectué");
          }
        }, 100);
      },
      setSearch: (searchTerm) => {
        updateQuery(searchTerm);
        setTimeout(() => {
          const element = document.getElementById("ProduitsVedettes");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      },
      clearAll: () => {
        clearQuery();
        resetFilters();
      },
    }));

    // Mettre à jour les produits affichés selon les résultats de recherche
    useEffect(() => {
      if (query.trim() || hasActiveFilters) {
        // Si on a une recherche ou des filtres actifs, afficher les résultats
        setDisplayProducts(results);
      } else {
        // Sinon, afficher les produits initiaux
        setDisplayProducts(initialProducts);
      }
    }, [results, query, hasActiveFilters, initialProducts]);

    const handleClearAll = () => {
      clearQuery();
      resetFilters();
    };

    // Déterminer l'état de chargement global
    const isLoading = initialLoading || loading;
    const hasAnyFilter = query.trim() || hasActiveFilters;

    // Afficher le skeleton pendant le chargement initial complet
    if (initialLoading && !hasAnyFilter) {
      return (
        <div className={`space-y-8 ${className}`}>
          {/* Titre optionnel */}
          {showTitle && (
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600">
                Trouvez exactement ce que vous cherchez
              </p>
            </div>
          )}

          {/* Barre de recherche en mode loading */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 transition-colors shadow-sm">
                <SearchIcon className="text-gray-400 ml-4" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher des instruments, accessoires..."
                  className="flex-1 p-4 text-lg outline-none bg-transparent placeholder-gray-500 rounded-xl"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Skeleton des filtres */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-gray-100 rounded-xl p-4 animate-pulse">
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Skeleton des produits */}
          <div className="max-w-7xl mx-auto">
            <ProductGrid
              products={[]}
              loading={true}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          </div>
        </div>
      );
    }

    return (
      <div className={`space-y-8 ${className}`}>
        {/* Titre optionnel */}
        {showTitle && (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">
              Trouvez exactement ce que vous cherchez
            </p>
          </div>
        )}

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 hover:border-blue-300 focus-within:border-blue-400 transition-colors shadow-sm hover:shadow-md">
              <SearchIcon className="text-gray-400 ml-4" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => updateQuery(e.target.value)}
                placeholder="Rechercher des instruments, accessoires..."
                className="flex-1 p-4 text-lg outline-none bg-transparent placeholder-gray-500 rounded-xl"
              />
              {query && (
                <button
                  onClick={clearQuery}
                  className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="max-w-6xl mx-auto">
          <SearchFilters
            categories={categories || []}
            filters={filters}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            simplified={true} // ✅ Mode simplifié
          />
        </div>

        {/* Barre d'état et actions */}
        {hasAnyFilter && (
          <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 flex-wrap gap-2">
              <p className="text-sm text-blue-700">
                <span className="font-semibold">{displayProducts.length}</span>{" "}
                produit
                {displayProducts.length > 1 ? "s" : ""} trouvé
                {displayProducts.length > 1 ? "s" : ""}
                {query.trim() && (
                  <>
                    {" "}
                    pour <span className="font-semibold">"{query}"</span>
                  </>
                )}
              </p>

              {/* Badges des filtres actifs */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Badge catégorie */}
                {filters.category && (
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200/50 shadow-sm">
                    {categories?.find(
                      (c) => String(c.id) === String(filters.category)
                    )?.name || filters.category}
                    <button
                      onClick={() => updateFilters({ category: "" })}
                      className="p-0.5 rounded-full hover:bg-blue-200/60 transition-colors duration-200"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}

                {/* Badge prix */}
                {filters.priceRange && filters.priceRange !== "all" && (
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200/50 shadow-sm">
                    {(() => {
                      const priceRanges = [
                        { value: "0-50", label: "< 50€" },
                        { value: "50-100", label: "50€-100€" },
                        { value: "100-300", label: "100€-300€" },
                        { value: "300-500", label: "300€-500€" },
                        { value: "500+", label: "> 500€" },
                      ];
                      return (
                        priceRanges.find((p) => p.value === filters.priceRange)
                          ?.label || filters.priceRange
                      );
                    })()}
                    <button
                      onClick={() => updateFilters({ priceRange: "all" })}
                      className="p-0.5 rounded-full hover:bg-amber-200/60 transition-colors duration-200"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}

                {/* Badge disponibilité */}
                {filters.availability && filters.availability !== "all" && (
                  <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200/50 shadow-sm">
                    {filters.availability === "in-stock"
                      ? "En stock"
                      : filters.availability === "pre-order"
                      ? "Précommande"
                      : filters.availability}
                    <button
                      onClick={() => updateFilters({ availability: "all" })}
                      className="p-0.5 rounded-full hover:bg-green-200/60 transition-colors duration-200"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}

                {/* Badge tri */}
                {filters.sortBy &&
                  filters.sortBy !== "relevance" &&
                  filters.sortBy !== "name-asc" && (
                    <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-200/50 shadow-sm">
                      Tri:{" "}
                      {(() => {
                        const sortOptions = [
                          { value: "price-asc", label: "Prix ↑" },
                          { value: "price-desc", label: "Prix ↓" },
                          { value: "name-desc", label: "Nom Z-A" },
                          { value: "date-desc", label: "Récents" },
                        ];
                        return (
                          sortOptions.find((s) => s.value === filters.sortBy)
                            ?.label || filters.sortBy
                        );
                      })()}
                      <button
                        onClick={() => updateFilters({ sortBy: "name-asc" })}
                        className="p-0.5 rounded-full hover:bg-purple-200/60 transition-colors duration-200"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  )}
              </div>

              {loading && (
                <div className="flex items-center text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <span className="text-sm">Recherche...</span>
                </div>
              )}
            </div>

            <button
              onClick={handleClearAll}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium ml-4"
            >
              <X size={14} />
              <span>Tout effacer</span>
            </button>
          </div>
        )}

        {/* Gestion des erreurs */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-700 text-center">{error}</p>
          </div>
        )}

        {/* Résultats */}
        <div className="max-w-7xl mx-auto">
          {loading && hasAnyFilter ? (
            // Skeleton pendant la recherche avec filtres actifs
            <ProductGrid
              products={[]}
              loading={true}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          ) : hasAnyFilter && displayProducts.length === 0 ? (
            // Afficher "aucun produit" seulement si pas de loading ET aucun résultat
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <button
                onClick={handleClearAll}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            // Afficher les produits normalement
            <ProductGrid
              products={displayProducts}
              loading={false}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            />
          )}
        </div>

        {/* Indicateur de recherche active */}
        {hasAnyFilter && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Recherche et filtres actifs -{" "}
              <button
                onClick={handleClearAll}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                voir tous les produits
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }
);

export default ProductFilter;
