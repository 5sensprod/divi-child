// src/pages/BonsPlansPage.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { getProductsOnSale } from "../services/woocommerce";
import Background from "../components/UI/Background";
import Title from "../components/UI/Title";
import PriceFilter from "../components/UI/PriceFilter";
import SortFilter from "../components/UI/SortFilter";
import ProductList from "../components/Product/ProductList";
import { SlidersHorizontal, X } from "lucide-react";

const DEFAULT_FILTERS = {
  priceRange: { min: 0, max: 2000 },
  sort: "default",
};

const STORAGE_KEY = "bonsplans-filters";

// Met en forme le nom de catégorie : première lettre de chaque mot en majuscule
const formatCategoryLabel = (name = "") =>
  name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const BonsPlansPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Catégorie active (tag) — "all" par défaut
  const [activeCategory, setActiveCategory] = useState("all");

  // Panneau filtres mobile/tablette
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const saveCurrentPage = (page) => {
    setSearchParams({ page }, { replace: false });
  };

  // --- Filtres persistés ---
  const loadSavedFilters = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved
        ? { ...DEFAULT_FILTERS, ...JSON.parse(saved) }
        : DEFAULT_FILTERS;
    } catch {
      return DEFAULT_FILTERS;
    }
  };

  const [filters, setFilters] = useState(loadSavedFilters);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {}
  }, [filters]);

  // --- Chargement de TOUS les produits en solde (toutes les pages) ---
  useEffect(() => {
    let cancelled = false;

    const fetchAllOnSale = async () => {
      try {
        setProductsLoading(true);
        setError(null);

        const perPage = 100;
        const first = await getProductsOnSale({ page: 1, per_page: perPage });
        let products = first.data || [];
        const totalPages = first.pagination?.totalPages || 1;

        if (totalPages > 1) {
          const pages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
          const rest = await Promise.all(
            pages.map((page) => getProductsOnSale({ page, per_page: perPage })),
          );
          rest.forEach((r) => {
            products = [...products, ...(r.data || [])];
          });
        }

        if (!cancelled) setAllProducts(products);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setProductsLoading(false);
      }
    };

    fetchAllOnSale();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Catégories présentes dans les soldes (avec compteur) ---
  const categoryTags = useMemo(() => {
    const map = new Map();
    allProducts.forEach((product) => {
      product.categories?.forEach((cat) => {
        if (map.has(cat.id)) {
          map.get(cat.id).count++;
        } else {
          map.set(cat.id, {
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            count: 1,
          });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [allProducts]);

  // --- Produits filtrés par catégorie active (alimente la grille) ---
  const categoryFilteredProducts = useMemo(() => {
    if (activeCategory === "all") return allProducts;
    return allProducts.filter((p) =>
      p.categories?.some((c) => c.id === activeCategory),
    );
  }, [allProducts, activeCategory]);

  // Changer de catégorie remet la pagination à 1
  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setSearchParams({ page: 1 }, { replace: true });
  };

  const handlePriceChange = (newPriceRange) => {
    setFilters((prev) => ({ ...prev, priceRange: newPriceRange }));
    setSearchParams({ page: 1 }, { replace: true });
  };
  const handleSortChange = (newSort) => {
    setFilters((prev) => ({ ...prev, sort: newSort }));
    setSearchParams({ page: 1 }, { replace: true });
  };
  const resetAllFilters = () => {
    setFilters(DEFAULT_FILTERS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setSearchParams({ page: 1 }, { replace: true });
  };

  const hasActiveFilters =
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== 2000 ||
    filters.sort !== "default";

  const activeFilterCount = [
    filters.sort !== "default",
    filters.priceRange.min !== 0 || filters.priceRange.max !== 2000,
  ].filter(Boolean).length;

  // --- États d'erreur / vide ---
  if (error) {
    return (
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
          </div>
        </div>
      </section>
    );
  }

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-gray-400 text-6xl mb-4">🏷️</div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Aucun bon plan pour le moment
      </h3>
      <p className="text-gray-600 mb-4">
        {hasActiveFilters
          ? "Aucun produit en solde ne correspond aux filtres sélectionnés."
          : "Aucun produit n'est en promotion actuellement. Revenez bientôt !"}
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

  // --- Contenu des filtres (partagé sidebar desktop / drawer mobile) ---
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
      {hasActiveFilters && (
        <div className="rounded-xl border border-pink-200 overflow-hidden">
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
          </div>
        </div>
      )}
    </div>
  );

  const totalOnSale = allProducts.length;

  return (
    <div>
      {/* Hero */}
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
              Solde Eté 2026
            </Title>
            <p className="text-white/80 text-base">
              {productsLoading
                ? "Recherche des meilleures promos..."
                : `${totalOnSale} produit${totalOnSale > 1 ? "s" : ""} en solde`}
            </p>
          </div>

          {/* Nuage de tags catégories */}
          {!productsLoading && categoryTags.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <CategoryTag
                label="Tout"
                count={totalOnSale}
                active={activeCategory === "all"}
                onClick={() => handleCategoryChange("all")}
              />
              {categoryTags.map((cat) => (
                <CategoryTag
                  key={cat.id}
                  label={formatCategoryLabel(cat.name)}
                  count={cat.count}
                  active={activeCategory === cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Produits + filtres */}
      <section className="py-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          {/* Bouton "Filtres" sous lg */}
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

          {/* Drawer filtres via Portal */}
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
                <div
                  className="drawer-overlay fixed inset-0 bg-black/40 z-[9998]"
                  onClick={() => setFiltersOpen(false)}
                />
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
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-4">{filtersContent}</div>
            </aside>

            <div className="flex-1 min-w-0">
              <ProductList
                products={categoryFilteredProducts}
                loading={productsLoading}
                showCategory={true}
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

// Pill catégorie — signature visuelle néon de la page
const CategoryTag = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border ${
      active
        ? "bg-pink-500 border-pink-400 text-white shadow-lg shadow-pink-500/30 scale-105"
        : "bg-white/10 border-white/25 text-white/90 hover:bg-white/20 hover:border-white/40"
    }`}
  >
    <span>{label}</span>
    <span
      className={`text-xs font-bold rounded-full px-1.5 min-w-[1.25rem] text-center ${
        active ? "bg-white/25 text-white" : "bg-white/15 text-white/80"
      }`}
    >
      {count}
    </span>
  </button>
);

export default BonsPlansPage;
