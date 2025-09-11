// src/components/Product/ProductFilter.jsx
import React, { useState, useEffect } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useWordPress } from "../../context/WordPressContext";
import { useSearch } from "../../hooks/useSearch";
import SearchFilters from "../Search/SearchFilters";
import ProductGrid from "./ProductGrid";

const ProductFilter = ({
  initialProducts = [],
  className = "",
  showTitle = true,
  title = "Rechercher et filtrer",
}) => {
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

  const hasAnyFilter = query.trim() || hasActiveFilters;

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
        />
      </div>

      {/* Barre d'état et actions */}
      {hasAnyFilter && (
        <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
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

            {loading && (
              <div className="flex items-center text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">Recherche...</span>
              </div>
            )}
          </div>

          <button
            onClick={handleClearAll}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
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
        {loading ? (
          // Toujours afficher le loading en priorité
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
};

export default ProductFilter;
