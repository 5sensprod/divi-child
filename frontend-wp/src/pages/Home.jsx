import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import ProductFilter from "../components/Product/ProductFilter";
import CategoryGrid from "../components/categorie/CategoryGrid";
import Title from "../components/UI/Title";
import AnimatedStats from "../components/UI/AnimatedStats";
import CTASection from "../components/UI/CTASection";
import Background from "../components/UI/Background";
import HeroSlider from "../components/UI/HeroSlider";
import BrandCarousel from "../components/UI/BrandCarousel";
import PromoProductsSection from "../components/Product/PromoProductsSection";
import AxeCatalogSearchSection from "../components/section/AxeCatalogSearchSection";
import { API_CONFIG } from "../utils/constants";

const Home = () => {
  const { siteData, products, categories, parentCategories, brands, loading } =
    useWordPress();
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
        className="page-content relative overflow-hidden min-h-[400px]"
      >
        <Background variant="auto" opacity={1} animated={true} />
        <HeroSlider
          siteTitle={siteData?.site_title}
          siteDescription={siteData?.site_description}
        />
      </section>
      {/* ─── Marques : toujours masquées sous `useAxeCatalog` ───────────────
          `BrandCarousel` ne vit que par les LOGOS des marques, qui ne sont pas
          exportés (§7 du contrat) : un carrousel de marques sans logo n'est pas
          un carrousel. Il reviendra avec la session images. */}
      {!API_CONFIG.useAxeCatalog && (
        <BrandCarousel brands={brands} loading={loading.brands} />
      )}

      {/* `AnimatedStats` vit dans les DEUX cas depuis le 13 août 2026 : il
          choisit lui-même sa source — `catalog.php?action=stats` sous le
          drapeau, WooCommerce sinon. Il ne compte donc plus le volume d'un
          catalogue que le site ne montre pas, ce qui l'avait fait masquer. */}
      <AnimatedStats products={products} categories={categories} />

      {/* `AxeCatalogSection` — la section « Directement de notre catalogue »,
          qui montrait les produits d'une catégorie — a été RETIRÉE de l'accueil
          le 13 août 2026. La section « Notre catalogue » plus bas fait la même
          chose au repos, avec en plus la recherche : deux grilles de huit
          produits se suivaient sans que le visiteur sache ce qui les
          distinguait. Le composant existe toujours et reste utilisable
          ailleurs. */}
      {/* Catégories populaires */}
      {/* <section
        id="boutique"
        className="py-14 relative overflow-hidden min-h-[400px]"
      >
        <Background variant="boutique" opacity={0.95} animated={true} />

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
            categories={parentCategories}
            loading={loading.categories}
            className="my-8"
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </section> */}
      {/* <PromoProductsSection limit={8} /> */}
      {/* ─── « Notre catalogue » ────────────────────────────────────────────
          La section existe dans les DEUX cas, avec sa barre de recherche ; seule
          la source change. Sous `useAxeCatalog`, la version WooCommerce est
          écartée — elle lit `products` et `categories` du `WordPressContext` et
          sa recherche interroge Woo, ce qui donnerait deux prix pour un même
          produit sur la même page — et `AxeCatalogSearchSection` prend sa place,
          à la même ancre `#ProduitsVedettes`. */}
      {API_CONFIG.useAxeCatalog && <AxeCatalogSearchSection />}

      {!API_CONFIG.useAxeCatalog && (
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
                Notre catalogue
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
      )}

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
        <Background variant="auto" opacity={0.95} animated={true} />

        <div className="container-divi">
          <div className="text-center mb-10 md:mb-12 max-w-3xl mx-auto">
            <Title
              tag="h2"
              className="mb-4"
              animationType="equalizer"
              gradient="ocean"
            >
              En avant la musique ?
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
