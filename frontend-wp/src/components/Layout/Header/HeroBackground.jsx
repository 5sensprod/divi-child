// src/components/Layout/Header/HeroBackground.jsx
// Version optimisée pour performances mobile

import { useState, useEffect } from "react";
import { HEADER_CONFIG } from "../../../config/components";

const HeroBackground = () => {
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

  // Version mobile ultra-simplifiée (CSS pur)
  if (isMobile) {
    return (
      <div
        className="absolute inset-0"
        style={{
          zIndex: HEADER_CONFIG.zIndex.background,
          background: `
            radial-gradient(ellipse at 18% 14%, var(--axe-pink-outer, #FF3FD1) 0%, transparent 45%),
            radial-gradient(ellipse at 82% 12%, var(--axe-cyan-outer, #31D1FF) 0%, transparent 45%),
            radial-gradient(ellipse at 70% 90%, var(--axe-violet, #7D49FF) 0%, transparent 60%),
            linear-gradient(135deg, var(--axe-bg-0, #0E0B1F) 0%, var(--axe-bg-55, #1A1050) 55%, var(--axe-bg-100, #2A1372) 100%)
          `,
        }}
      />
    );
  }

  // Version desktop optimisée
  return (
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
        style={{ willChange: "auto" }} // Optimisation GPU
      >
        <defs>
          {/* Base dark gradient avec variables CSS */}
          <linearGradient id="bg" x1="0" y1="1" x2="1" y2="0">
            <stop
              offset="0%"
              style={{ stopColor: "var(--axe-bg-0, #0E0B1F)" }}
            />
            <stop
              offset="55%"
              style={{ stopColor: "var(--axe-bg-55, #1A1050)" }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "var(--axe-bg-100, #2A1372)" }}
            />
          </linearGradient>

          {/* Diffuse neon gradients optimisés */}
          <radialGradient id="diffusePink" cx="18%" cy="14%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop
              offset="8%"
              style={{ stopColor: "var(--axe-pink-core, #FF7BE5)" }}
              stopOpacity="0.7"
            />
            <stop
              offset="25%"
              style={{ stopColor: "var(--axe-pink-outer, #FF3FD1)" }}
              stopOpacity="0.4"
            />
            <stop
              offset="60%"
              style={{ stopColor: "var(--axe-pink-outer, #FF3FD1)" }}
              stopOpacity="0.1"
            />
            <stop offset="100%" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="diffuseCyan" cx="82%" cy="12%" r="58%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop
              offset="8%"
              style={{ stopColor: "var(--axe-cyan-core, #9BEAFF)" }}
              stopOpacity="0.7"
            />
            <stop
              offset="26%"
              style={{ stopColor: "var(--axe-cyan-outer, #31D1FF)" }}
              stopOpacity="0.4"
            />
            <stop
              offset="62%"
              style={{ stopColor: "var(--axe-cyan-outer, #31D1FF)" }}
              stopOpacity="0.1"
            />
            <stop offset="100%" stopOpacity="0" />
          </radialGradient>

          {/* Bottom violet optimisé */}
          <radialGradient id="bottomViolet" cx="70%" cy="90%" r="60%">
            <stop
              offset="0%"
              style={{ stopColor: "var(--axe-violet, #7D49FF)" }}
              stopOpacity="0.5"
            />
            <stop
              offset="55%"
              style={{ stopColor: "var(--axe-violet, #7D49FF)" }}
              stopOpacity="0.15"
            />
            <stop offset="100%" stopOpacity="0" />
          </radialGradient>

          {/* Vignette légère */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="70%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity=".15" />
          </radialGradient>

          {/* Smoke simplifié - seulement si animations autorisées */}
          {!reduceAnimations && (
            <filter
              id="smoke"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.006 0.008"
                numOctaves="2"
                seed="17"
                result="noise"
              >
                <animate
                  attributeName="baseFrequency"
                  values="0.006 0.008; 0.004 0.006; 0.006 0.008"
                  dur="30s"
                  repeatCount="indefinite"
                />
              </feTurbulence>
              <feGaussianBlur in="noise" stdDeviation="8" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="0 0 0 0 1
                        0 0 0 0 1
                        0 0 0 0 1
                        0 0 0 0.15 0"
                result="smokeField"
              />
            </filter>
          )}

          <style>{`
            .screen { mix-blend-mode: screen; }
            .softLight { mix-blend-mode: soft-light; }
            @media (max-width: 768px) {
              .screen, .softLight { mix-blend-mode: normal !important; }
            }
          `}</style>
        </defs>

        {/* Base */}
        <rect width="100%" height="100%" fill="url(#bg)" />

        {/* Diffuse top glows - sans mix-blend-mode sur mobile */}
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

        {/* Smoke / haze - seulement si animations autorisées */}
        {!reduceAnimations && (
          <rect
            width="100%"
            height="100%"
            filter="url(#smoke)"
            className="softLight"
            opacity=".4"
          />
        )}

        {/* Vignette subtile */}
        <rect width="100%" height="100%" fill="url(#vignette)" opacity=".3" />
      </svg>
    </div>
  );
};

export default HeroBackground;
