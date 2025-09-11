// src/components/Search/SearchFilters.jsx
import { useState, useMemo } from "react";
import { ChevronDown, X, Filter } from "lucide-react";

const SearchFilters = ({
  categories = [],
  filters = {},
  onFiltersChange,
  onResetFilters,
  hasActiveFilters,
  simplified = false, // ✅ Nouveau prop pour le mode simplifié
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Configuration des options
  const priceRanges = [
    { value: "all", label: "Tous les prix" },
    { value: "0-50", label: "Moins de 50€" },
    { value: "50-100", label: "50€ - 100€" },
    { value: "100-300", label: "100€ - 300€" },
    { value: "300-500", label: "300€ - 500€" },
    { value: "500+", label: "Plus de 500€" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "name-asc", label: "Nom A-Z" },
    { value: "name-desc", label: "Nom Z-A" },
    { value: "date-desc", label: "Plus récents" },
  ];

  const availabilityOptions = [
    { value: "all", label: "Tous les produits" },
    { value: "in-stock", label: "En stock" },
    { value: "pre-order", label: "En précommande" },
  ];

  // Calcul des filtres actifs pour l'affichage
  const activeFilters = useMemo(() => {
    const active = [];

    if (filters.category) {
      const category = categories.find(
        (c) => String(c.id) === String(filters.category)
      );
      active.push({
        key: "category",
        label: category?.name || filters.category,
        value: filters.category,
      });
    }

    if (filters.priceRange && filters.priceRange !== "all") {
      const priceLabel = priceRanges.find(
        (p) => p.value === filters.priceRange
      )?.label;
      if (priceLabel) {
        active.push({
          key: "priceRange",
          label: priceLabel,
          value: filters.priceRange,
        });
      }
    }

    if (filters.availability && filters.availability !== "all") {
      const availabilityLabel = availabilityOptions.find(
        (a) => a.value === filters.availability
      )?.label;
      if (availabilityLabel) {
        active.push({
          key: "availability",
          label: availabilityLabel,
          value: filters.availability,
        });
      }
    }

    if (filters.sortBy && filters.sortBy !== "relevance") {
      const sortLabel = sortOptions.find(
        (s) => s.value === filters.sortBy
      )?.label;
      if (sortLabel) {
        active.push({
          key: "sortBy",
          label: `Tri: ${sortLabel}`,
          value: filters.sortBy,
        });
      }
    }

    return active;
  }, [filters, categories, priceRanges, sortOptions, availabilityOptions]);

  const updateFilter = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const removeFilter = (filterKey) => {
    const defaultValues = {
      category: "",
      priceRange: "all",
      availability: "all",
      sortBy: "relevance",
    };
    updateFilter(filterKey, defaultValues[filterKey]);
  };

  // ✅ Mode simplifié - dropdowns + badges intégrés
  if (simplified) {
    return (
      <div className="space-y-4">
        {/* Dropdowns */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tri */}
            <select
              value={filters.sortBy || "name-asc"}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="w-full p-3 bg-white border border-emerald-200 hover:border-emerald-300 focus:border-emerald-400 rounded-lg focus:ring-2 focus:ring-emerald-100 focus:outline-none text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Catégorie */}
            <select
              value={filters.category || ""}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="w-full p-3 bg-white border border-blue-200 hover:border-blue-300 focus:border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Prix */}
            <select
              value={filters.priceRange || "all"}
              onChange={(e) => updateFilter("priceRange", e.target.value)}
              className="w-full p-3 bg-white border border-amber-200 hover:border-amber-300 focus:border-amber-400 rounded-lg focus:ring-2 focus:ring-amber-100 focus:outline-none text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Disponibilité */}
            <select
              value={filters.availability || "all"}
              onChange={(e) => updateFilter("availability", e.target.value)}
              className="w-full p-3 bg-white border border-purple-200 hover:border-purple-300 focus:border-purple-400 rounded-lg focus:ring-2 focus:ring-purple-100 focus:outline-none text-sm font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Badges des filtres actifs */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Badge catégorie */}
            {filters.category && (
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200/50 shadow-sm">
                {categories?.find(
                  (c) => String(c.id) === String(filters.category)
                )?.name || filters.category}
                <button
                  onClick={() => updateFilter("category", "")}
                  className="p-0.5 rounded-full hover:bg-blue-200/60 transition-colors duration-200"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Badge prix */}
            {filters.priceRange && filters.priceRange !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200/50 shadow-sm">
                {(() => {
                  const shortPriceRanges = [
                    { value: "0-50", label: "< 50€" },
                    { value: "50-100", label: "50€-100€" },
                    { value: "100-300", label: "100€-300€" },
                    { value: "300-500", label: "300€-500€" },
                    { value: "500+", label: "> 500€" },
                  ];
                  return (
                    shortPriceRanges.find((p) => p.value === filters.priceRange)
                      ?.label || filters.priceRange
                  );
                })()}
                <button
                  onClick={() => updateFilter("priceRange", "all")}
                  className="p-0.5 rounded-full hover:bg-amber-200/60 transition-colors duration-200"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Badge disponibilité */}
            {filters.availability && filters.availability !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full border border-green-200/50 shadow-sm">
                {filters.availability === "in-stock"
                  ? "En stock"
                  : filters.availability === "pre-order"
                  ? "Précommande"
                  : filters.availability}
                <button
                  onClick={() => updateFilter("availability", "all")}
                  className="p-0.5 rounded-full hover:bg-green-200/60 transition-colors duration-200"
                >
                  <X size={10} />
                </button>
              </span>
            )}

            {/* Badge tri */}
            {filters.sortBy &&
              filters.sortBy !== "relevance" &&
              filters.sortBy !== "name-asc" && (
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 text-xs font-medium px-3 py-1.5 rounded-full border border-purple-200/50 shadow-sm">
                  Tri:{" "}
                  {(() => {
                    const shortSortOptions = [
                      { value: "price-asc", label: "Prix ↑" },
                      { value: "price-desc", label: "Prix ↓" },
                      { value: "name-desc", label: "Nom Z-A" },
                      { value: "date-desc", label: "Récents" },
                    ];
                    return (
                      shortSortOptions.find((s) => s.value === filters.sortBy)
                        ?.label || filters.sortBy
                    );
                  })()}
                  <button
                    onClick={() => updateFilter("sortBy", "name-asc")}
                    className="p-0.5 rounded-full hover:bg-purple-200/60 transition-colors duration-200"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}

            {/* Bouton tout effacer */}
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 transition-colors duration-200"
            >
              <X size={10} />
              Tout effacer
            </button>
          </div>
        )}
      </div>
    );
  }

  // ✅ Mode complet original (pour la modal de recherche)
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 border border-slate-200/60 rounded-xl shadow-lg shadow-slate-200/40">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100/40 to-transparent rounded-full blur-3xl -translate-y-16 translate-x-16 hidden sm:block"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-100/30 to-transparent rounded-full blur-2xl translate-y-8 -translate-x-8 hidden sm:block"></div>

      {/* Header */}
      <div
        className="relative flex items-center justify-between p-6 sm:p-5 cursor-pointer group transition-colors duration-200 hover:bg-slate-50/80 min-h-[80px] sm:min-h-[64px]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 sm:gap-3 flex-1">
          <div className="p-3 sm:p-2 rounded-xl sm:rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-sm group-hover:shadow-md transition-shadow duration-200">
            <Filter size={20} className="text-white sm:w-4 sm:h-4" />
          </div>
          <h3 className="text-xl sm:text-base font-bold sm:font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors duration-200">
            Filtres
          </h3>

          {hasActiveFilters && (
            <div className="flex items-center ml-3 sm:ml-2">
              <span className="inline-flex items-center justify-center min-w-[28px] sm:min-w-[20px] h-7 sm:h-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm sm:text-xs font-bold sm:font-medium px-3 sm:px-2 rounded-full shadow-sm">
                {activeFilters.length}
              </span>
            </div>
          )}

          {hasActiveFilters && (
            <div className="hidden sm:flex items-center gap-2 ml-4 flex-wrap">
              {activeFilters.slice(0, 3).map((filter) => (
                <span
                  key={filter.key}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200/50 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {filter.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFilter(filter.key);
                    }}
                    className="p-0.5 rounded-full hover:bg-indigo-200/60 transition-colors duration-200"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              {activeFilters.length > 3 && (
                <span className="text-xs text-slate-500 font-medium">
                  +{activeFilters.length - 3} autres
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 sm:gap-3">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onResetFilters();
              }}
              className="text-base sm:text-sm font-semibold sm:font-medium text-slate-600 hover:text-emerald-600 px-5 sm:px-3 py-3 sm:py-1.5 rounded-xl sm:rounded-lg bg-slate-100/60 hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-200 transition-colors duration-200 min-h-[48px] sm:min-h-[32px]"
            >
              Tout effacer
            </button>
          )}

          <ChevronDown
            size={20}
            className={`text-slate-400 transition-transform duration-300 group-hover:text-indigo-500 sm:w-4 sm:h-4 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Contenu des filtres */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded
            ? "max-h-[600px] sm:max-h-96 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-t border-slate-200/60 p-6 sm:p-5 bg-slate-50/40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
            {/* Tri */}
            <select
              value={filters.sortBy || "relevance"}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="w-full p-4 sm:p-3 bg-white border-2 sm:border border-emerald-200 hover:border-emerald-300 focus:border-emerald-400 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:outline-none text-base sm:text-sm font-semibold sm:font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[56px] sm:min-h-[40px] cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Catégorie */}
            <select
              value={filters.category || ""}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="w-full p-4 sm:p-3 bg-white border-2 sm:border border-blue-200 hover:border-blue-300 focus:border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-100 focus:outline-none text-base sm:text-sm font-semibold sm:font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[56px] sm:min-h-[40px] cursor-pointer"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Prix */}
            <select
              value={filters.priceRange || "all"}
              onChange={(e) => updateFilter("priceRange", e.target.value)}
              className="w-full p-4 sm:p-3 bg-white border-2 sm:border border-amber-200 hover:border-amber-300 focus:border-amber-400 rounded-xl focus:ring-2 focus:ring-amber-100 focus:outline-none text-base sm:text-sm font-semibold sm:font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[56px] sm:min-h-[40px] cursor-pointer"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* Disponibilité */}
            <select
              value={filters.availability || "all"}
              onChange={(e) => updateFilter("availability", e.target.value)}
              className="w-full p-4 sm:p-3 bg-white border-2 sm:border border-purple-200 hover:border-purple-300 focus:border-purple-400 rounded-xl focus:ring-2 focus:ring-purple-100 focus:outline-none text-base sm:text-sm font-semibold sm:font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[56px] sm:min-h-[40px] cursor-pointer"
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
