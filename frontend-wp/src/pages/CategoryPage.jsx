// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import {
  getProductsByCategory,
  getCategories,
  getBrandsByCategory,
} from "../services/woocommerce";
import Background from "../components/UI/Background";
import Title from "../components/UI/Title";
import PriceFilter from "../components/UI/PriceFilter";
import BrandFilter from "../components/UI/BrandFilter";
import SortFilter from "../components/UI/SortFilter";
import { formatPrice } from "../utils/format";

const CategoryPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const fullPath = params["*"] || params.slug;
  const { categories, loading } = useWordPress();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [categoryHierarchy, setCategoryHierarchy] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [activePriceFilter, setActivePriceFilter] = useState({
    min: 0,
    max: 2000,
  });
  const [sortOrder, setSortOrder] = useState("default");

  const productsPerPage = 12;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  // Fonction pour construire la hiérarchie complète
  const buildCategoryHierarchy = async (categoryId, allCategories) => {
    const hierarchy = [];
    let currentCat = allCategories.find((cat) => cat.id === categoryId);

    while (currentCat) {
      hierarchy.unshift(currentCat);
      if (currentCat.parent === 0) break;
      currentCat = allCategories.find((cat) => cat.id === currentCat.parent);
    }

    return hierarchy;
  };

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
    if (selectedBrands.length === 0) return productsData;

    return productsData.filter((product) =>
      product.brands?.some(
        (brand) =>
          selectedBrands.includes(brand.slug) ||
          selectedBrands.includes(brand.name.toLowerCase().replace(/\s+/g, "-"))
      )
    );
  };

  // Trouver la catégorie correspondante
  const findMatchingCategory = async () => {
    const pathSegments = fullPath?.split("/").filter(Boolean) || [];
    const finalSlug = pathSegments[pathSegments.length - 1] || fullPath;

    let allCategories = categories;
    if (!allCategories || allCategories.length === 0) {
      allCategories = await getCategories();
    }

    // Recherche par slug exact
    let match = allCategories.find((cat) => cat.slug === finalSlug);

    // Recherche dans les segments
    if (!match && pathSegments.length > 1) {
      for (const segment of pathSegments) {
        match = allCategories.find((cat) => cat.slug === segment);
        if (match) break;
      }
    }

    // Recherche flexible
    if (!match) {
      match = allCategories.find(
        (cat) =>
          cat.slug.includes(finalSlug) ||
          finalSlug.includes(cat.slug) ||
          cat.name.toLowerCase().includes(finalSlug.toLowerCase())
      );
    }

    if (!match) {
      throw new Error(`Catégorie "${finalSlug}" non trouvée`);
    }

    return match;
  };

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setProductsLoading(true);
        setError(null);

        const matchingCategory = await findMatchingCategory();
        setCategory(matchingCategory);

        // Construire la hiérarchie complète
        let allCategories = categories;
        if (!allCategories || allCategories.length === 0) {
          allCategories = await getCategories();
        }
        const hierarchy = await buildCategoryHierarchy(
          matchingCategory.id,
          allCategories
        );
        setCategoryHierarchy(hierarchy);

        // Charger les marques
        try {
          const brandsData = await getBrandsByCategory(matchingCategory.id);
          setBrands(brandsData);
        } catch (brandError) {
          console.error("Erreur chargement marques:", brandError);
          setBrands([]);
        }

        // Charger les produits
        const response = await getProductsByCategory(matchingCategory.id, {
          per_page: 100,
          page: 1,
          min_price: activePriceFilter.min,
          max_price:
            activePriceFilter.max === 2000 ? undefined : activePriceFilter.max,
        });

        let productsData = response.data || response;
        productsData = filterByBrands(productsData);
        productsData = sortProducts(productsData, sortOrder);

        const total = productsData.length;
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = productsData.slice(
          startIndex,
          startIndex + productsPerPage
        );

        setTotalProducts(total);
        setProducts(paginatedProducts);
      } catch (error) {
        console.error("Erreur chargement:", error);
        setError(error.message);
      } finally {
        setProductsLoading(false);
      }
    };

    if (fullPath && (!loading.categories || categories.length > 0)) {
      fetchCategoryProducts();
    }
  }, [
    fullPath,
    categories,
    loading.categories,
    currentPage,
    activePriceFilter,
    selectedBrands,
    sortOrder,
  ]);

  const handlePriceChange = (newPriceRange) => {
    setActivePriceFilter(newPriceRange);
    setCurrentPage(1);
  };

  const handleBrandsChange = (newSelectedBrands) => {
    setSelectedBrands(newSelectedBrands);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortOrder(newSort);
    setCurrentPage(1);
  };

  const resetAllFilters = () => {
    setActivePriceFilter({ min: 0, max: 2000 });
    setSelectedBrands([]);
    setSortOrder("default");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    activePriceFilter.min !== 0 ||
    activePriceFilter.max !== 2000 ||
    selectedBrands.length > 0 ||
    sortOrder !== "default";

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Composant Pagination
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Précédent
        </button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-pink-500 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Suivant →
        </button>
      </div>
    );
  };

  if (loading.categories || (productsLoading && !category)) {
    return (
      <div>
        <section className="relative overflow-hidden min-h-[300px] page-content">
          <Background variant="auto" opacity={1} animated={true} />
          <div className="container-divi relative z-10">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">
                {loading.categories
                  ? "Chargement des catégories..."
                  : "Chargement des produits..."}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <section className="relative overflow-hidden min-h-[300px] page-content">
          <Background variant="auto" opacity={1} animated={true} />
          <div className="container-divi relative z-10">
            <div className="text-center py-20">
              <Title
                tag="h1"
                className="mb-4 text-white"
                animationType="equalizer"
                gradient="default"
                mode="neon"
              >
                Erreur
              </Title>
              <p className="text-white/80 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[400px] page-content">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-10">
          <div className="text-center py-20 lg:py-24">
            <Title
              tag="h1"
              className="mb-4 text-white drop-shadow-lg"
              animationType="equalizer"
              mode="oceanNight"
              bold={true}
            >
              {categoryHierarchy.length > 1 ? (
                <>
                  {categoryHierarchy.map((cat, index) => (
                    <React.Fragment key={cat.id}>
                      {index > 0 && " "}
                      {cat.name}
                    </React.Fragment>
                  ))}
                </>
              ) : (
                category?.name || "Catégorie"
              )}
            </Title>

            {category?.description && (
              <div
                className="text-lg text-white/90 max-w-3xl mx-auto mb-6 drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            )}

            <p className="text-white/80 text-lg">
              {productsLoading
                ? "Chargement des produits..."
                : `${totalProducts} produit${
                    totalProducts > 1 ? "s" : ""
                  } disponible${totalProducts > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </section>
      {/* Section des produits avec filtres */}
      <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar filtres */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-4 space-y-4">
                <SortFilter
                  currentSort={sortOrder}
                  onChange={handleSortChange}
                />
                <PriceFilter
                  minPrice={0}
                  maxPrice={2000}
                  currentMin={activePriceFilter.min}
                  currentMax={activePriceFilter.max}
                  onChange={handlePriceChange}
                />
                <BrandFilter
                  brands={brands}
                  selectedBrands={selectedBrands}
                  onChange={handleBrandsChange}
                />

                {hasActiveFilters && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-pink-800">
                        Filtres actifs
                      </span>
                      <button
                        onClick={resetAllFilters}
                        className="text-xs text-pink-600 hover:text-pink-700 font-medium"
                      >
                        Tout effacer
                      </button>
                    </div>
                    <div className="space-y-1 text-xs text-pink-700">
                      {sortOrder !== "default" && (
                        <div>
                          Tri:{" "}
                          {
                            {
                              "price-asc": "Prix croissant",
                              "price-desc": "Prix décroissant",
                              "name-asc": "Nom A-Z",
                              "name-desc": "Nom Z-A",
                            }[sortOrder]
                          }
                        </div>
                      )}
                      {(activePriceFilter.min !== 0 ||
                        activePriceFilter.max !== 2000) && (
                        <div>
                          Prix: {activePriceFilter.min}€ -{" "}
                          {activePriceFilter.max}€
                        </div>
                      )}
                      {selectedBrands.length > 0 && (
                        <div>
                          {selectedBrands.length} marque
                          {selectedBrands.length > 1 ? "s" : ""} sélectionnée
                          {selectedBrands.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Grille de produits */}
            <div className="flex-1">
              {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(productsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="aspect-square bg-gray-200 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => navigate(`/produit/${product.slug}`)}
                      >
                        <div className="aspect-square bg-gray-100">
                          <img
                            src={
                              product.images?.[0]?.src ||
                              "/placeholder-product.jpg"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.target.src = "/placeholder-product.jpg")
                            }
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              {product.on_sale && product.sale_price ? (
                                <>
                                  <span className="text-lg font-bold text-pink-600">
                                    {formatPrice(product.sale_price)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {product.regular_price}€
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-gray-900">
                                  {formatPrice(product.regular_price)}
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                product.stock_status === "instock"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.stock_status === "instock"
                                ? "En stock"
                                : "Rupture"}
                            </span>
                          </div>
                          <button
                            className="w-full mt-3 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/produit/${product.slug}`);
                            }}
                          >
                            Voir le produit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Pagination />
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎵</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Aucun produit disponible
                  </h3>
                  <p className="text-gray-600">
                    {hasActiveFilters
                      ? "Aucun produit ne correspond aux filtres sélectionnés."
                      : "Cette catégorie ne contient actuellement aucun produit."}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={resetAllFilters}
                      className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
