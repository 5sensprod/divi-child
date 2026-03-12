// src/pages/CategoryPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
import ProductList from "../components/Product/ProductList";
import { SlidersHorizontal, X } from "lucide-react";

const CategoryPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fullPath = params["*"] || params.slug;
  const { categories, loading } = useWordPress();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);

  // Panneau filtres mobile/tablette
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const saveCurrentPage = (page) => {
    setSearchParams({ page }, { replace: false });
  };

  const DEFAULT_FILTERS = {
    priceRange: { min: 0, max: 2000 },
    brands: [],
    sort: "default",
  };

  const loadSavedFilters = (path) => {
    try {
      const saved = localStorage.getItem(`category-filters:${path}`);
      return saved
        ? { ...DEFAULT_FILTERS, ...JSON.parse(saved) }
        : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  };

  const [filters, setFilters] = useState(() => loadSavedFilters(fullPath));

  // Persister les filtres à chaque changement (clé par catégorie)
  useEffect(() => {
    try {
      localStorage.setItem(
        `category-filters:${fullPath}`,
        JSON.stringify(filters),
      );
    } catch {}
  }, [filters, fullPath]);

  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    // Nouvelle catégorie → restaurer ses filtres sauvegardés ou défauts
    setFilters(loadSavedFilters(fullPath));
    setProducts([]);
    setBrands([]);
    setCategory(null);
  }, [fullPath]);

  const findMatchingCategory = async () => {
    const pathSegments = fullPath?.split("/").filter(Boolean) || [];
    const finalSlug = pathSegments[pathSegments.length - 1] || fullPath;
    let allCategories = categories;
    if (!allCategories || allCategories.length === 0)
      allCategories = await getCategories();
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
          cat.name.toLowerCase().includes(finalSlug.toLowerCase()),
      );
    }
    if (!match) throw new Error(`Catégorie "${finalSlug}" non trouvée`);
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
        } catch {
          setBrands([]);
        }
        const response = await getProductsByCategory(matchingCategory.id, {
          per_page: 100,
          page: 1,
        });
        setProducts(response.data || response);
      } catch (error) {
        setError(error.message);
      } finally {
        setProductsLoading(false);
      }
    };
    if (fullPath && (!loading.categories || categories.length > 0))
      fetchCategoryProducts();
  }, [fullPath, categories, loading.categories]);

  const handlePriceChange = (newPriceRange) => {
    setFilters((prev) => ({ ...prev, priceRange: newPriceRange }));
    setSearchParams({ page: 1 }, { replace: true });
  };
  const handleBrandsChange = (newSelectedBrands) => {
    setFilters((prev) => ({ ...prev, brands: newSelectedBrands }));
    setSearchParams({ page: 1 }, { replace: true });
  };
  const handleSortChange = (newSort) => {
    setFilters((prev) => ({ ...prev, sort: newSort }));
    setSearchParams({ page: 1 }, { replace: true });
  };
  const resetAllFilters = () => {
    const defaults = {
      priceRange: { min: 0, max: 2000 },
      brands: [],
      sort: "default",
    };
    setFilters(defaults);
    try {
      localStorage.removeItem(`category-filters:${fullPath}`);
    } catch {}
    setSearchParams({ page: 1 }, { replace: true });
  };

  const hasActiveFilters =
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== 2000 ||
    filters.brands.length > 0 ||
    filters.sort !== "default";

  const activeFilterCount = [
    filters.sort !== "default",
    filters.priceRange.min !== 0 || filters.priceRange.max !== 2000,
    filters.brands.length > 0,
  ].filter(Boolean).length;

  if (error) {
    return (
      <div>
        <section className="relative overflow-hidden page-content pt-32 pb-8">
          <Background variant="ocean-night" opacity={1} animated={true} />
          <div className="container-divi relative z-10">
            <div className="text-center py-10">
              <Title
                tag="h1"
                className="mb-4 text-white drop-shadow-lg"
                animationType="equalizer"
                gradient="default"
                mode="neon"
              >
                Erreur
              </Title>
              <p className="text-white/80 mb-6">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">🎵</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Aucun produit disponible
      </h3>
      <p className="text-gray-600 mb-4">
        {hasActiveFilters
          ? "Aucun produit ne correspond aux filtres sélectionnés."
          : "Cette catégorie ne contient actuellement aucun produit."}
      </p>
      {hasActiveFilters && (
        <button
          onClick={resetAllFilters}
          className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  // Contenu des filtres (partagé entre sidebar desktop et drawer mobile)
  const filtersContent = (
    <div className="space-y-4">
      <SortFilter currentSort={filters.sort} onChange={handleSortChange} />
      <PriceFilter
        minPrice={0}
        maxPrice={2000}
        currentMin={filters.priceRange.min}
        currentMax={filters.priceRange.max}
        onChange={handlePriceChange}
      />
      <BrandFilter
        brands={brands}
        selectedBrands={filters.brands}
        onChange={handleBrandsChange}
      />
      {hasActiveFilters && (
        <div className="rounded-xl border border-pink-200 overflow-hidden">
          {/* Header */}
          <div className="bg-pink-500 px-4 py-2.5 flex items-center justify-between">
            <span className="text-white text-sm font-semibold tracking-wide">
              Filtres actifs
            </span>
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
              </svg>
              Tout effacer
            </button>
          </div>
          {/* Tags */}
          <div className="bg-pink-50 px-4 py-3 flex flex-wrap gap-2">
            {filters.sort !== "default" && (
              <span className="inline-flex items-center gap-1 bg-white border border-pink-200 text-pink-700 text-xs font-medium px-2.5 py-1 rounded-full">
                Tri :{" "}
                {
                  {
                    "price-asc": "Prix ↑",
                    "price-desc": "Prix ↓",
                    "name-asc": "A-Z",
                    "name-desc": "Z-A",
                  }[filters.sort]
                }
              </span>
            )}
            {(filters.priceRange.min !== 0 ||
              filters.priceRange.max !== 2000) && (
              <span className="inline-flex items-center gap-1 bg-white border border-pink-200 text-pink-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {filters.priceRange.min}€ – {filters.priceRange.max}€
              </span>
            )}
            {filters.brands.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-white border border-pink-200 text-pink-700 text-xs font-medium px-2.5 py-1 rounded-full">
                {filters.brands.length} marque
                {filters.brands.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden page-content pt-32 pb-6 md:pt-36 md:pb-6">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-10">
          <div className="text-center">
            <Title
              tag="h1"
              className="mb-2 text-white drop-shadow-lg"
              animationType="none"
              gradient="ocean"
              mode="oceanNight"
              bold="true"
            >
              {category?.name || "Catégorie"}
            </Title>
            <p className="text-white/80 text-base">
              {productsLoading
                ? "Chargement des produits..."
                : `${products.length} produit${products.length > 1 ? "s" : ""} disponible${products.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </section>

      {/* Section Produits avec Filtres */}
      <section className="py-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          {/* Bouton "Filtres" visible uniquement sous lg */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setFiltersOpen(true)}
              className="flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={16} />
              Filtres
              {activeFilterCount > 0 && (
                <span className="bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Drawer filtres via Portal — rendu directement dans <body> */}
          <style>{`
            @keyframes slideInLeft {
              from { transform: translateX(-100%); opacity: 0; }
              to   { transform: translateX(0);    opacity: 1; }
            }
            @keyframes fadeInOverlay {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            .drawer-panel   { animation: slideInLeft   0.28s cubic-bezier(0.32,0.72,0,1) both; }
            .drawer-overlay { animation: fadeInOverlay 0.22s ease both; }
          `}</style>
          {filtersOpen &&
            createPortal(
              <>
                {/* Overlay */}
                <div
                  className="drawer-overlay fixed inset-0 bg-black/40 z-[9998]"
                  onClick={() => setFiltersOpen(false)}
                />
                {/* Panneau */}
                <div className="drawer-panel fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white z-[9999] shadow-2xl overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <span className="font-semibold text-gray-900">Filtres</span>
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <X size={18} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="p-4">{filtersContent}</div>
                </div>
              </>,
              document.body,
            )}

          {/* Layout principal */}
          <div className="flex gap-6">
            {/* Sidebar — visible uniquement sur lg+ */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-4">{filtersContent}</div>
            </aside>

            {/* Liste des produits */}
            <div className="flex-1 min-w-0">
              <ProductList
                products={products}
                loading={productsLoading}
                showCategory={false}
                allowFallback={true}
                productsPerPage={12}
                filters={filters}
                gridClassName="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                showPagination={true}
                emptyState={<EmptyState />}
                currentPage={currentPage}
                onPageChange={saveCurrentPage}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
