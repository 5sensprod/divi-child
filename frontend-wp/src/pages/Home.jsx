import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import ProductFilter from "../components/Product/ProductFilter";
import CategoryGrid from "../components/categorie/CategoryGrid";
import Title from "../components/UI/Title";
import AnimatedStats from "../components/UI/AnimatedStats";

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
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
        {/* Éléments décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-pink-500 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-purple-500 rounded-full blur-xl"></div>
        </div>

        <div className="container-divi relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Title
              tag="h2"
              className="mb-6"
              animationType="equalizer"
              gradient="ocean"
            >
              Prêt à faire de la musique ?
            </Title>
            <p className="text-xl opacity-90 mb-10 leading-relaxed">
              Rejoignez des milliers de musiciens qui nous font confiance pour
              leurs instruments
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/boutique"
                className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25"
              >
                <span className="relative z-10">Explorer le catalogue</span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
