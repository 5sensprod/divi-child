// src/pages/CategoryPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import { getProductsByCategory, getCategories } from "../services/woocommerce";
import Background from "../components/UI/Background";
import Title from "../components/UI/Title";

const CategoryPage = () => {
  const params = useParams();
  const fullPath = params["*"] || params.slug; // Capture le chemin complet avec le splat operator
  const { categories, loading, siteData } = useWordPress();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setProductsLoading(true);
        setError(null);

        console.log("🔍 Chemin complet reçu:", fullPath);

        // Extraire le slug final du chemin
        const pathSegments = fullPath
          ? fullPath.split("/").filter(Boolean)
          : [];
        const finalSlug = pathSegments[pathSegments.length - 1] || fullPath;

        console.log("📂 Segments du chemin:", pathSegments);
        console.log("🎯 Slug final à rechercher:", finalSlug);
        console.log(
          "📋 Catégories disponibles depuis le contexte:",
          categories
        );

        // Récupérer toutes les catégories si pas encore chargées
        let allCategories = categories;
        if (!allCategories || allCategories.length === 0) {
          console.log("⚠️ Pas de catégories en contexte, chargement direct...");
          allCategories = await getCategories();
        }

        // 1. Recherche par slug exact (priorité haute)
        let matchingCategory = allCategories.find(
          (cat) => cat.slug === finalSlug
        );

        // 2. Si pas trouvé, recherche dans tout le chemin
        if (!matchingCategory && pathSegments.length > 1) {
          // Essayer chaque segment du chemin
          for (const segment of pathSegments) {
            matchingCategory = allCategories.find(
              (cat) => cat.slug === segment
            );
            if (matchingCategory) {
              console.log(`✅ Catégorie trouvée avec le segment: ${segment}`);
              break;
            }
          }
        }

        // 3. Si toujours pas trouvé, recherche flexible
        if (!matchingCategory) {
          matchingCategory = allCategories.find(
            (cat) =>
              cat.slug.includes(finalSlug) ||
              finalSlug.includes(cat.slug) ||
              cat.name.toLowerCase().includes(finalSlug.toLowerCase()) ||
              finalSlug.toLowerCase().includes(cat.name.toLowerCase())
          );
        }

        if (!matchingCategory) {
          // Debug détaillé
          console.log("❌ Aucune catégorie trouvée");
          console.log("Chemin recherché:", fullPath);
          console.log("Slug final:", finalSlug);
          console.log("Segments:", pathSegments);
          console.log(
            "Slugs disponibles:",
            allCategories.map((c) => c.slug)
          );

          throw new Error(
            `Catégorie "${finalSlug}" non trouvée dans le chemin "${fullPath}". Slugs disponibles: ${allCategories
              .map((c) => c.slug)
              .join(", ")}`
          );
        }

        console.log("✅ Catégorie trouvée:", matchingCategory);
        setCategory(matchingCategory);

        // 2. Récupérer les produits de cette catégorie
        console.log(
          "🛍️ Chargement des produits pour catégorie ID:",
          matchingCategory.id
        );
        const productsData = await getProductsByCategory(matchingCategory.id, {
          per_page: 20,
        });
        console.log("✅ Produits trouvés:", productsData.length);

        setProducts(productsData);
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        setError(error.message);
      } finally {
        setProductsLoading(false);
      }
    };

    // Attendre que les catégories soient chargées depuis le contexte OU lancer directement
    if (fullPath) {
      if (!loading.categories || categories.length > 0) {
        fetchCategoryProducts();
      }
    }
  }, [fullPath, categories, loading.categories]);

  // Loading state - soit les catégories se chargent, soit les produits
  if (loading.categories || (productsLoading && !category)) {
    return (
      <div>
        {/* Hero section même en loading */}
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
        {/* Hero section même en erreur */}
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
      {/* HERO Section pour la catégorie */}
      <section className="relative overflow-hidden min-h-[400px] page-content">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-10">
          <div className="text-center py-20 lg:py-24">
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
                : `${products.length} produit${
                    products.length > 1 ? "s" : ""
                  } disponible${products.length > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </section>

      {/* Section des produits */}
      <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={
                        product.images?.[0]?.src || "/placeholder-product.jpg"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder-product.jpg";
                      }}
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
                              {product.sale_price}€
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {product.regular_price}€
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {product.regular_price}€
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
                    <button className="w-full mt-3 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors">
                      Voir le produit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Aucun produit disponible
              </h3>
              <p className="text-gray-600">
                Cette catégorie ne contient actuellement aucun produit.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
