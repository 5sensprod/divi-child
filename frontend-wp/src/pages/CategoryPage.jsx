// src/pages/CategoryPage.jsx
import React, { useState, useEffect, useRef } from "react";
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

  // La page est lue depuis l'URL — le bouton retour la restaure automatiquement
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const saveCurrentPage = (page) => {
    setSearchParams({ page }, { replace: false });
  };

  // États des filtres
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 2000 },
    brands: [],
    sort: "default",
  });

  // Ref pour ignorer l'exécution au premier montage
  const isFirstMount = useRef(true);

  // Réinitialiser uniquement quand on change de catégorie (pas au montage)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    setFilters({
      priceRange: { min: 0, max: 2000 },
      brands: [],
      sort: "default",
    });
    setProducts([]);
    setBrands([]);
    setCategory(null);
    // Ne pas toucher aux searchParams ici : quand on change de catégorie,
    // l'URL change complètement donc ?page de l'ancienne catégorie ne s'applique pas
  }, [fullPath]);

  // Fonction pour trouver la catégorie correspondante
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
          cat.name.toLowerCase().includes(finalSlug.toLowerCase()),
      );
    }

    if (!match) {
      throw new Error(`Catégorie "${finalSlug}" non trouvée`);
    }

    return match;
  };

  // Charger les produits de la catégorie
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setProductsLoading(true);
        setError(null);

        const matchingCategory = await findMatchingCategory();
        setCategory(matchingCategory);

        // Charger les marques
        try {
          const brandsData = await getBrandsByCategory(matchingCategory.id);
          setBrands(brandsData);
        } catch (brandError) {
          console.error("Erreur chargement marques:", brandError);
          setBrands([]);
        }

        // Charger tous les produits (sans filtres côté serveur)
        const response = await getProductsByCategory(matchingCategory.id, {
          per_page: 100,
          page: 1,
        });

        const productsData = response.data || response;
        setProducts(productsData);
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
  }, [fullPath, categories, loading.categories]);

  // Gérer les changements de filtres (remet la page à 1)
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
    setFilters({
      priceRange: { min: 0, max: 2000 },
      brands: [],
      sort: "default",
    });
    setSearchParams({ page: 1 }, { replace: true });
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters =
    filters.priceRange.min !== 0 ||
    filters.priceRange.max !== 2000 ||
    filters.brands.length > 0 ||
    filters.sort !== "default";

  // État d'erreur
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

  // Composant EmptyState personnalisé
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
                : `${products.length} produit${
                    products.length > 1 ? "s" : ""
                  } disponible${products.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </section>

      {/* Section Produits avec Filtres */}
      <section className="py-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Filtres */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-4 space-y-4">
                <SortFilter
                  currentSort={filters.sort}
                  onChange={handleSortChange}
                />
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
                      {filters.sort !== "default" && (
                        <div>
                          Tri:{" "}
                          {
                            {
                              "price-asc": "Prix croissant",
                              "price-desc": "Prix décroissant",
                              "name-asc": "Nom A-Z",
                              "name-desc": "Nom Z-A",
                            }[filters.sort]
                          }
                        </div>
                      )}
                      {(filters.priceRange.min !== 0 ||
                        filters.priceRange.max !== 2000) && (
                        <div>
                          Prix: {filters.priceRange.min}€ -{" "}
                          {filters.priceRange.max}€
                        </div>
                      )}
                      {filters.brands.length > 0 && (
                        <div>
                          {filters.brands.length} marque
                          {filters.brands.length > 1 ? "s" : ""} sélectionnée
                          {filters.brands.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Liste des produits */}
            <div className="flex-1">
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
