// src/components/categorie/CategoryGrid.jsx

import React from "react";
import { Link } from "react-router-dom";

const CategoryGrid = ({ categories = [], loading = false, className = "" }) => {
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

  // Composant d'une catégorie individuelle
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

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {loading
        ? // Afficher les skeletons pendant le chargement
          Array.from({ length: 6 }).map((_, index) => (
            <CategorySkeleton key={`skeleton-${index}`} />
          ))
        : // Afficher les vraies catégories
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
    </div>
  );
};

export default CategoryGrid;
