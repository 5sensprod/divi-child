import React from "react";
import { useTheme } from "../../context/ThemeContext";

const BrandCarousel = ({ brands = [], loading = false }) => {
  const { getThemeColors, theme } = useTheme();
  const colors = getThemeColors(theme);

  const brandsWithImage = brands
    .filter((b) => b.image && b.count > 0)
    .sort((a, b) => b.count - a.count);

  if (loading || brandsWithImage.length === 0) return null;

  const doubled = [...brandsWithImage, ...brandsWithImage];

  const primaryColor = colors?.primary ?? "#ff3fd1";
  const secondaryColor = colors?.secondary ?? "#31d1ff";

  return (
    <section
      className="py-4 overflow-hidden relative"
      style={{
        background: `linear-gradient(to right, ${primaryColor}12, ${secondaryColor}10, ${primaryColor}12)`,
        backgroundColor: "#fafafa",
        borderTop: `1px solid ${primaryColor}20`,
        borderBottom: `1px solid ${primaryColor}20`,
        transition: "all 0.8s ease",
      }}
    >
      {/* Glow très subtil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 100% at 50% 50%, ${primaryColor}06 0%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Label */}
      <p
        className="text-center text-[10px] uppercase tracking-[0.2em] mb-3 relative z-10"
        style={{ color: `${primaryColor}90`, transition: "color 0.8s ease" }}
      >
        Nos marques partenaires
      </p>

      {/* Carrousel */}
      <div
        className="overflow-hidden relative z-10"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div
          className="flex items-center gap-14 w-max"
          style={{ animation: "brandScroll 80s linear infinite" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.animationPlayState = "paused")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.animationPlayState = "running")
          }
        >
          {doubled.map((brand, i) => (
            <div
              key={`${brand.id}-${i}`}
              className="flex items-center justify-center h-14 px-1 cursor-default"
              style={{ opacity: 0.75, transition: "opacity 0.3s" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
            >
              <img
                src={brand.image}
                alt={brand.imageAlt}
                className="h-9 w-auto max-w-[120px] object-contain"
                style={{
                  filter: "grayscale(20%) brightness(1)",
                  transition: "filter 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.filter =
                    "grayscale(0%) brightness(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.filter =
                    "grayscale(20%) brightness(1)")
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Séparateur bas */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-1/3"
        style={{
          background: `linear-gradient(to right, transparent, ${primaryColor}30, ${secondaryColor}30, transparent)`,
          transition: "background 0.8s ease",
        }}
      />

      <style>{`
        @keyframes brandScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
};

export default BrandCarousel;
