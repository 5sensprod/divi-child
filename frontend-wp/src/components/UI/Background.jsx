// src/components/UI/Background.jsx
// Version inspirée de HeroBackground.jsx sans le SVG

import { useState, useEffect } from "react";
import { HEADER_CONFIG } from "../../config/components";

const Background = ({
  variant = "default",
  opacity = 1,
  className = "",
  animated = true,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [reduceAnimations, setReduceAnimations] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // Détection préférence animations réduites
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      setReduceAnimations(mobile || prefersReduced);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Version mobile ultra-simplifiée (comme HeroBackground)
  if (isMobile) {
    return (
      <div
        className="absolute inset-0"
        style={{
          zIndex: HEADER_CONFIG.zIndex.background,
          background: getBackgroundForVariant(variant, true),
        }}
      />
    );
  }

  // Version desktop optimisée (CSS pur)
  return (
    <div
      className="absolute inset-0"
      style={{
        zIndex: HEADER_CONFIG.zIndex.background,
        opacity,
        pointerEvents: "none",
      }}
    >
      {/* Background principal avec variables CSS */}
      <div
        className="w-full h-full relative"
        style={{
          background: getBackgroundForVariant(variant, false),
          backgroundSize: "200% 200%",
          willChange: "auto",
          // Transitions fluides pour les changements de thème
          transition:
            animated && !reduceAnimations
              ? "background 1.2s cubic-bezier(0.4, 0, 0.2, 1), filter 0.8s ease-out"
              : "background 0.7s ease-in-out",
          animation:
            animated && !reduceAnimations
              ? "backgroundFlow 20s ease-in-out infinite alternate"
              : "none",
        }}
      />

      {/* Overlay de transition pour adoucir les changements */}
      {animated && !reduceAnimations && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.03) 100%)",
            transition: "opacity 1.5s ease-out",
            mixBlendMode: "soft-light",
          }}
        />
      )}

      {/* Animations CSS améliorées */}
      {animated && !reduceAnimations && (
        <style jsx>{`
          @keyframes backgroundFlow {
            0% {
              background-position: 0% 50%;
              filter: brightness(1) hue-rotate(0deg) saturate(1);
            }
            25% {
              background-position: 25% 25%;
              filter: brightness(1.05) hue-rotate(3deg) saturate(1.1);
            }
            50% {
              background-position: 100% 50%;
              filter: brightness(0.98) hue-rotate(-2deg) saturate(0.95);
            }
            75% {
              background-position: 75% 75%;
              filter: brightness(1.02) hue-rotate(5deg) saturate(1.05);
            }
            100% {
              background-position: 0% 50%;
              filter: brightness(1) hue-rotate(0deg) saturate(1);
            }
          }

          /* Animation de morphing entre thèmes */
          @keyframes themeMorph {
            0% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
            50% {
              transform: scale(1.02) rotate(0.5deg);
              opacity: 0.95;
            }
            100% {
              transform: scale(1) rotate(0deg);
              opacity: 1;
            }
          }

          /* Animation des gradients radiaux */
          @keyframes gradientPulse {
            0%,
            100% {
              background-size: 200% 200%;
            }
            50% {
              background-size: 220% 220%;
            }
          }

          /* Classe pour transition entre thèmes */
          .theme-transition {
            animation: themeMorph 2s ease-in-out,
              gradientPulse 15s ease-in-out infinite;
          }
        `}</style>
      )}
    </div>
  );
};

// Fonction pour générer le background selon le variant (comme HeroBackground)
const getBackgroundForVariant = (variant, isMobile) => {
  const intensity = isMobile ? 0.6 : 1; // Réduire l'intensité sur mobile

  const backgrounds = {
    // Variante par défaut - utilise les variables CSS comme HeroBackground
    default: `
      radial-gradient(ellipse 60% 60% at 70% 90%, 
        rgba(125, 73, 255, ${0.4 * intensity}) 0%, 
        rgba(125, 73, 255, ${0.15 * intensity}) 55%, 
        transparent 100%),
      radial-gradient(ellipse 50% 50% at 18% 14%, 
        rgba(255, 123, 229, ${0.3 * intensity}) 0%, 
        rgba(255, 63, 209, ${0.15 * intensity}) 25%, 
        transparent 60%),
      radial-gradient(ellipse 58% 58% at 82% 12%, 
        rgba(155, 234, 255, ${0.3 * intensity}) 0%, 
        rgba(49, 209, 255, ${0.15 * intensity}) 26%, 
        transparent 62%),
      radial-gradient(ellipse 70% 70% at 50% 50%, 
        transparent 70%, 
        rgba(0, 0, 0, ${0.15 * intensity}) 100%),
      linear-gradient(135deg, 
        var(--axe-bg-0, var(--bg-dark-0, #0E0B1F)) 0%, 
        var(--axe-bg-55, var(--bg-dark-55, #1A1050)) 55%, 
        var(--axe-bg-100, var(--bg-dark-100, #2A1372)) 100%)
    `,

    // Variante héro - plus intense
    hero: `
      radial-gradient(ellipse 70% 70% at 70% 90%, 
        var(--axe-violet, rgba(125, 73, 255, ${0.5 * intensity})) 0%, 
        var(--axe-violet, rgba(125, 73, 255, ${0.2 * intensity})) 55%, 
        transparent 100%),
      radial-gradient(ellipse 60% 60% at 18% 14%, 
        var(--axe-pink-core, rgba(255, 123, 229, ${0.4 * intensity})) 0%, 
        var(--axe-pink-outer, rgba(255, 63, 209, ${0.2 * intensity})) 25%, 
        transparent 60%),
      radial-gradient(ellipse 65% 65% at 82% 12%, 
        var(--axe-cyan-core, rgba(155, 234, 255, ${0.4 * intensity})) 0%, 
        var(--axe-cyan-outer, rgba(49, 209, 255, ${0.2 * intensity})) 26%, 
        transparent 62%),
      radial-gradient(ellipse 80% 80% at 50% 50%, 
        transparent 60%, 
        rgba(0, 0, 0, ${0.2 * intensity}) 100%),
      linear-gradient(135deg, 
        var(--axe-bg-0, var(--bg-dark-0, #0E0B1F)) 0%, 
        var(--axe-bg-55, var(--bg-dark-55, #1A1050)) 55%, 
        var(--axe-bg-100, var(--bg-dark-100, #2A1372)) 100%)
    `,

    // Boutique - tons clairs et neutres
    boutique: `
      radial-gradient(ellipse 60% 60% at 70% 80%, 
        rgba(255, 255, 255, ${0.15 * intensity}) 0%, 
        rgba(240, 245, 255, ${0.08 * intensity}) 50%, 
        transparent 100%),
      radial-gradient(ellipse 50% 50% at 20% 25%, 
        rgba(248, 250, 252, ${0.12 * intensity}) 0%, 
        rgba(226, 232, 240, ${0.06 * intensity}) 35%, 
        transparent 70%),
      radial-gradient(ellipse 55% 55% at 80% 20%, 
        rgba(241, 245, 249, ${0.1 * intensity}) 0%, 
        rgba(203, 213, 225, ${0.05 * intensity}) 30%, 
        transparent 65%),
      linear-gradient(135deg, 
        #f8fafc 0%, 
        #f1f5f9 40%, 
        #e2e8f0 100%)
    `,

    // Subtle - version discrète
    subtle: `
      radial-gradient(ellipse 50% 50% at 70% 90%, 
        rgba(125, 73, 255, ${0.2 * intensity}) 0%, 
        rgba(125, 73, 255, ${0.05 * intensity}) 50%, 
        transparent 100%),
      linear-gradient(135deg, 
        var(--axe-bg-0, var(--bg-dark-0, #0E0B1F)) 0%, 
        var(--axe-bg-55, var(--bg-dark-55, #1A1050)) 60%, 
        var(--axe-bg-100, var(--bg-dark-100, #2A1372)) 100%)
    `,
  };

  return backgrounds[variant] || backgrounds.default;
};

export default Background;
