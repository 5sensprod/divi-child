// src/components/Layout/Header/HeroSlider.jsx
// Logique slider avec gestion des thèmes pour Background + Logo

import { useState, useEffect } from "react";
import {
  HEADER_CONFIG,
  getThemeStyle,
  applyBackgroundTheme,
} from "../../../config/components";
import HeroContent from "./HeroComponents/HeroContent";
import HeroImage from "./HeroComponents/HeroImage";

const HeroSlider = ({ siteTitle, siteDescription }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { slider } = HEADER_CONFIG;

  // Auto-advance avec reset du timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slider.slides.length);
    }, slider.autoplayDelay);

    return () => clearInterval(timer);
  }, [slider.slides.length, slider.autoplayDelay, currentSlide]);

  // Fonction pour changer de slide manuellement (remet le timer à zéro)
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Apply theme - Optimisé avec getThemeStyle + Background SVG + Logo
  useEffect(() => {
    const slide = slider.slides[currentSlide];
    if (!slide?.theme) return;

    const root = document.documentElement;

    // Appliquer les thèmes gradient/texte pour le contenu
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

    // Appliquer les variables CSS pour le logo
    applyLogoTheme(slide.theme);
  }, [currentSlide, slider.slides]);

  // Fonction pour appliquer les thèmes au logo
  const applyLogoTheme = (themeName) => {
    const root = document.documentElement;

    if (themeName === "neon") {
      // Thème neon - couleurs électriques
      root.style.setProperty("--logo-primary", "#FF3FD1");
      root.style.setProperty("--logo-secondary", "#31D1FF");
      root.style.setProperty("--logo-accent", "#7D49FF");
      root.style.setProperty(
        "--logo-gradient",
        "linear-gradient(90deg, #FF3FD1, #31D1FF)"
      );
    } else if (themeName === "sunset") {
      // Thème sunset - couleurs chaudes
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
          <HeroContent
            slide={currentSlideData}
            slides={slider.slides}
            currentSlide={currentSlide}
            onSlideChange={goToSlide}
            config={slider}
            currentTheme={currentSlideData.theme} // Passer le thème actuel
          />
          <HeroImage slide={currentSlideData} config={slider} />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
