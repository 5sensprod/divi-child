// Hook personnalisé pour détecter la visibilité
import { useState, useEffect, useRef } from "react";

const useIntersectionObserver = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Ne déclencher qu'une fois
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// Hook pour animer les nombres
const useCountUp = (end, duration = 2000, start = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const startTime = Date.now();
    const startValue = start;
    const endValue = parseInt(end.toString().replace(/\D/g, "")) || end;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Fonction d'easing pour un effet plus naturel
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easeOutCubic
      );

      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return [count, startAnimation];
};

// Composant AnimatedNumber
const AnimatedNumber = ({ value, suffix = "", isVisible }) => {
  const [count, startAnimation] = useCountUp(value, 2000);

  useEffect(() => {
    if (isVisible) {
      startAnimation();
    }
  }, [isVisible, startAnimation]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "k";
    }
    return num.toString();
  };

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

// Composant principal AnimatedStats
const AnimatedStats = ({ products = [], categories = [] }) => {
  const [ref, isVisible] = useIntersectionObserver(0.3);
  const [totalProducts, setTotalProducts] = useState(products.length || 0);
  const [totalBrands, setTotalBrands] = useState(50);

  // Récupérer le nombre total de produits et marques via API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Import dynamique pour éviter les problèmes de dépendances
        const { getProducts } = await import("../../services/woocommerce");

        // Récupérer tous les produits pour avoir le total exact
        const allProducts = await getProducts({ per_page: 100 });
        setTotalProducts(allProducts.length);

        // Extraire les marques uniques depuis les produits
        const brands = new Set();
        allProducts.forEach((product) => {
          // Vérifier différents champs possibles pour la marque
          if (product.brands && product.brands.length > 0) {
            product.brands.forEach((brand) => brands.add(brand.name));
          }
          // Ou si la marque est dans les attributs
          if (product.attributes) {
            const brandAttribute = product.attributes.find(
              (attr) =>
                attr.name.toLowerCase().includes("marque") ||
                attr.name.toLowerCase().includes("brand")
            );
            if (brandAttribute && brandAttribute.options) {
              brandAttribute.options.forEach((option) => brands.add(option));
            }
          }
          // Ou si la marque est dans les meta_data
          if (product.meta_data) {
            const brandMeta = product.meta_data.find(
              (meta) =>
                meta.key.toLowerCase().includes("brand") ||
                meta.key.toLowerCase().includes("marque")
            );
            if (brandMeta && brandMeta.value) {
              brands.add(brandMeta.value);
            }
          }
        });

        setTotalBrands(brands.size || 50); // Fallback à 50 si aucune marque trouvée
        console.log("Stats calculées:", {
          totalProducts: allProducts.length,
          totalBrands: brands.size,
        });
      } catch (error) {
        console.error("Erreur lors du calcul des stats:", error);
        // Utiliser les valeurs par défaut en cas d'erreur
        setTotalProducts(products.length || 1000);
        setTotalBrands(50);
      }
    };

    fetchStats();
  }, [products]);

  const stats = [
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
          />
        </svg>
      ),
      value: totalProducts,
      suffix: totalProducts < 100 ? "" : "+",
      label: "Instruments disponibles",
      gradient: "from-pink-500 to-pink-600",
      delay: 0,
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
      value: totalBrands,
      suffix: "+",
      label: "Marques partenaires",
      gradient: "from-purple-500 to-purple-600",
      delay: 200,
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      value: 10000,
      suffix: "+",
      label: "Clients satisfaits",
      gradient: "from-cyan-500 to-cyan-600",
      delay: 400,
    },
  ];

  return (
    <>
      <div className="container-divi">
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group"
              style={{
                animationDelay: isVisible ? `${stat.delay}ms` : "0ms",
              }}
            >
              <div
                className={`bg-gradient-to-br ${
                  stat.gradient
                } text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-all duration-500 ${
                  isVisible
                    ? "animate-bounce-in opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  animationDelay: isVisible ? `${stat.delay}ms` : "0ms",
                }}
              >
                {stat.icon}
              </div>

              <h3
                className={`text-3xl font-bold text-gray-800 mb-2 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  animationDelay: isVisible ? `${stat.delay + 100}ms` : "0ms",
                }}
              >
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </h3>

              <p
                className={`text-gray-600 transition-all duration-700 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  animationDelay: isVisible ? `${stat.delay + 200}ms` : "0ms",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3) translateY(20px);
            opacity: 0;
          }
          50% {
            transform: scale(1.05) translateY(-5px);
          }
          70% {
            transform: scale(0.9) translateY(0px);
          }
          100% {
            transform: scale(1) translateY(0px);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)
            forwards;
        }
      `}</style>
    </>
  );
};

export default AnimatedStats;
