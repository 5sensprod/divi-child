// HeroSlider.jsx - Version simplifiée et fiable
import { useState, useEffect, useRef } from "react";
import {
  HEADER_CONFIG,
  getThemeStyle,
  applyBackgroundTheme,
} from "../../../config/components";
import HeroContent from "./HeroComponents/HeroContent";
import HeroImage from "./HeroComponents/HeroImage";

const HeroSlider = ({ siteTitle, siteDescription }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { slider } = HEADER_CONFIG;
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Fonction simple pour passer à la slide suivante
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slider.slides.length);
  };

  // Fonction pour aller à une slide spécifique
  const goToSlide = (index) => {
    if (index === currentSlide) return;

    setCurrentSlide(index);

    // Réinitialiser l'autoplay après interaction manuelle
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      // Redémarrer l'autoplay après le glissement
      intervalRef.current = setInterval(nextSlide, slider.autoplayDelay);
    }, 100); // Juste le temps de redémarrer
  };

  // Démarrer l'animation de transition quand la slide change (sauf si manuel)
  useEffect(() => {
    // Plus besoin de isTransitioning avec le glissement !
    // L'animation CSS se charge de tout
  }, [currentSlide]);

  // Autoplay - Super simple !
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, slider.autoplayDelay);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []); // Pas de dépendances = démarre une fois et c'est tout

  // Apply theme - EXACTEMENT comme l'original
  useEffect(() => {
    const slide = slider.slides[currentSlide];
    if (!slide?.theme) return;

    const root = document.documentElement;
    root.style.transition = "all var(--transition-smooth)";

    root.style.setProperty(
      "--current-gradient",
      getThemeStyle(slide.theme, "gradient")
    );
    root.style.setProperty(
      "--current-text-gradient",
      getThemeStyle(slide.theme, "textGradient")
    );

    applyBackgroundTheme(slide.theme);
    applyLogoTheme(slide.theme);

    setTimeout(() => {
      root.style.transition = "";
    }, 300);
  }, [currentSlide, slider.slides]);

  // Fonction logo
  const applyLogoTheme = (themeName) => {
    const root = document.documentElement;

    if (themeName === "neon") {
      root.style.setProperty("--logo-primary", "#FF3FD1");
      root.style.setProperty("--logo-secondary", "#31D1FF");
      root.style.setProperty("--logo-accent", "#7D49FF");
      root.style.setProperty(
        "--logo-gradient",
        "linear-gradient(90deg, #FF3FD1, #31D1FF)"
      );
    } else if (themeName === "sunset") {
      root.style.setProperty("--logo-primary", "#ff6b35");
      root.style.setProperty("--logo-secondary", "#ffd23f");
      root.style.setProperty("--logo-accent", "#ff4d6d");
      root.style.setProperty(
        "--logo-gradient",
        "linear-gradient(90deg, #ff6b35, #ffd23f)"
      );
    }
  };

  const currentSlideData = slider.slides[currentSlide];

  const getContainerClass = () => {
    switch (slider.containerType) {
      case "content":
        return "container-content";
      case "narrow":
        return "container-narrow";
      default:
        return "container-divi";
    }
  };

  return (
    <section className={`w-full ${slider.layout.padding} relative z-[1]`}>
      <div className={getContainerClass()}>
        <div className={`${slider.layout.grid} ${slider.layout.minHeight}`}>
          {/* Contenu avec effet de glissement - démarre en premier */}
          <div className="relative overflow-hidden">
            {slider.slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                  transitionDelay: "0ms", // Démarre immédiatement
                }}
              >
                <HeroContent
                  slide={slide}
                  slides={slider.slides}
                  currentSlide={currentSlide}
                  onSlideChange={goToSlide}
                  config={slider}
                  currentTheme={slide.theme}
                />
              </div>
            ))}
          </div>

          {/* Image avec effet de glissement - démarre après le texte */}
          <div className="relative overflow-hidden">
            {slider.slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                  transitionDelay: "200ms", // Délai de 200ms après le texte
                }}
              >
                <HeroImage slide={slide} config={slider} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-4">
          {slider.slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  relative w-16 h-2 rounded-full overflow-hidden cursor-pointer
                  transition-all duration-300 hover:scale-105
                  ${isActive ? "opacity-100" : "opacity-60 hover:opacity-80"}
                `}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <div
                  className={`
                    absolute inset-0 rounded-full 
                    transition-all duration-500 ease-out
                    ${isActive ? "w-full animate-fade-in" : "w-0"}
                  `}
                  style={{
                    background: getThemeStyle(slide.theme, "gradient"),
                    boxShadow: isActive
                      ? `0 0 12px ${getThemeStyle(slide.theme, "color")}40`
                      : "none",
                  }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
