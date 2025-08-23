// src/components/Layout/Header/HeroBackground.jsx
// SVG inline isolé avec variables CSS dynamiques

import { HEADER_CONFIG } from "../../../config/components";

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

        {/* Vignette */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity=".30" />
        </radialGradient>

        {/* Smoke / haze avec animation */}
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

export default HeroBackground;
