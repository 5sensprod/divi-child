// src/components/Layout/Header.jsx
// Version avec configuration centralisée avancée + micro-optimisations

import { useState, useEffect } from "react";
import { useWordPress } from "../../context/WordPressContext";
import {
  HEADER_CONFIG,
  getThemeStyle,
  getCurrentTheme,
} from "../../config/components";
import Navigation from "./Navigation";

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();

  return (
    <header className="relative">
      {showHero && <HeroBackground />}

      <div className="z-navigation sticky top-0">
        <Navigation
          menuItems={menus?.items || []}
          siteTitle={siteData?.site_title || HEADER_CONFIG.defaults.siteTitle}
          loading={loading.menus}
          {...HEADER_CONFIG.navigation}
        />
      </div>

      {showHero && (
        <HeroSlider
          siteTitle={siteData?.site_title || HEADER_CONFIG.defaults.siteTitle}
          siteDescription={
            siteData?.site_description || HEADER_CONFIG.defaults.siteDescription
          }
        />
      )}
    </header>
  );
};

const HeroBackground = () => (
  <div
    className="absolute inset-0 hero-background"
    style={{ zIndex: HEADER_CONFIG.zIndex.background }}
  />
);

const HeroSlider = ({ siteTitle, siteDescription }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { slider, themes } = HEADER_CONFIG;

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slider.slides.length);
    }, slider.autoplayDelay);
    return () => clearInterval(timer);
  }, [slider.slides.length, slider.autoplayDelay]);

  // Apply theme
  useEffect(() => {
    const slide = slider.slides[currentSlide];
    const root = document.documentElement;

    if (slide?.theme) {
      const theme = themes[slide.theme] || themes.primary;
      root.style.setProperty("--current-gradient", theme.gradient);
      root.style.setProperty("--current-text-gradient", theme.textGradient);
    }
  }, [currentSlide, slider.slides, themes]);

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
    <section
      className={`w-full ${slider.layout.padding.desktop} relative z-[1]`}
    >
      <div className={getContainerClass()}>
        <div className={`${slider.layout.grid} ${slider.layout.minHeight}`}>
          {/* Contenu gauche */}
          <div className="flex flex-col justify-center">
            <div className="max-w-prose mx-auto md:mx-0 w-full text-center md:text-left">
              <h1
                className={`${slider.typography.title.classes} ${slider.typography.title.responsive}`}
                style={{
                  background: "var(--current-text-gradient)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {currentSlideData.title}
              </h1>

              <p
                className={`${slider.typography.description.classes} ${slider.typography.description.responsive}`}
              >
                {currentSlideData.description}
              </p>

              <div className="flex flex-col gap-6 self-center md:self-start">
                <HeroButton config={slider.button} />
                <SlideDots
                  slides={slider.slides}
                  currentSlide={currentSlide}
                  onSlideChange={setCurrentSlide}
                  config={slider.dots}
                />
              </div>
            </div>
          </div>

          {/* Image droite */}
          <div className={`relative ${slider.layout.imageHeight}`}>
            <img
              src={currentSlideData.image}
              alt={currentSlideData.title}
              className={`absolute inset-0 w-full h-full object-contain object-bottom ${slider.animations.slideTransition}`}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const SlideDots = ({ slides, currentSlide, onSlideChange, config }) => (
  <div className={config.container}>
    {slides.map((slide, index) => {
      const isActive = index === currentSlide;

      return (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`${config.size} rounded-full cursor-pointer ${
            config.dotTransition
          } ${isActive ? config.activeScale : config.inactiveScale}`}
          style={{
            backgroundColor: isActive
              ? getThemeStyle(slide.theme, "dotColor")
              : config.inactiveColor,
          }}
          aria-label={`Slide ${index + 1}`}
        />
      );
    })}
  </div>
);

const HeroButton = ({ config }) => (
  <button
    onClick={() => (window.location.href = config.href)}
    className={`${config.classes} ${config.animations}`}
    style={{
      background: "var(--current-gradient)",
      boxShadow: config.shadow,
    }}
    onMouseEnter={(e) => {
      const currentTheme = getCurrentTheme();
      e.target.style.background = getThemeStyle(currentTheme, "hoverGradient");
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "var(--current-gradient)";
    }}
  >
    {config.text}
  </button>
);

export default Header;
