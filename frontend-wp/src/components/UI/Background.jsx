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

  // Effet pour les changements de thème - Beaucoup plus simple !
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
    <>
      {/* Import du CSS avec les @property */}
      <link rel="stylesheet" href="/styles/background-transitions.css" />

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

      {/* Fallback avec styles inline si CSS @property n'est pas supporté */}
      <noscript>
        <style>{getFallbackStyles(effectiveVariant)}</style>
      </noscript>
    </>
  );
};

// Fallback pour les navigateurs ne supportant pas CSS @property
const getFallbackStyles = (variant) => {
  const colors = getThemeColors(variant);

  return `
    .animated-background {
      background: 
        radial-gradient(ellipse 60% 60% at 70% 90%, 
          ${colors.spot3}40 0%, 
          ${colors.spot3}26 55%, 
          transparent 100%),
        radial-gradient(ellipse 50% 50% at 18% 14%, 
          ${colors.spot1Core}4D 0%, 
          ${colors.spot1Outer}26 25%, 
          transparent 60%),
        radial-gradient(ellipse 58% 58% at 82% 12%, 
          ${colors.spot2Core}4D 0%, 
          ${colors.spot2Outer}26 26%, 
          transparent 62%),
        radial-gradient(ellipse 70% 70% at 50% 50%, 
          transparent 70%, 
          rgba(0, 0, 0, 0.15) 100%),
        linear-gradient(135deg, 
          ${colors.bg0} 0%, 
          ${colors.bg55} 55%, 
          ${colors.bg100} 100%);
      transition: background 1s ease-out;
    }
  `;
};

// Fonction utilitaire pour obtenir les couleurs - TOUS LES THEMES
const getThemeColors = (variant) => {
  const themes = {
    default: {
      bg0: "#0E0B1F",
      bg55: "#1A1050",
      bg100: "#2A1372",
      spot1Core: "#FF7BE5",
      spot1Outer: "#FF3FD1",
      spot2Core: "#9BEAFF",
      spot2Outer: "#31D1FF",
      spot3: "#7D49FF",
    },

    neon: {
      bg0: "#0E0B1F",
      bg55: "#1A1050",
      bg100: "#2A1372",
      spot1Core: "#FF7BE5",
      spot1Outer: "#FF3FD1",
      spot2Core: "#9BEAFF",
      spot2Outer: "#31D1FF",
      spot3: "#7D49FF",
    },

    sunset: {
      bg0: "#1a0b0b",
      bg55: "#4a1730",
      bg100: "#6f1d3a",
      spot1Core: "#ff6b35",
      spot1Outer: "#ff8c42",
      spot2Core: "#ffd23f",
      spot2Outer: "#ffb703",
      spot3: "#ff4d6d",
    },

    oceanNight: {
      bg0: "#0A0E1A",
      bg55: "#132040",
      bg100: "#1E3A5F",
      spot1Core: "#4FC3F7",
      spot1Outer: "#29B6F6",
      spot2Core: "#81D4FA",
      spot2Outer: "#4DD0E1",
      spot3: "#3F51B5",
    },

    havana: {
      bg0: "#1A0F0F",
      bg55: "#2F1B14",
      bg100: "#3D2817",
      spot1Core: "#FF7F50",
      spot1Outer: "#FF6347",
      spot2Core: "#FFD700",
      spot2Outer: "#FFA500",
      spot3: "#A0522D",
    },

    boutique: {
      bg0: "#f8fafc",
      bg55: "#f1f5f9",
      bg100: "#e2e8f0",
      spot1Core: "#ffffff",
      spot1Outer: "#f0f5ff",
      spot2Core: "#f8f9ff",
      spot2Outer: "#e6ecf5",
      spot3: "#f5f7fa",
    },

    hero: {
      bg0: "#0E0B1F",
      bg55: "#1A1050",
      bg100: "#2A1372",
      spot1Core: "#FF7BE5",
      spot1Outer: "#FF3FD1",
      spot2Core: "#9BEAFF",
      spot2Outer: "#31D1FF",
      spot3: "#7D49FF",
    },

    subtle: {
      bg0: "#0E0B1F",
      bg55: "#1A1050",
      bg100: "#2A1372",
      spot1Core: "#FF7BE5",
      spot1Outer: "#FF3FD1",
      spot2Core: "#9BEAFF",
      spot2Outer: "#31D1FF",
      spot3: "#7D49FF",
    },
  };

  return themes[variant] || themes.neon;
};

export default Background;
