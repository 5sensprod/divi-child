import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import ProductFilter from "../components/Product/ProductFilter";
import CategoryGrid from "../components/categorie/CategoryGrid";
import Title from "../components/UI/Title";
import AnimatedStats from "../components/UI/AnimatedStats";
import CTASection from "../components/UI/CTASection";

const Home = () => {
  const { siteData, products, categories, loading } = useWordPress();
  const productFilterRef = useRef(null);

  // Fonction pour gérer le clic sur une catégorie
  const handleCategoryClick = (categoryId) => {
    console.log("🔥 Clic détecté sur catégorie:", categoryId);
    console.log("🔗 Ref disponible:", !!productFilterRef.current);

    if (productFilterRef.current) {
      console.log("✅ Appel de setCategory");
      productFilterRef.current.setCategory(categoryId);
    } else {
      console.error("❌ ProductFilter ref non disponible");
    }
  };
  return (
    <div>
      {/* Catégories populaires - Utilisation des vraies catégories WooCommerce */}
      <section id="boutique" className="py-14 bg-white">
        <div className="container-divi">
          <div className="text-center mb-14">
            <Title
              tag="h2"
              className="mb-1"
              animationType="equalizer"
              gradient="default"
            >
              La boutique
            </Title>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection d'instruments organisée par catégories
            </p>
          </div>

          {/* Utilisation du composant CategoryGrid */}
          <CategoryGrid
            categories={categories}
            loading={loading.categories}
            className="my-8"
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </section>

      {/* Section Produits avec recherche et filtres */}
      <section
        id="ProduitsVedettes"
        className="py-10 bg-gradient-to-br from-gray-50 to-gray-100"
      >
        <div className="container-divi">
          <div className="text-center mb-10">
            <Title
              tag="h2"
              className="mb-4"
              animationType="equalizer"
              gradient="sunset"
            >
              Notre sélection
            </Title>
            {/* <p className="text-lg text-gray-600">
              Notre sélection des meilleurs instruments
            </p> */}
          </div>

          {/* Nouveau composant ProductFilter qui remplace ProductGrid */}
          <ProductFilter
            ref={productFilterRef}
            initialProducts={products.slice(0, 8)}
            initialLoading={loading.products} // ✅ Ajoutez cette ligne
            showTitle={false}
            className="mb-12"
          />

          {/* Bouton centré sous les produits */}
          {/* <div className="text-center mt-12">
            <Link
              to="/boutique"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span className="hidden md:inline">Voir tout le catalogue</span>
              <span className="md:hidden">Voir tout</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div> */}
        </div>
      </section>

      {/* Statistiques */}
      <AnimatedStats products={products} categories={categories} />

      {/* CTA Section finale */}
      <CTASection />
    </div>
  );
};

export default Home;
