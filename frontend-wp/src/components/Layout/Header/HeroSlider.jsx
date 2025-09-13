// HeroSlider.jsx - Version complète avec thème Havana
import { useState, useEffect, useRef } from "react";
import {
  HEADER_CONFIG,
  getThemeStyle,
  applyBackgroundTheme,
} from "../../../config/components";
import HeroContent from "./HeroComponents/HeroContent";
import HeroImage from "./HeroComponents/HeroImage";
import { useTheme } from "../../../context/ThemeContext";

const HeroSlider = ({ siteTitle, siteDescription }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { slider } = HEADER_CONFIG;
  const { setTheme } = useTheme();
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
    }, 100);
  };

  // Autoplay
  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, slider.autoplayDelay);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // Apply theme - COMPLET avec tous les thèmes
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

  useEffect(() => {
    const t = slider.slides[currentSlide]?.theme ?? "neon";
    setTheme(t); // ← DIFFUSE le thème via contexte
  }, [currentSlide, slider.slides, setTheme]);

  // Fonction logo COMPLÈTE avec tous les thèmes
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
    } else if (themeName === "oceanNight") {
      root.style.setProperty("--logo-primary", "#70B2E0");
      root.style.setProperty("--logo-secondary", "#4DD0E1");
      root.style.setProperty("--logo-accent", "#3F51B5");
      root.style.setProperty(
        "--logo-gradient",
        "linear-gradient(90deg, #70B2E0, #4DD0E1)"
      );
    } else if (themeName === "havana") {
      // NOUVEAU - Thème Havana
      root.style.setProperty("--logo-primary", "#FF7F50");
      root.style.setProperty("--logo-secondary", "#FFD700");
      root.style.setProperty("--logo-accent", "#A0522D");
      root.style.setProperty(
        "--logo-gradient",
        "linear-gradient(90deg, #FF7F50, #FFD700)"
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
    <div className="relative">
      <div className={getContainerClass()}>
        <div className={`${slider.layout.grid} ${slider.layout.minHeight}`}>
          {/* Contenu avec effet de glissement */}
          <div className="relative overflow-hidden">
            {slider.slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                  transitionDelay: "0ms",
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

          {/* Image avec effet de glissement */}
          <div className="relative overflow-hidden">
            {slider.slides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(${(index - currentSlide) * 100}%)`,
                  transitionDelay: "200ms",
                }}
              >
                <HeroImage slide={slide} config={slider} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex gap-4">
          {slider.slides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`
                  relative w-12 h-2 rounded-full overflow-hidden cursor-pointer
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
    </div>
  );
};

export default HeroSlider;
