// src/components/Product/ProductList.jsx
import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import Pagination from "../UI/Pagination";

/**
 * Composant réutilisable pour afficher une liste de produits avec filtres, tri et pagination
 *
 * @param {Array} products - Liste des produits à afficher
 * @param {Boolean} loading - État de chargement
 * @param {Boolean} showCategory - Afficher ou non le badge catégorie
 * @param {Boolean} allowFallback - Autoriser l'image de fallback
 * @param {Number} productsPerPage - Nombre de produits par page
 * @param {Object} filters - Filtres actifs (price, brands, sort)
 * @param {Function} onFiltersChange - Callback quand les filtres changent
 * @param {String} gridClassName - Classes CSS personnalisées pour la grille
 * @param {Boolean} showPagination - Afficher ou non la pagination
 * @param {ReactNode} emptyState - Composant à afficher quand aucun produit
 */
const ProductList = ({
  products = [],
  loading = false,
  showCategory = true,
  allowFallback = false,
  productsPerPage = 12,
  filters = {
    priceRange: { min: 0, max: 2000 },
    brands: [],
    sort: "default",
  },
  onFiltersChange = null,
  gridClassName = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  showPagination = true,
  emptyState = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fonction de tri
  const sortProducts = (productsToSort, sortType) => {
    const sorted = [...productsToSort];
    switch (sortType) {
      case "price-asc":
        return sorted.sort(
          (a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0)
        );
      case "price-desc":
        return sorted.sort(
          (a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0)
        );
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return sorted;
    }
  };

  // Fonction de filtrage par marques
  const filterByBrands = (productsData) => {
    if (!filters.brands || filters.brands.length === 0) return productsData;

    return productsData.filter((product) =>
      product.brands?.some(
        (brand) =>
          filters.brands.includes(brand.slug) ||
          filters.brands.includes(brand.name.toLowerCase().replace(/\s+/g, "-"))
      )
    );
  };

  // Fonction de filtrage par prix
  const filterByPrice = (productsData) => {
    if (!filters.priceRange) return productsData;

    const { min, max } = filters.priceRange;
    return productsData.filter((product) => {
      const price = parseFloat(product.price || product.regular_price || 0);
      return price >= min && (max === 2000 || price <= max);
    });
  };

  // Appliquer tous les filtres
  useEffect(() => {
    let result = [...products];

    // Filtrer par prix
    result = filterByPrice(result);

    // Filtrer par marques
    result = filterByBrands(result);

    // Trier
    result = sortProducts(result, filters.sort);

    setFilteredProducts(result);
    setCurrentPage(1); // Réinitialiser à la page 1 quand les filtres changent
  }, [products, filters]);

  // Calculer la pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Gérer le changement de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Composant Skeleton
  const LoadingSkeleton = () => (
    <div className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-300 rounded mb-2"></div>
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-10 bg-gray-300 rounded-xl"></div>
      </div>
    </div>
  );

  // Composant Pagination
  const Pagination = () => {
    if (!showPagination || totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Précédent
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Afficher seulement quelques pages autour de la page actuelle
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
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
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
        </button>
      </div>
    );
  };

  // État de chargement
  if (loading) {
    return (
      <div className={`grid ${gridClassName} gap-6`}>
        {[...Array(productsPerPage)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Aucun produit
  if (filteredProducts.length === 0) {
    if (emptyState) {
      return emptyState;
    }

    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <div className="text-gray-400 text-6xl mb-4">🎵</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucun produit trouvé
        </h3>
        <p className="text-gray-600">
          Aucun produit ne correspond à vos critères
        </p>
      </div>
    );
  }

  // Affichage des produits
  return (
    <div>
      <div className={`grid ${gridClassName} gap-6`}>
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            showCategory={showCategory}
            allowFallback={allowFallback}
          />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={(p) => handlePageChange(p)}
      />

      {/* Informations de pagination */}
      {showPagination && totalPages > 1 && (
        <div className="text-center mt-4 text-sm text-gray-600">
          Affichage de {startIndex + 1} à{" "}
          {Math.min(startIndex + productsPerPage, filteredProducts.length)} sur{" "}
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default ProductList;
