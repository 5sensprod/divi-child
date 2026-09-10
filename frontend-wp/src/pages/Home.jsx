import React from "react";
import Title from "../components/UI/Title";
import AnimatedStats from "../components/UI/AnimatedStats";
import CTASection from "../components/UI/CTASection";
import Background from "../components/UI/Background";
import HeroSlider from "../components/UI/HeroSlider";
import BrandCarousel from "../components/UI/BrandCarousel";
import AxeCatalogSearchSection from "../components/section/AxeCatalogSearchSection";
import FeaturedCategoriesSection from "../components/section/FeaturedCategoriesSection";
import { SITE_INFO } from "../utils/constants";

const Home = () => {
  return (
    <div>
      {/* HERO contrôlé par la page */}
      <section
        id="hero"
        className="page-content relative overflow-hidden min-h-[400px]"
      >
        <Background variant="auto" opacity={1} animated={true} />
        <HeroSlider
          siteTitle={SITE_INFO.title}
          siteDescription={SITE_INFO.description}
        />
      </section>

      {/* ─── Marques ────────────────────────────────────────────────────────
          Lues dans `catalog.php?action=brands`, logos en URL complète. Le
          carrousel se masque tout seul tant qu'aucune marque n'a de logo : un
          carrousel d'images sans images n'est pas un carrousel. */}
      <BrandCarousel />

      {/* Chiffres du catalogue — `catalog.php?action=stats`. */}
      <AnimatedStats />

      {/* Sélection éditoriale de PocketApp : seules les catégories marquées
          « Mise en avant » apparaissent, avec leur photo miroir si elle existe. */}
      <FeaturedCategoriesSection />

      {/* « Notre catalogue », avec sa barre de recherche, à l'ancre
          `#ProduitsVedettes`. */}
      <AxeCatalogSearchSection />

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
