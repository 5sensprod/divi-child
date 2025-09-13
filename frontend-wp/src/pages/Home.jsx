import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import ProductFilter from "../components/Product/ProductFilter";
import CategoryGrid from "../components/categorie/CategoryGrid";
import Title from "../components/UI/Title";
import AnimatedStats from "../components/UI/AnimatedStats";
import CTASection from "../components/UI/CTASection";
import Background from "../components/UI/Background"; // Import du nouveau composant

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
      {/* Catégories populaires - Avec fond Background */}
      <section
        id="boutique"
        className="py-14 relative overflow-hidden min-h-[400px]"
      >
        {/* Fond avec variante boutique */}
        <Background variant="boutique" opacity={0.95} animated={true} />

        {/* Overlay optionnel pour améliorer le contraste */}
        {/* <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-transparent to-gray-900/20 pointer-events-none z-[1]" /> */}

        {/* Contenu principal */}
        <div className="container-divi relative z-10">
          <div className="text-center mb-14">
            <Title
              tag="h2"
              className="mb-1 text-gray-800 drop-shadow-sm"
              animationType="equalizer"
              gradient="default"
            >
              La boutique
            </Title>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto drop-shadow-sm">
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
          </div>

          {/* Nouveau composant ProductFilter qui remplace ProductGrid */}
          <ProductFilter
            ref={productFilterRef}
            initialProducts={products.slice(0, 8)}
            initialLoading={loading.products}
            showTitle={false}
            className="mb-12"
          />
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
