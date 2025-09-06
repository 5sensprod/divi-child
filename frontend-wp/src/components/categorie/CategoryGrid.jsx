// src/components/categorie/CategoryGrid.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const CategoryGrid = ({ categories = [], loading = false, className = "" }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Obtenir les catégories pour la page actuelle
  const getCurrentPageCategories = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return categories.slice(startIndex, endIndex);
  };

  // Réinitialiser à la première page quand les catégories changent
  useEffect(() => {
    setCurrentPage(0);
  }, [categories]);

  // Navigation du carousel
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  // Composant de chargement pour les catégories
  const CategorySkeleton = () => (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg animate-pulse">
      <div className="h-80 bg-gray-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="h-6 bg-gray-400 rounded mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-2/3"></div>
      </div>
    </div>
  );

  // Composant d'une catégorie individuelle (EXACTEMENT comme l'original)
  const CategoryCard = ({ category }) => {
    // Image par défaut si pas d'image de catégorie
    const defaultImage =
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400";

    // Utiliser l'image de la catégorie ou l'image par défaut
    const imageUrl = category.image?.src || defaultImage;

    // Description avec fallback
    const description = category.description
      ? category.description.replace(/<[^>]*>/g, "") // Supprimer les balises HTML
      : `Découvrez notre sélection ${category.name.toLowerCase()}`;

    return (
      <Link
        to={`/categorie-produit/${category.slug}`}
        className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
      >
        {/* Image avec overlay gradient */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={imageUrl}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = defaultImage; // Image de fallback en cas d'erreur
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Contenu */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-pink-300 transition-colors duration-300">
            {category.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">{description}</p>

          {/* Badge du nombre de produits */}
          {category.count > 0 && (
            <div className="mt-2 inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs font-medium">
                {category.count} produit{category.count > 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Flèche animée */}
          <div className="mt-3 flex items-center text-pink-300 group-hover:text-cyan-300 transition-colors duration-300">
            <span className="text-sm font-medium mr-2">Explorer</span>
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

  // Si pas de catégories et pas en chargement
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

  // Si en chargement, utiliser l'affichage original
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <CategorySkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // Affichage avec carousel SEULEMENT si plus de 6 catégories
  if (categories.length <= 6) {
    // Affichage simple (original) si 6 catégories ou moins
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    );
  }

  // Affichage avec carousel si plus de 6 catégories
  return (
    <div className={className}>
      {/* En-tête avec compteur et navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">
          <span className="font-medium">
            {categories.length} catégorie{categories.length > 1 ? "s" : ""} au
            total
          </span>
          <span className="text-sm ml-2">
            • Page {currentPage + 1} sur {totalPages}
          </span>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Page précédente"
          >
            <svg
              className="w-5 h-5"
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

          {/* Indicateurs de pages */}
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentPage
                    ? "bg-blue-500 scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Aller à la page ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNextPage}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Page suivante"
          >
            <svg
              className="w-5 h-5"
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

      {/* Grille des catégories (exactement comme l'original) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {getCurrentPageCategories().map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      {/* Navigation mobile */}
      <div className="flex justify-center mt-8 md:hidden">
        <div className="flex items-center gap-4 bg-white rounded-full shadow-lg px-6 py-3">
          <button
            onClick={goToPrevPage}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <svg
              className="w-4 h-4"
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
            <span className="text-sm font-medium">Précédent</span>
          </button>

          <span className="text-sm text-gray-500 px-3">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={goToNextPage}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <span className="text-sm font-medium">Suivant</span>
            <svg
              className="w-4 h-4"
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
    </div>
  );
};

export default CategoryGrid;
