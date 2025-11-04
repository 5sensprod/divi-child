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
import ProductCard from "../components/Product/ProductCard";
import { formatPrice } from "../utils/format";

// ✅ IMAGE PAR DÉFAUT pour les produits sans image
const FALLBACK_IMAGE =
  "https://placehold.co/800x800/f3f4f6/9ca3af?text=Produit";

const CategoryPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const fullPath = params["*"] || params.slug;
  const { categories, loading } = useWordPress();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
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

  useEffect(() => {
    setSelectedBrands([]);
    setActivePriceFilter({ min: 0, max: 2000 });
    setSortOrder("default");
    setCurrentPage(1);
    setProducts([]);
    setBrands([]);
    setCategory(null);
  }, [location.pathname]);

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

  const findMatchingCategory = async () => {
    const pathSegments = fullPath?.split("/").filter(Boolean) || [];
    const finalSlug = pathSegments[pathSegments.length - 1] || fullPath;

    let allCategories = categories;
    if (!allCategories || allCategories.length === 0) {
      allCategories = await getCategories();
    }

    let match = allCategories.find((cat) => cat.slug === finalSlug);

    if (!match && pathSegments.length > 1) {
      for (const segment of pathSegments) {
        match = allCategories.find((cat) => cat.slug === segment);
        if (match) break;
      }
    }

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

        try {
          const brandsData = await getBrandsByCategory(matchingCategory.id);
          setBrands(brandsData);
        } catch (brandError) {
          console.error("Erreur chargement marques:", brandError);
          setBrands([]);
        }

        const response = await getProductsByCategory(matchingCategory.id, {
          per_page: 100,
          page: 1,
          min_price: activePriceFilter.min,
          max_price:
            activePriceFilter.max === 2000 ? undefined : activePriceFilter.max,
        });

        let productsData = response.data || response;

        // ✅ PAS DE FILTRAGE - On garde tous les produits avec fallback
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

  // ✅ Composant ProductImage avec fallback
  const ProductImage = ({ src, alt, onError }) => {
    const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
    const [errorOccurred, setErrorOccurred] = useState(false);

    const handleError = () => {
      if (!errorOccurred) {
        setImgSrc(FALLBACK_IMAGE);
        setErrorOccurred(true);
        if (onError) onError();
      }
    };

    return (
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        loading="lazy"
      />
    );
  };

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
      <section className="relative overflow-hidden page-content pt-32 pb-20 md:pt-40 md:pb-20">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-10">
          <div className="text-center">
            <Title
              tag="h1"
              className="mb-4 text-white drop-shadow-lg"
              animationType="none"
              gradient="ocean"
              mode="oceanNight"
              bold="true"
            >
              {category?.name || "Catégorie"}
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

      <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          <div className="flex flex-col lg:flex-row gap-6">
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

            <div className="flex-1">
              {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(productsPerPage)].map((_, i) => (
                    <div
                      key={i}
                      className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden animate-pulse"
                    >
                      <div className="h-52 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-300 rounded mb-2"></div>
                        <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                        <div className="h-10 bg-gray-300 rounded-xl"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        allowFallback={true}
                        showCategory={false}
                      />
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
