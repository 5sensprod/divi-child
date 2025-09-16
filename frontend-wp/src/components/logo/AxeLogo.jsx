// src/components/logo/AxeLogo.jsx

import { useEffect, useState, useMemo } from "react";
import { getLogoSizePx } from "../../config/components";
import "../logo/logo.css";

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || isMobile) return;
    const root = document.documentElement;
    const colors =
      theme === "sunset"
        ? { primary: "#ff6b35", secondary: "#ffd23f", accent: "#ff4d6d" }
        : { primary: "#FF3FD1", secondary: "#31D1FF", accent: "#7D49FF" };
    requestAnimationFrame(() => {
      root.style.setProperty("--logo-primary", colors.primary);
      root.style.setProperty("--logo-secondary", colors.secondary);
      root.style.setProperty("--logo-accent", colors.accent);
    });
  }, [theme, isClient, isMobile]);

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

  if (!isClient) {
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
        {/* Effet membrane (durées pilotables via CSS vars) */}
        <div
          className="speaker-membrane"
          style={{
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
              transform: "translateZ(0)",
            }}
          />
        </div>

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
      </div>
    );
  }

  // Desktop : SVG + flicker néon (animation via classe .neon-flicker)
  return (
    <div {...containerProps}>
      <div
        className="neon-flicker"
        style={{
          "--neon-duration": "4s",
          "--neon-hover-duration": "2s",
        }}
      >
        <svg
          width={logoSize}
          viewBox="0 0 423 281"
          className="logo-svg"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: `
              drop-shadow(0 0 8px var(--logo-primary, #FF3FD1)) 
              drop-shadow(0 0 15px var(--logo-primary, #FF3FD1)) 
              drop-shadow(0 0 25px var(--logo-primary, #FF3FD1))
            `,
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
            className="logo-text-axe"
            style={{
              fontSize: `${textSizes.axe}px`,
              left: "51%",
              top: "32%",
              transform: "translate(-50%, -50%)",
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
            className="logo-text-musique"
            style={{
              fontSize: `${textSizes.musique}px`,
              left: "51%",
              top: "70%",
              transform: "translate(-50%, -50%)",
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
      </div>
    </div>
  );
};

export default AxeLogo;
