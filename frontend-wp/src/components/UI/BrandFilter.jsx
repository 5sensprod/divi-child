// src/components/UI/BrandFilter.jsx
import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";

// Fonction pour décoder les entités HTML
const decodeHTMLEntities = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

const BrandFilter = ({
  brands = [],
  selectedBrands = [],
  onChange,
  className = "",
  maxVisible = 8,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtrer les marques selon la recherche
  const filteredBrands = useMemo(() => {
    if (!searchTerm.trim()) return brands;

    return brands.filter((brand) =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [brands, searchTerm]);

  // Limiter l'affichage si showAll est false
  const displayedBrands = useMemo(() => {
    if (showAll || searchTerm.trim()) return filteredBrands;
    return filteredBrands.slice(0, maxVisible);
  }, [filteredBrands, showAll, searchTerm, maxVisible]);

  // Gérer la sélection d'une marque
  const handleBrandToggle = (brandSlug) => {
    const newSelection = selectedBrands.includes(brandSlug)
      ? selectedBrands.filter((slug) => slug !== brandSlug)
      : [...selectedBrands, brandSlug];

    onChange(newSelection);
  };

  // Réinitialiser tous les filtres
  const handleReset = () => {
    onChange([]);
    setSearchTerm("");
  };

  const hasSelection = selectedBrands.length > 0;
  const hasMoreBrands = brands.length > maxVisible;

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      {/* Header cliquable sur mobile */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 lg:cursor-default"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">Marques</h3>
          {hasSelection && (
            <span className="lg:hidden text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full font-medium">
              {selectedBrands.length}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasSelection && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              className="hidden lg:flex text-sm text-pink-600 hover:text-pink-700 font-medium items-center gap-1"
            >
              <X size={16} />
              Effacer
            </button>
          )}
          {/* Icône chevron visible uniquement sur mobile */}
          <svg
            className={`lg:hidden w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? "rotate-180" : ""
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
      </button>

      {/* Contenu - Toujours visible sur desktop, conditionnel sur mobile */}
      <div className={`${isExpanded ? "block" : "hidden"} lg:block px-6 pb-6`}>
        {/* Barre de recherche */}
        {brands.length > 5 && (
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher une marque..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Bouton effacer visible sur mobile */}
        {hasSelection && (
          <button
            onClick={handleReset}
            className="lg:hidden w-full mb-3 text-sm text-pink-600 hover:text-pink-700 font-medium flex items-center justify-center gap-1 py-2 border border-pink-200 rounded-lg"
          >
            <X size={16} />
            Effacer la sélection
          </button>
        )}

        {/* Compteur de sélection */}
        {hasSelection && (
          <div className="mb-3 text-sm text-pink-600 font-medium">
            {selectedBrands.length} marque{selectedBrands.length > 1 ? "s" : ""}{" "}
            sélectionnée{selectedBrands.length > 1 ? "s" : ""}
          </div>
        )}

        {/* Liste des marques */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {displayedBrands.length > 0 ? (
            displayedBrands.map((brand) => {
              const isSelected = selectedBrands.includes(brand.slug);

              return (
                <label
                  key={brand.slug}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-pink-50 border border-pink-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleBrandToggle(brand.slug)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                  />
                  <div className="flex-1 flex items-center justify-between">
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "font-medium text-pink-900"
                          : "text-gray-700"
                      }`}
                    >
                      {decodeHTMLEntities(brand.name)}
                    </span>
                    {brand.count > 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-pink-200 text-pink-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {brand.count}
                      </span>
                    )}
                  </div>
                </label>
              );
            })
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">
              {searchTerm
                ? "Aucune marque trouvée"
                : "Aucune marque disponible"}
            </div>
          )}
        </div>

        {/* Bouton "Voir plus" */}
        {hasMoreBrands && !searchTerm && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full mt-4 text-sm text-pink-600 hover:text-pink-700 font-medium py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showAll
              ? "Voir moins"
              : `Voir toutes les marques (${brands.length})`}
          </button>
        )}

        {/* Marques populaires (optionnel) */}
        {!hasSelection && !searchTerm && brands.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Marques populaires</p>
            <div className="flex flex-wrap gap-2">
              {brands
                .sort((a, b) => (b.count || 0) - (a.count || 0))
                .slice(0, 4)
                .map((brand) => (
                  <button
                    key={brand.slug}
                    onClick={() => handleBrandToggle(brand.slug)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-pink-100 hover:text-pink-700 transition-colors"
                  >
                    {decodeHTMLEntities(brand.name)}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandFilter;
