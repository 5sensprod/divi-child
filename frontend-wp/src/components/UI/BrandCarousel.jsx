import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { API_CONFIG } from "../../utils/constants";

const BrandCarousel = ({ brands = [], loading = false }) => {
  const { getThemeColors, theme } = useTheme();
  const colors = getThemeColors(theme);

  // Sous `useAxeCatalog`, les marques ne viennent plus des props — donc plus du
  // `WordPressContext`, donc plus de WooCommerce : le composant va les chercher
  // lui-même dans notre catalogue. L'import est dynamique pour la même raison
  // que dans `AnimatedStats` : sous le drapeau, `woocommerce` n'est pas chargé.
  const [axeBrands, setAxeBrands] = useState(null);

  useEffect(() => {
    if (!API_CONFIG.useAxeCatalog) return;

    let cancelled = false;
    (async () => {
      try {
        const { fetchOnlineBrands } = await import("../../services/axeCatalog");
        const payload = await fetchOnlineBrands();
        if (cancelled) return;
        // Mise à la forme que ce composant attendait déjà de WooCommerce, pour
        // que tout ce qui suit ignore d'où viennent les marques. `image` est
        // reprise TELLE QUELLE : c'est une URL complète, composée par le
        // serveur, jamais à préfixer.
        setAxeBrands(
          (payload.brands || []).map((brand) => ({
            id: brand.id,
            name: brand.name,
            image: brand.image,
            imageAlt: brand.name,
            count: brand.product_count,
          })),
        );
      } catch (error) {
        console.error("Erreur marques catalogue:", error);
        // Liste vide, donc carrousel absent : le repli d'un carrousel de logos
        // ne peut pas être des logos inventés.
        if (!cancelled) setAxeBrands([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const source = API_CONFIG.useAxeCatalog ? (axeBrands ?? []) : brands;
  // Le filtre est le point dur, et il ne bouge pas : au 20 août 2026, trois
  // marques sur 288 ont leur logo en ligne. Une marque sans logo n'a rien à
  // montrer ici — c'est un carrousel d'images, pas une liste de noms.
  const brandsWithImage = source
    .filter((b) => b.image && b.count > 0)
    .sort((a, b) => b.count - a.count);

  const stillLoading = API_CONFIG.useAxeCatalog ? axeBrands === null : loading;
  if (stillLoading || brandsWithImage.length === 0) return null;

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
        className="text-center text-[18px] uppercase tracking-[0.2em] mb-3 relative z-10"
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
                className="h-11 w-auto max-w-[150px] object-contain"
                style={{
                  filter:
                    "grayscale(20%) brightness(1) drop-shadow(0 3px 5px rgba(0,0,0,0.28))",
                  transition: "filter 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.filter =
                    "grayscale(0%) brightness(1.04) drop-shadow(0 4px 6px rgba(0,0,0,0.34))")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.filter =
                    "grayscale(20%) brightness(1) drop-shadow(0 3px 5px rgba(0,0,0,0.28))")
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
