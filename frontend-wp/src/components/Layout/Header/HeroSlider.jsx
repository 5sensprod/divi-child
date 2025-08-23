// src/components/Layout/Header/HeroSlider.jsx
// Logique slider avec gestion des thèmes

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
          <HeroContent
            slide={currentSlideData}
            slides={slider.slides}
            currentSlide={currentSlide}
            onSlideChange={goToSlide}
            config={slider}
          />
          <HeroImage slide={currentSlideData} config={slider} />
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
