// src/components/Layout/Header.jsx
// Version optimisée avec HeroSlider intégré directement

import { useState, useEffect } from "react";
import { useWordPress } from "../../context/WordPressContext";
import Navigation from "./Navigation";

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();

  return (
    <header className="relative">
      {/* Background SVG pour toute la zone header+hero */}
      {showHero && <HeroBackground />}

      {/* Navigation sticky */}
      <div className="z-navigation sticky top-0">
        <Navigation
          menuItems={menus?.items || []}
          siteTitle={siteData?.site_title || "Axe Musique"}
          loading={loading.menus}
          showSearch={false}
          showCart={false}
          cartCount={5}
          scrollThreshold={100}
          logoSizeReduced="100"
          logoSizeNormal="200"
        />
      </div>

      {/* Hero Slider intégré */}
      {showHero && (
        <HeroSlider
          siteTitle={siteData?.site_title || "Axe Musique"}
          siteDescription={
            siteData?.site_description || "Votre magasin de musique en ligne"
          }
          className="relative z-[1]"
        />
      )}
    </header>
  );
};

// Background component réutilisable
const HeroBackground = () => (
  <div
    className="absolute inset-0 z-0 hero-background"
    style={{
      "--bg-dark-0": "var(--bg-dark-0)",
      "--bg-dark-55": "var(--bg-dark-55)",
      "--bg-dark-100": "var(--bg-dark-100)",
      "--neon-pink-core": "var(--neon-pink-core)",
      "--neon-pink-outer": "var(--neon-pink-outer)",
      "--neon-cyan-core": "var(--neon-cyan-core)",
      "--neon-cyan-outer": "var(--neon-cyan-outer)",
      "--accent": "var(--accent)",
    }}
  />
);

// HeroSlider intégré directement (ex-HeroSection + HeroSlider fusionnés)
const HeroSlider = ({
  siteTitle,
  siteDescription,
  className = "",
  autoplayDelay = 5000,
  containerType = "divi",
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "ACHETEZ ET RÉPAREZ VOTRE MATOS MUSICAL",
      description:
        "Guitares, basses, claviers, sono et accessoires. Vendez votre matériel d'occasion, profitez de conseils d'experts et d'un atelier de réparation.",
      image:
        "/assets/images/ComfyUI_00291_-gigapixel-art-scale-4_00x-min_1.webp",
      theme: "primary",
    },
    {
      title: "BIENTÔT 30 ANS À VOTRE SERVICE",
      description:
        "Depuis 1995, notre équipe de passionnés vous accompagne dans vos projets musicaux. Trois décennies d'expertise, de confiance et d'innovation.",
      image: "/assets/images/foodtruck4-min_1.webp",
      theme: "warm",
    },
  ];

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplayDelay, slides.length]);

  // Apply theme dynamically
  useEffect(() => {
    const slide = slides[currentSlide];
    const root = document.documentElement;

    if (slide.theme === "primary") {
      root.style.setProperty("--current-gradient", "var(--gradient-primary)");
      root.style.setProperty(
        "--current-text-gradient",
        "var(--gradient-primary)"
      );
    } else if (slide.theme === "warm") {
      root.style.setProperty("--current-gradient", "var(--gradient-warm)");
      root.style.setProperty(
        "--current-text-gradient",
        "var(--gradient-sunset)"
      );
    }
  }, [currentSlide, slides]);

  const getContainerClass = () => {
    switch (containerType) {
      case "content":
        return "container-content";
      case "narrow":
        return "container-narrow";
      default:
        return "container-divi";
    }
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className={`w-full pt-24 md:pt-10 ${className}`}>
      <div className={getContainerClass()}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 min-h-[var(--hero-min-height)] md:min-h-[var(--hero-min-height-md)]">
          {/* Colonne GAUCHE - Contenu textuel */}
          <div className="flex flex-col justify-center">
            <div className="max-w-prose mx-auto md:mx-0 w-full text-center md:text-left">
              <h1
                className="font-bold leading-tight mb-6 text-hero transition-all duration-500"
                style={{
                  background: "var(--current-text-gradient)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {currentSlideData.title}
              </h1>

              <p className="text-gray-300 mb-8 text-hero-desc">
                {currentSlideData.description}
              </p>

              {/* Groupe CTA + Dots centrés */}
              <div className="flex flex-col gap-6 self-center md:self-start">
                <HeroButton />

                <div className="mx-auto inline-flex gap-3 self-center md:self-start">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all duration-300 ${
                        index === currentSlide ? "scale-125" : "scale-100"
                      }`}
                      style={{
                        backgroundColor:
                          index === currentSlide
                            ? slides[currentSlide].theme === "primary"
                              ? "var(--primary)"
                              : "#ff6b35"
                            : "rgba(255, 255, 255, 0.3)",
                      }}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne DROITE - Image */}
          <div className="relative min-h-[300px] md:min-h-0">
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className="absolute inset-0 w-full h-full object-contain object-bottom transition-opacity duration-700"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

// Bouton CTA réutilisable
const HeroButton = () => (
  <button
    onClick={() => (window.location.href = "/boutique")}
    className="mx-auto md:mx-0 mb-8 px-8 py-4 text-base md:text-lg font-bold text-white uppercase rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
    style={{
      background: "var(--current-gradient)",
      boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
    }}
    onMouseEnter={(e) => {
      // Inversion du gradient au hover
      const current = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--current-gradient");
      if (current.includes("var(--gradient-primary)")) {
        e.target.style.background =
          "linear-gradient(90deg, var(--secondary), var(--primary))";
      } else if (current.includes("var(--gradient-warm)")) {
        e.target.style.background = "linear-gradient(90deg, #ffd23f, #ff6b35)";
      }
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "var(--current-gradient)";
    }}
  >
    Boutique
  </button>
);

export default Header;
