// src/components/categorie/CategoryGrid.jsx - Version optimisée minimale
import React, { useState, useEffect, useRef } from "react";
import {
  enrichCategoriesWithOptimizedImages,
  isMobileDevice,
} from "../../services/mediaService";

/**
 * Hook simple pour lazy loading avec IntersectionObserver
 */
const useLazyLoad = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const element = ref.current;
    if (!element || !("IntersectionObserver" in window)) {
      setIsVisible(true); // Fallback pour navigateurs sans support
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
};

/**
 * Composant d'image optimisée avec lazy loading (SANS CLIGNOTEMENT)
 */
const OptimizedImage = ({ optimizedImage, alt, className }) => {
  const [imgRef, isVisible] = useLazyLoad();
  const [loadingState, setLoadingState] = useState("idle"); // 'idle', 'loading', 'loaded', 'error'

  const {
    srcset = "",
    sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
    src = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    width = 400,
    height = 300,
  } = optimizedImage || {};

  // Commencer le chargement dès que visible
  useEffect(() => {
    if (isVisible && loadingState === "idle") {
      setLoadingState("loading");
    }
  }, [isVisible, loadingState]);

  const handleLoad = () => {
    setLoadingState("loaded");
  };

  const handleError = () => {
    setLoadingState("error");
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: "300px" }} // Éviter CLS
    >
      {/* Placeholder - visible jusqu'à ce que l'image soit chargée */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 transition-opacity duration-500 ${
          loadingState === "loaded"
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      >
        {/* Animation de chargement subtile */}
        {loadingState === "loading" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        )}
      </div>

      {/* Image optimisée - chargée dès que visible */}
      {loadingState !== "idle" && (
        <img
          src={src}
          srcSet={srcset}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-all duration-700 ${
            loadingState === "loaded"
              ? "opacity-100 group-hover:scale-110"
              : "opacity-0"
          }`}
          style={{ aspectRatio: `${width} / ${height}` }}
        />
      )}

      {/* Icône d'erreur - seulement si erreur */}
      {loadingState === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-400 text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Image indisponible</span>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryGrid = ({ categories, loading, className, onCategoryClick }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [enrichedCategories, setEnrichedCategories] = useState([]);
  const [isEnriching, setIsEnriching] = useState(false);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(enrichedCategories.length / itemsPerPage);
  const touchRef = useRef({ x: 0, y: 0 });
  const isMobile = isMobileDevice();

  // Enrichir les catégories avec images optimisées
  useEffect(() => {
    if (!categories.length || loading) {
      setEnrichedCategories([]);
      return;
    }

    const enrichCategories = async () => {
      setIsEnriching(true);
      try {
        const enriched = await enrichCategoriesWithOptimizedImages(categories);
        setEnrichedCategories(enriched);
      } catch (error) {
        console.error("Erreur enrichissement:", error);
        // Fallback: utiliser les catégories originales
        setEnrichedCategories(
          categories.map((cat) => ({
            ...cat,
            optimizedImage: {
              src:
                cat.image?.src ||
                "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
              width: 400,
              height: 300,
            },
          }))
        );
      } finally {
        setIsEnriching(false);
      }
    };

    enrichCategories();
  }, [categories, loading]);

  const getCurrentPageCategories = () => {
    const startIndex = currentPage * itemsPerPage;
    return enrichedCategories.slice(startIndex, startIndex + itemsPerPage);
  };

  useEffect(() => setCurrentPage(0), [enrichedCategories]);

  // Navigation
  const goToNextPage = () => setCurrentPage((p) => (p + 1) % totalPages);
  const goToPrevPage = () =>
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
  const goToPage = (i) => setCurrentPage(i);

  // Navigation clavier (seulement desktop)
  useEffect(() => {
    if (isMobile) return;

    const onKey = (e) => {
      if (e.key === "ArrowRight") goToNextPage();
      if (e.key === "ArrowLeft") goToPrevPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages, isMobile]);

  // Swipe mobile amélioré
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = Math.abs(t.clientY - touchRef.current.y);

    // Ignorer si mouvement vertical (scroll)
    if (dy > Math.abs(dx)) return;

    if (Math.abs(dx) > 50) {
      dx < 0 ? goToNextPage() : goToPrevPage();
    }
  };

  const CategorySkeleton = () => (
    <div
      className="group relative overflow-hidden rounded-2xl shadow-lg animate-pulse"
      style={{ minHeight: "320px" }}
    >
      <div className="h-80 bg-gray-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="h-6 bg-gray-400 rounded mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-2/3"></div>
      </div>
    </div>
  );

  const handleCategoryClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category.id);
    }
  };

  const CategoryCard = ({ category, isPriority = false }) => {
    const defaultImage =
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400";

    // Utiliser l'image optimisée si disponible, sinon l'image originale
    const imageToUse = category.optimizedImage || {
      src: category.image?.src || defaultImage,
      width: 400,
      height: 300,
    };

    const description = category.description
      ? category.description.replace(/<[^>]*>/g, "").substring(0, 100)
      : `Découvrez notre sélection ${category.name.toLowerCase()}`;

    return (
      <button
        onClick={() => handleCategoryClick(category)}
        className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 w-full text-left ${
          !isMobile ? "transform hover:-translate-y-2" : ""
        }`}
        style={{ minHeight: "320px" }}
      >
        <div className="relative h-80 overflow-hidden">
          <OptimizedImage
            optimizedImage={imageToUse}
            alt={category.name}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-300 transition-colors duration-300 backdrop-blur-sm bg-gradient-to-br from-black/50 via-black/30 to-black/10 px-4 py-2 rounded-md">
            {category.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">{description}</p>

          {category.count > 0 && (
            <div className="mt-2 inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-md font-medium">
                {category.count} produit{category.count > 1 ? "s" : ""}
              </span>
            </div>
          )}

          <div className="mt-3 flex items-center text-pink-300 group-hover:text-cyan-300 transition-colors duration-300">
            <span className="text-md font-medium mr-2">Explorer</span>
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                !isMobile ? "group-hover:translate-x-1" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </button>
    );
  };

  // États de chargement
  if (loading || isEnriching) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CategorySkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (!enrichedCategories.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📂</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Aucune catégorie disponible
        </h3>
        <p className="text-gray-500">
          Les catégories seront affichées une fois chargées depuis WooCommerce
        </p>
      </div>
    );
  }

  // Grille simple si <= 6 catégories
  if (enrichedCategories.length <= 6) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
        {enrichedCategories.map((c, index) => (
          <CategoryCard key={c.id} category={c} isPriority={index < 2} />
        ))}
      </div>
    );
  }

  // Grille avec navigation
  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Barre de navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {enrichedCategories.length} catégorie
          {enrichedCategories.length > 1 ? "s" : ""} •{" "}
          <span className="tabular-nums">
            {currentPage + 1}/{totalPages}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={goToPrevPage}
            aria-label="Page précédente"
            className="h-9 w-9 rounded-full bg-white/60 hover:bg-white/80 border border-black/5 backdrop-blur shadow-sm transition"
          >
            <svg
              className="mx-auto h-4 w-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                aria-label={`Aller à la page ${i + 1}`}
                onClick={() => goToPage(i)}
                className={[
                  "h-1.5 w-1.5 rounded-full transition",
                  i === currentPage
                    ? "w-5 bg-gradient-to-r from-fuchsia-500 to-sky-400"
                    : "bg-gray-300 hover:bg-gray-400",
                ].join(" ")}
              />
            ))}
          </div>

          <button
            onClick={goToNextPage}
            aria-label="Page suivante"
            className="h-9 w-9 rounded-full bg-white/60 hover:bg-white/80 border border-black/5 backdrop-blur shadow-sm transition"
          >
            <svg
              className="mx-auto h-4 w-4 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {getCurrentPageCategories().map((c, index) => (
          <CategoryCard
            key={c.id}
            category={c}
            isPriority={currentPage === 0 && index < 2}
          />
        ))}
      </div>

      {/* Navigation mobile */}
      <div className="md:hidden flex items-center justify-center gap-3 mt-8">
        <button
          onClick={goToPrevPage}
          className="h-10 w-10 rounded-full bg-white/70 border border-black/5 backdrop-blur shadow-sm"
          aria-label="Page précédente"
        >
          <svg
            className="mx-auto h-4 w-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <span className="text-sm text-gray-600 tabular-nums">
          {currentPage + 1}/{totalPages}
        </span>

        <button
          onClick={goToNextPage}
          className="h-10 w-10 rounded-full bg-white/70 border border-black/5 backdrop-blur shadow-sm"
          aria-label="Page suivante"
        >
          <svg
            className="mx-auto h-4 w-4 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CategoryGrid;
