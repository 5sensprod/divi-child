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

        {/* Bouton filtres sticky - Version pastille */}
        <div className="sticky top-[90px] lg:top-[108px] z-10 mb-6">
          <div className="max-w-6xl mx-auto">
            <SearchFilters
              categories={categories || []}
              filters={filters}
              onFiltersChange={updateFilters}
              onResetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
              simplified={false} // ✅ Mode complet avec bouton pliable
            />
          </div>
        </div>

        {/* Compteur de résultats */}
        {hasAnyFilter && (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">{displayProducts.length}</span>{" "}
              produit{displayProducts.length > 1 ? "s" : ""} trouvé
              {displayProducts.length > 1 ? "s" : ""}
              {query.trim() && (
                <>
                  {" "}
                  pour <span className="font-semibold">"{query}"</span>
                </>
              )}
              {loading && (
                <span className="ml-2 text-blue-600">
                  <span className="animate-pulse">• Recherche...</span>
                </span>
              )}
            </p>
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
