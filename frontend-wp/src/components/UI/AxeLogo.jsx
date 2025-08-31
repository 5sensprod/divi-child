// src/components/UI/AxeLogo.jsx
// Version optimisée : Mobile = effet haut-parleur, Desktop = effet néon

import { useEffect, useState, useMemo } from "react";
import { getLogoSizePx } from "../../config/components";

const AxeLogo = ({
  width,
  className = "",
  theme = "neon",
  onClick,
  alt = "Logo Axe Musique",
  isScrolled = false,
  isMobile = false,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Détection côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Application du thème optimisée (seulement pour desktop SVG)
  useEffect(() => {
    if (!isClient || isMobile) return;

    const root = document.documentElement;
    const colors =
      theme === "sunset"
        ? { primary: "#ff6b35", secondary: "#ffd23f", accent: "#ff4d6d" }
        : { primary: "#FF3FD1", secondary: "#31D1FF", accent: "#7D49FF" };

    // Batch les changements CSS
    requestAnimationFrame(() => {
      root.style.setProperty("--logo-primary", colors.primary);
      root.style.setProperty("--logo-secondary", colors.secondary);
      root.style.setProperty("--logo-accent", colors.accent);
    });
  }, [theme, isClient, isMobile]);

  // Calcul de taille memoized
  const logoSize = useMemo(
    () =>
      getLogoSizePx({
        isMobile,
        isScrolled,
        widthOverride: width,
      }),
    [isMobile, isScrolled, width]
  );

  const textSizes = useMemo(
    () => ({
      axe: Math.round(logoSize * 0.285),
      musique: Math.round(logoSize * 0.16),
      scale: logoSize / 200,
    }),
    [logoSize]
  );

  // Props communes pour le conteneur
  const containerProps = {
    className: `logo-container ${className} relative inline-block cursor-pointer transition-transform duration-300 hover:scale-105`,
    onClick,
    style: {
      cursor: onClick ? "pointer" : "default",
      width: logoSize,
      height: "auto",
    },
    "aria-label": alt,
    role: "img",
    translate: "no",
  };

  // Version mobile optimisée avec WebP + effet membrane
  if (!isClient) {
    // Skeleton pendant l'hydration
    return (
      <div
        {...containerProps}
        style={{
          ...containerProps.style,
          height: logoSize * 0.7,
          background:
            theme === "sunset"
              ? "linear-gradient(90deg, #ff6b35, #ffd23f)"
              : "linear-gradient(90deg, #FF3FD1, #31D1FF)",
          borderRadius: "8px",
        }}
      />
    );
  }

  if (isMobile) {
    return (
      <div {...containerProps}>
        {/* Container avec effet de membrane rythmé */}
        <div
          className="speaker-membrane relative"
          style={{
            animation:
              "speakerBeat var(--speaker-duration, 3s) ease-in-out infinite",
            transformOrigin: "center center",
            "--speaker-duration": "3s",
            "--speaker-beat-end": "24%",
            "--speaker-hover-duration": "1.5s",
          }}
        >
          <img
            src="/assets/images/Logo_Axe_neon_crop-min.webp"
            alt={alt}
            width={logoSize}
            height="auto"
            loading={isScrolled ? "eager" : "lazy"}
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-auto transition-all duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              maxWidth: logoSize,
              filter:
                theme === "sunset"
                  ? "hue-rotate(25deg) saturate(1.1) drop-shadow(0 0 12px #ff6b3580)"
                  : "drop-shadow(0 0 12px #FF3FD180)",
              transform: "translateZ(0)", // Force GPU
            }}
          />
        </div>

        {/* Fallback pendant chargement */}
        {!imageLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center text-white font-bold text-center leading-tight"
            style={{
              background:
                theme === "sunset"
                  ? "linear-gradient(90deg, #ff6b35, #ffd23f)"
                  : "linear-gradient(90deg, #FF3FD1, #31D1FF)",
              borderRadius: "8px",
              fontSize: `${textSizes.axe * 0.7}px`,
            }}
          >
            <div>
              <div
                style={{ fontFamily: "'AnticFont', Impact, Arial, sans-serif" }}
              >
                AXE
              </div>
              <div
                style={{
                  fontFamily: "'Bauhaus', Arial, sans-serif",
                  fontSize: `${textSizes.musique * 0.8}px`,
                  marginTop: "-2px",
                }}
              >
                MUSIQUE
              </div>
            </div>
          </div>
        )}

        {/* Styles CSS pour l'effet haut-parleur mobile */}
        <style jsx>{`
          @keyframes speakerBeat {
            0% {
              transform: scale(1);
            }
            4% {
              transform: scale(1.08);
            }
            8% {
              transform: scale(0.92);
            }
            12% {
              transform: scale(1.05);
            }
            16% {
              transform: scale(0.96);
            }
            20% {
              transform: scale(1.02);
            }
            24% {
              transform: scale(1);
            }
            24%,
            100% {
              transform: scale(1);
            }
          }

          .speaker-membrane:hover {
            animation: speakerBeat var(--speaker-hover-duration) ease-in-out
              infinite;
          }

          .speaker-membrane:active {
            transform: scale(0.92);
            transition: transform 0.15s ease-out;
          }
        `}</style>
      </div>
    );
  }

  // Version desktop avec SVG + effet grésillement néon UNIQUEMENT
  return (
    <div {...containerProps}>
      <div
        className="neon-flicker relative"
        style={{
          animation:
            "neonFlicker var(--neon-duration, 4s) ease-in-out infinite",
          "--neon-duration": "4s",
          "--neon-hover-duration": "2s",
        }}
      >
        <svg
          width={logoSize}
          viewBox="0 0 423 281"
          className="logo-svg transition-all duration-300"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: `
              drop-shadow(0 0 8px var(--logo-primary, #FF3FD1)) 
              drop-shadow(0 0 15px var(--logo-primary, #FF3FD1)) 
              drop-shadow(0 0 25px var(--logo-primary, #FF3FD1))
            `,
            willChange: "filter, opacity",
          }}
        >
          <defs>
            <linearGradient
              id={`logoGradient-${theme}-${logoSize}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "var(--logo-primary, #FF3FD1)" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "var(--logo-secondary, #31D1FF)" }}
              />
            </linearGradient>
          </defs>

          {/* Forme du badge */}
          <g transform="matrix(0.989355,0,0,1.04873,-39.0155,-125.719)">
            <g transform="matrix(1.78644,0,0,1.6853,-320.147,2.81323)">
              <g transform="matrix(0.906335,0,0,0.903945,184.699,-38.0939)">
                <path
                  d="M160.439,138.936L161.448,137.124L163.501,133.438L255.115,124.455L244.648,149.836L255.169,208.156L273.813,202.388L263.227,224.809L266.126,263.994L277.33,287.442L253.944,282.005L189.421,276.747L177.576,294.681L166.166,276.597L20.774,283.393L34.657,265.201L42.278,221.953L37.271,204.557L56.055,209.234L73.399,149.226L64.439,124.551L157.613,133.443L160.439,138.936ZM160.158,155.993L152.475,141.059L76.361,133.795L81.861,148.942L61.63,218.938L48.873,215.761L50.529,221.514L42.241,268.542L37.676,274.524L170.466,268.318L177.73,279.832L185.335,268.318L255.186,274.01L262.838,275.789L258.212,266.108L255.043,223.282L258.716,215.504L248.866,218.551L236.307,148.942L242.554,133.795L168.475,141.059L160.158,155.993Z"
                  fill="white"
                  fillRule="evenodd"
                  stroke={`url(#logoGradient-${theme}-${logoSize})`}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
              </g>
            </g>
          </g>
        </svg>

        {/* Texte SVG avec glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute text-white logo-text-axe"
            style={{
              fontSize: `${textSizes.axe}px`,
              left: "51%",
              top: "32%",
              transform: "translate(-50%, -50%)",
              lineHeight: "1",
              letterSpacing: `${textSizes.scale * 0.05}em`,
              textShadow: `
                0 0 5px var(--logo-primary, #FF3FD1),
                0 0 10px var(--logo-primary, #FF3FD1),
                0 0 15px var(--logo-primary, #FF3FD1)
              `,
            }}
          >
            AXE
          </div>
          <div
            className="absolute text-white logo-text-musique"
            style={{
              fontSize: `${textSizes.musique}px`,
              left: "51%",
              top: "70%",
              transform: "translate(-50%, -50%)",
              lineHeight: "1",
              letterSpacing: `${textSizes.scale * 0.1}em`,
              textShadow: `
                0 0 3px var(--logo-primary, #FF3FD1),
                0 0 6px var(--logo-primary, #FF3FD1),
                0 0 10px var(--logo-primary, #FF3FD1)
              `,
            }}
          >
            MUSIQUE
          </div>
        </div>

        {/* Styles CSS pour l'effet grésillement néon desktop */}
        <style jsx>{`
          @keyframes neonFlicker {
            0% {
              opacity: 1;
              filter: brightness(1) saturate(1) contrast(1);
            }
            3% {
              opacity: 0.92;
              filter: brightness(1.15) saturate(1.08) contrast(1.05);
            }
            6% {
              opacity: 1;
              filter: brightness(0.88) saturate(0.95) contrast(0.98);
            }
            9% {
              opacity: 0.96;
              filter: brightness(1.12) saturate(1.06) contrast(1.03);
            }
            12% {
              opacity: 1;
              filter: brightness(1) saturate(1) contrast(1);
            }
            18% {
              opacity: 0.94;
              filter: brightness(1.18) saturate(1.1) contrast(1.06);
            }
            21% {
              opacity: 1;
              filter: brightness(0.91) saturate(0.97) contrast(0.99);
            }
            25% {
              opacity: 0.98;
              filter: brightness(1.08) saturate(1.04) contrast(1.02);
            }
            30% {
              opacity: 1;
              filter: brightness(1) saturate(1) contrast(1);
            }
            45% {
              opacity: 0.99;
              filter: brightness(1.02) saturate(1.01) contrast(1);
            }
            48% {
              opacity: 1;
              filter: brightness(0.98) saturate(0.99) contrast(1);
            }
            65% {
              opacity: 0.97;
              filter: brightness(1.05) saturate(1.03) contrast(1.01);
            }
            68% {
              opacity: 1;
              filter: brightness(1) saturate(1) contrast(1);
            }
            85% {
              opacity: 0.995;
              filter: brightness(1.01) saturate(1.005) contrast(1);
            }
            100% {
              opacity: 1;
              filter: brightness(1) saturate(1) contrast(1);
            }
          }

          .neon-flicker:hover {
            animation: neonFlicker var(--neon-hover-duration) ease-in-out
              infinite;
          }

          .neon-flicker:active {
            opacity: 0.85;
            filter: brightness(1.3) saturate(1.2) contrast(1.1);
            transition: all 0.15s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default AxeLogo;
