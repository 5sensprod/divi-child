// src/components/UI/Background.jsx
// Version ultra-optimisée avec CSS @property et transitions fluides

import { useState, useEffect, useRef } from "react";
import { HEADER_CONFIG } from "../../config/components";
import { useTheme } from "../../context/ThemeContext";

const Background = ({
  variant = "auto",
  opacity = 1,
  className = "",
  animated = true,
}) => {
  const { theme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);
  const [reduceAnimations, setReduceAnimations] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const backgroundRef = useRef(null);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setReduceAnimations(mobile || prefersReduced);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Effet pour les changements de thème - Gardons votre logique originale
  useEffect(() => {
    const effectiveTheme = variant === "auto" ? theme || "neon" : variant;
    const element = backgroundRef.current;

    if (!element) return;

    console.log("🎨 Changement de thème:", effectiveTheme);

    // Marquer la transition
    setIsTransitioning(true);
    element.classList.add("transitioning");

    // Changer la classe de thème - Les transitions CSS s'occupent du reste !
    element.className =
      element.className.replace(/theme-\w+/g, "") + // Enlever l'ancien thème
      ` theme-${effectiveTheme.replace(/([A-Z])/g, "-$1").toLowerCase()}`; // Ajouter le nouveau

    // Fin de transition
    const timeoutId = setTimeout(() => {
      element.classList.remove("transitioning");
      setIsTransitioning(false);
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [theme, variant]);

  const effectiveVariant = variant === "auto" ? theme || "neon" : variant;
  const themeClass = `theme-${effectiveVariant
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()}`;

  return (
    <div
      ref={backgroundRef}
      className={`
        absolute inset-0 animated-background 
        ${themeClass}
        ${animated && !reduceAnimations ? "with-motion" : ""}
        ${className}
      `}
      style={{
        zIndex: HEADER_CONFIG.zIndex.background,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

export default Background;
