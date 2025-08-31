// src/components/categorie/CategoryAccordion.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";

const CategoryAccordion = ({
  categories = [],
  loading = false,
  className = "",
}) => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Composant de chargement
  const AccordionSkeleton = () => (
    <div className="animate-pulse">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="mb-4">
          <div className="h-16 bg-gray-300 rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  // Composant d'un élément d'accordéon
  const AccordionItem = ({ category, isActive, onClick }) => {
    const defaultImage =
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400";
    const imageUrl = category.image?.src || defaultImage;
    const description = category.description
      ? category.description.replace(/<[^>]*>/g, "").substring(0, 150) + "..."
      : `Découvrez notre sélection ${category.name.toLowerCase()}`;

    return (
      <div className="group mb-4 last:mb-0">
        {/* Titre cliquable */}
        <button
          onClick={onClick}
          className={`
            w-full h-16 relative overflow-hidden rounded-lg transition-all duration-500 ease-out
            ${
              isActive
                ? "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-lg shadow-purple-500/25"
                : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-pink-500/20 hover:to-cyan-500/20"
            }
          `}
        >
          {/* Image de fond subtile */}
          <div className="absolute inset-0 opacity-10">
            <img
              src={imageUrl}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenu du titre */}
          <div className="relative z-10 flex items-center justify-between px-6 h-full">
            {/* Desktop: Titre vertical à 90° */}
            <div className="hidden lg:block">
              <h3 className="text-white font-bold text-lg transform -rotate-90 whitespace-nowrap origin-center">
                {category.name}
              </h3>
            </div>

            {/* Mobile/Tablet: Titre horizontal */}
            <div className="lg:hidden flex-1 text-left">
              <h3 className="text-white font-bold text-lg">{category.name}</h3>
              {category.count > 0 && (
                <span className="text-white/70 text-sm">
                  {category.count} produit{category.count > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Badge du nombre de produits (desktop uniquement) */}
            <div className="hidden lg:block">
              {category.count > 0 && (
                <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-medium">
                  {category.count}
                </span>
              )}
            </div>

            {/* Icône d'expansion */}
            <div className="ml-4">
              <svg
                className={`w-6 h-6 text-white transition-transform duration-300 ${
                  isActive ? "lg:rotate-90 rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </button>

        {/* Contenu expandable */}
        <div
          className={`
          overflow-hidden transition-all duration-500 ease-out
          ${isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          {/* Desktop: Expansion vers la droite */}
          <div className="hidden lg:block">
            <div
              className={`
              transform transition-all duration-500 ease-out
              ${isActive ? "translate-x-0" : "-translate-x-full"}
            `}
            >
              <div className="ml-8 mt-4 p-6 bg-white rounded-lg shadow-lg border border-gray-100">
                <div className="flex gap-6">
                  {/* Image de la catégorie */}
                  <div className="flex-shrink-0">
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = defaultImage;
                      }}
                    />
                  </div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {description}
                    </p>

                    <div className="flex gap-3">
                      <Link
                        to={`/categorie-produit/${category.slug}`}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <span>Explorer</span>
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
                      </Link>

                      {category.count > 0 && (
                        <span className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-full">
                          {category.count} produit
                          {category.count > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet: Expansion vers le bas */}
          <div className="lg:hidden">
            <div className="mt-4 p-6 bg-white rounded-lg shadow-lg border border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Image de la catégorie */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={imageUrl}
                    alt={category.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = defaultImage;
                    }}
                  />
                </div>

                {/* Contenu */}
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    {category.name}
                  </h4>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                    <Link
                      to={`/categorie-produit/${category.slug}`}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-sm font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <span>Explorer</span>
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
                    </Link>

                    {category.count > 0 && (
                      <span className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {category.count} produit{category.count > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // État de chargement
  if (loading) {
    return (
      <div className={className}>
        <AccordionSkeleton />
      </div>
    );
  }

  // Aucune catégorie
  if (categories.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
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
    <div className={`space-y-4 ${className}`}>
      {categories.map((category) => (
        <AccordionItem
          key={category.id}
          category={category}
          isActive={activeCategory === category.id}
          onClick={() =>
            setActiveCategory(
              activeCategory === category.id ? null : category.id
            )
          }
        />
      ))}
    </div>
  );
};

export default CategoryAccordion;
