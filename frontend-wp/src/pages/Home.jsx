import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import ProductFilter from "../components/Product/ProductFilter";
import CategoryGrid from "../components/categorie/CategoryGrid";
import Title from "../components/UI/Title";
import AnimatedStats from "../components/UI/AnimatedStats";
import CTASection from "../components/UI/CTASection";
import Background from "../components/UI/Background";
import HeroSlider from "../components/Layout/Header/HeroSlider";

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
      {/* HERO contrôlé par la page */}
      <section
        id="hero"
        className="relative overflow-hidden min-h-[400px] pt-60 "
      >
        <Background animated={false} opacity={1} />
        <HeroSlider
          siteTitle={siteData?.site_title}
          siteDescription={siteData?.site_description}
        />
      </section>

      {/* Catégories populaires */}
      <section
        id="boutique"
        className="py-14 relative overflow-hidden min-h-[400px]"
      >
        <Background variant="boutique" opacity={0.95} animated={false} />

        <div className="container-divi relative z-10">
          <div className="text-center mb-14">
            <Title
              tag="h2"
              className="mb-1 text-gray-800 drop-shadow-sm"
              animationType="equalizer"
              gradient="default"
              mode="oceanNight"
            >
              La boutique
            </Title>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto drop-shadow-sm">
              Découvrez notre sélection d'instruments organisée par catégories
            </p>
          </div>

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

          <ProductFilter
            ref={productFilterRef}
            initialProducts={products.slice(0, 8)}
            initialLoading={loading.products}
            showTitle={false}
            className="mb-12"
          />
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="py-20 bg-white">
        <div className="container-divi">
          <div className="text-center mb-12">
            <Title
              tag="h2"
              className="mb-4"
              animationType="equalizer"
              gradient="ocean"
            >
              Nos chiffres
            </Title>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La confiance de milliers de musiciens
            </p>
          </div>

          <AnimatedStats products={products} categories={categories} />
        </div>
      </section>

      {/* Section Contact / CTA */}
      <section
        className="relative py-14 md:py-18 text-white"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(11, 15, 36, 0.9), rgba(11, 15, 36, 0.95)),
            url('/assets/images/ComfyUI_00291_-gigapixel-art-scale-4_00x-min_1.webp')
          `,
          backgroundSize: "cover, auto",
          backgroundRepeat: "no-repeat, no-repeat",
          backgroundPosition: "center, bottom center",
        }}
      >
        <Background variant="oceanNight" opacity={0.95} animated={true} />

        <div className="container-divi">
          <div className="text-center mb-10 md:mb-12 max-w-3xl mx-auto">
            <Title
              tag="h2"
              className="mb-4"
              animationType="equalizer"
              gradient="ocean"
            >
              Prêt à faire de la musique ?
            </Title>
            <Title
              tag="p"
              className="mb-4"
              animationType="none"
              gradient="ocean"
              mode="neon"
              solidColor="#fff"
              bold={false}
            >
              Passe essayer, obtenir un conseil, ou comparer avant d'acheter.
            </Title>
          </div>

          <CTASection />
        </div>
      </section>
    </div>
  );
};

export default Home;
