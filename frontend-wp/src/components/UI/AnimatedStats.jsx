// src/components/UI/AnimatedStats.jsx
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const endRef = useRef(end);

  useEffect(() => {
    endRef.current = end;
  }, [end]);

  const startAnimation = () => {
    if (hasAnimated.current) return;
    const endValue =
      parseInt(endRef.current?.toString().replace(/\D/g, "")) || 0;
    if (!endValue) return;
    hasAnimated.current = true;
    const startTime = Date.now();
    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(endValue * easeOutCubic));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(endValue);
    };
    requestAnimationFrame(animate);
  };

  return [count, startAnimation];
};

const AnimatedNumber = ({
  value,
  suffix = "",
  isVisible,
  delay = 0,
  primary,
}) => {
  const [count, startAnimation] = useCountUp(value, 2000);
  const started = useRef(false);

  useEffect(() => {
    if (isVisible && !started.current && value > 0) {
      started.current = true;
      setTimeout(() => startAnimation(), delay);
    }
  }, [isVisible, value]);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(0) + "k";
    return num.toString();
  };

  return (
    <span
      style={{
        fontFamily: "'Epilogue', sans-serif",
        fontSize: "2.25rem",
        fontWeight: 900,
        lineHeight: 1,
        color: primary,
        display: "inline-block",
        transition: "color 0.8s ease",
      }}
    >
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

const AnimatedStats = ({ products = [], categories = [] }) => {
  const [ref, isVisible] = useIntersectionObserver(0.1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalBrands, setTotalBrands] = useState(0);

  const { getThemeColors, getThemeBackground, theme } = useTheme();
  const colors = getThemeColors(theme);
  const bg = getThemeBackground(theme);

  const primary = colors?.primary ?? "#ffac54";
  const secondary = colors?.secondary ?? "#fdd400";
  const bg0 = bg?.bg0 ?? "#0e0e0e";
  const bg55 = bg?.bg55 ?? "#1a1a1a";
  const bg100 = bg?.bg100 ?? "#2a2a2a";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { getTotalProductsCount, getBrands } =
          await import("../../services/woocommerce");
        const [total, brands] = await Promise.all([
          getTotalProductsCount(),
          getBrands(),
        ]);
        setTotalProducts(total);
        setTotalBrands(brands.length);
      } catch (error) {
        console.error("Erreur stats:", error);
        setTotalProducts(products.length || 1000);
        setTotalBrands(50);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
      value: totalProducts,
      suffix: "+",
      label: "Produits",
      description:
        "Une sélection rigoureuse des meilleurs équipements musicaux.",
      delay: 0,
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
      value: totalBrands,
      suffix: "+",
      label: "Marques partenaires",
      description:
        "Des partenariats directs avec les fabricants les plus prestigieux.",
      delay: 200,
    },
    {
      icon: (
        <svg
          className="w-7 h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      value: 26,
      suffix: "+",
      label: "Années d'existence",
      description:
        "Une expertise construite au fil des décennies au service des musiciens.",
      delay: 400,
    },
  ];

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: bg0, transition: "background-color 0.8s ease" }}
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/ComfyUI_00291_-gigapixel-art-scale-4_00x-min_1.webp"
          alt=""
          className="w-full h-full object-cover grayscale opacity-15 scale-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${bg0}, ${bg55}cc, ${bg0})`,
            transition: "background 0.8s ease",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${bg0}, transparent, ${bg0})`,
            transition: "background 0.8s ease",
          }}
        />
      </div>

      {/* Glows */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full -mr-48 -mb-48 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${primary}15 0%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full -ml-36 -mt-36 pointer-events-none z-0"
        style={{
          background: `radial-gradient(circle, ${secondary}10 0%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Contenu */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="flex flex-col lg:flex-row gap-10 lg:items-center">
          {/* Header gauche */}
          <div className="lg:w-1/3 space-y-4">
            <h2
              className="font-black text-white leading-tight"
              style={{
                fontFamily: "'Epilogue', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              LES CHIFFRES <br />
              DERRIÈRE LE <br />
              <span
                style={{
                  color: primary,
                  display: "inline-block",
                  transition: "color 0.8s ease",
                }}
              >
                SON.
              </span>
            </h2>
            <p
              className="font-light max-w-sm text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Créer l'univers sonore des professionnels et des amateurs
              passionnés depuis plus de deux décennies.
            </p>
          </div>

          {/* Stats grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl flex gap-4"
                style={{
                  background: `${bg100}99`,
                  backdropFilter: "blur(20px)",
                  border: `1px solid ${primary}15`,
                  opacity: isVisible ? 1 : 0,
                  translate: isVisible ? "none" : "0 20px",
                  transition: `opacity 0.6s ease ${stat.delay}ms, translate 0.6s ease ${stat.delay}ms, border-color 0.3s ease, background 0.8s ease`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${primary}50`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${primary}15`;
                }}
              >
                {/* Icône */}
                <div
                  className="shrink-0"
                  style={{
                    color: secondary,
                    opacity: 0.9,
                    transition: "color 0.8s ease",
                  }}
                >
                  {stat.icon}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Chiffre */}
                  <AnimatedNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    isVisible={isVisible}
                    delay={stat.delay}
                    primary={primary}
                  />

                  {/* Label — blanc pur */}
                  <div className="text-white font-bold uppercase tracking-tighter text-xs mt-1 mb-2">
                    {stat.label}
                  </div>

                  {/* Barre hover */}
                  <div
                    className="h-px mb-3 transition-all duration-500"
                    style={{
                      width: "0px",
                      background: `linear-gradient(to right, ${primary}, ${secondary})`,
                    }}
                    ref={(el) => {
                      if (el) {
                        const parent = el.closest(".group");
                        if (parent) {
                          parent.addEventListener("mouseenter", () => {
                            el.style.width = "48px";
                          });
                          parent.addEventListener("mouseleave", () => {
                            el.style.width = "0px";
                          });
                        }
                      }
                    }}
                  />

                  {/* Description — bien contrastée */}
                  <p
                    className="text-[10px] leading-relaxed uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.60)" }}
                  >
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;700;800;900&display=swap');
      `}</style>
    </section>
  );
};

export default AnimatedStats;
