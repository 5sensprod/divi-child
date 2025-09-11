import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import ProductFilter from "../components/Product/ProductFilter";
import CategoryGrid from "../components/categorie/CategoryGrid";
import Title from "../components/UI/Title";

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
          <div className="text-center mb-16">
            <Title
              tag="h2"
              className="mb-4"
              animationType="equalizer"
              gradient="sunset"
            >
              Notre sélection
            </Title>
            <p className="text-lg text-gray-600">
              Notre sélection des meilleurs instruments
            </p>
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
      <section className="py-20 bg-white">
        <div className="container-divi">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {products.length || "1000+"}
              </h3>
              <p className="text-gray-600">Instruments disponibles</p>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">50+</h3>
              <p className="text-gray-600">Marques partenaires</p>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">10k+</h3>
              <p className="text-gray-600">Clients satisfaits</p>
            </div>
          </div>
        </div>
      </section>

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
