// src/components/Layout/Header.jsx
// Version avec configuration centralisée avancée + micro-optimisations

import { useState, useEffect } from "react";
import { useWordPress } from "../../context/WordPressContext";
import {
  HEADER_CONFIG,
  getThemeStyle,
  getCurrentTheme,
  applyBackgroundTheme,
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
    className="absolute inset-0"
    style={{ zIndex: HEADER_CONFIG.zIndex.background }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 2880 1440"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
    >
      <defs>
        {/* Base dark gradient avec variables CSS */}
        <linearGradient id="bg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: "var(--axe-bg-0, #0E0B1F)" }} />
          <stop
            offset="55%"
            style={{ stopColor: "var(--axe-bg-55, #1A1050)" }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--axe-bg-100, #2A1372)" }}
          />
        </linearGradient>

        {/* Diffuse neon gradients avec variables */}
        <radialGradient id="diffusePink" cx="18%" cy="14%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop
            offset="8%"
            style={{ stopColor: "var(--axe-pink-core, #FF7BE5)" }}
            stopOpacity="0.85"
          />
          <stop
            offset="25%"
            style={{ stopColor: "var(--axe-pink-outer, #FF3FD1)" }}
            stopOpacity="0.55"
          />
          <stop
            offset="60%"
            style={{ stopColor: "var(--axe-pink-outer, #FF3FD1)" }}
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--axe-pink-outer, #FF3FD1)" }}
            stopOpacity="0"
          />
        </radialGradient>

        <radialGradient id="diffuseCyan" cx="82%" cy="12%" r="58%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop
            offset="8%"
            style={{ stopColor: "var(--axe-cyan-core, #9BEAFF)" }}
            stopOpacity="0.85"
          />
          <stop
            offset="26%"
            style={{ stopColor: "var(--axe-cyan-outer, #31D1FF)" }}
            stopOpacity="0.55"
          />
          <stop
            offset="62%"
            style={{ stopColor: "var(--axe-cyan-outer, #31D1FF)" }}
            stopOpacity="0.18"
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--axe-cyan-outer, #31D1FF)" }}
            stopOpacity="0"
          />
        </radialGradient>

        {/* Bottom violet avec variable */}
        <radialGradient id="bottomViolet" cx="70%" cy="90%" r="60%">
          <stop
            offset="0%"
            style={{ stopColor: "var(--axe-violet, #7D49FF)" }}
            stopOpacity="0.70"
          />
          <stop
            offset="55%"
            style={{ stopColor: "var(--axe-violet, #7D49FF)" }}
            stopOpacity="0.22"
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--axe-violet, #7D49FF)" }}
            stopOpacity="0"
          />
        </radialGradient>

        {/* Vignette (pas de variable nécessaire) */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".30" />
        </radialGradient>

        {/* Smoke / haze */}
        <filter
          id="smoke"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.013"
            numOctaves="3"
            seed="17"
            result="noise"
          >
            <animate
              attributeName="baseFrequency"
              values="0.008 0.013; 0.006 0.010; 0.008 0.013"
              dur="22s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feGaussianBlur in="noise" stdDeviation="18" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 1
                                                         0 0 0 0 1
                                                         0 0 0 0 1
                                                         0 0 0 0.28 0"
            result="smokeField"
          />
        </filter>

        <style>{`
          .screen { mix-blend-mode: screen; }
          .softLight { mix-blend-mode: soft-light; }
        `}</style>
      </defs>

      {/* Base */}
      <rect width="100%" height="100%" fill="url(#bg)" />
      {/* Diffuse top glows */}
      <g className="screen">
        <rect width="50%" height="100%" fill="url(#diffusePink)" />
        <rect width="100%" height="100%" fill="url(#diffuseCyan)" />
        <ellipse
          cx="2050"
          cy="1100"
          rx="1100"
          ry="720"
          fill="url(#bottomViolet)"
        />
      </g>
      {/* Smoke / haze */}
      <rect
        width="100%"
        height="100%"
        filter="url(#smoke)"
        className="softLight"
        opacity=".9"
      />
      {/* Subtle vignette */}
      <rect width="100%" height="100%" fill="url(#vignette)" opacity=".6" />
    </svg>
  </div>
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

  // Apply theme - Optimisé avec getThemeStyle + Background SVG
  useEffect(() => {
    const slide = slider.slides[currentSlide];
    if (!slide?.theme) return;

    const root = document.documentElement;

    // Appliquer les thèmes gradient/texte
    root.style.setProperty(
      "--current-gradient",
      getThemeStyle(slide.theme, "gradient")
    );
    root.style.setProperty(
      "--current-text-gradient",
      getThemeStyle(slide.theme, "textGradient")
    );

    // Appliquer les variables CSS pour le background SVG
    applyBackgroundTheme(slide.theme);
  }, [currentSlide, slider.slides]);

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
