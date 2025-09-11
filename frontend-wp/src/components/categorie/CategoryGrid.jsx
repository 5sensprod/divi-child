// src/components/categorie/CategoryGrid.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const CategoryGrid = ({ categories = [], loading = false, className = "" }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const touchRef = useRef({ x: 0, y: 0 });

  const getCurrentPageCategories = () => {
    const startIndex = currentPage * itemsPerPage;
    return categories.slice(startIndex, startIndex + itemsPerPage);
  };

  useEffect(() => setCurrentPage(0), [categories]);

  // Précharge images
  useEffect(() => {
    if (!categories.length) return;
    const fallback =
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400";
    categories.forEach((c) => {
      const img = new Image();
      img.src = c.image?.src || fallback;
    });
  }, [categories]);

  // Navigation
  const goToNextPage = () => setCurrentPage((p) => (p + 1) % totalPages);
  const goToPrevPage = () =>
    setCurrentPage((p) => (p - 1 + totalPages) % totalPages);
  const goToPage = (i) => setCurrentPage(i);

  // Navigation au clavier (flèches)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") goToNextPage();
      if (e.key === "ArrowLeft") goToPrevPage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [totalPages]);

  // Swipe mobile léger
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.x;
    if (Math.abs(dx) > 40) dx < 0 ? goToNextPage() : goToPrevPage();
  };

  const CategorySkeleton = () => (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg animate-pulse">
      <div className="h-80 bg-gray-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="h-6 bg-gray-400 rounded mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-2/3"></div>
      </div>
    </div>
  );

  const CategoryCard = ({ category }) => {
    const defaultImage =
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400";
    const imageUrl = category.image?.src || defaultImage;
    const description = category.description
      ? category.description.replace(/<[^>]*>/g, "")
      : `Découvrez notre sélection ${category.name.toLowerCase()}`;

    return (
      <Link
        to={`/categorie-produit/${category.slug}`}
        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      >
        <div className="relative h-80 overflow-hidden">
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => (e.currentTarget.src = defaultImage)}
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
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
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
      </Link>
    );
  };

  if (!loading && categories.length === 0) {
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

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <CategorySkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  // ——— Grille simple si <= 6 ———
  if (categories.length <= 6) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    );
  }

  // ——— Grille + navigation minimaliste ———
  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Barre supérieure minimaliste */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {categories.length} catégorie{categories.length > 1 ? "s" : ""} •{" "}
          <span className="tabular-nums">
            {currentPage + 1}/{totalPages}
          </span>
        </div>

        {/* NAV compact : boutons fantômes + points discrets */}
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
        {getCurrentPageCategories().map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>

      {/* Nav mobile ultra sobre */}
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
