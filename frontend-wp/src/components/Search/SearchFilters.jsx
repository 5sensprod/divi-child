// src/components/Search/SearchFilters.jsx
import { useState } from "react";
import { ChevronDown, X, Filter } from "lucide-react";

const SearchFilters = ({
  categories = [],
  onFiltersChange,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    priceRange: initialFilters.priceRange || "all",
    availability: initialFilters.availability || "all",
    sortBy: initialFilters.sortBy || "relevance",
    ...initialFilters,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Prix prédéfinis
  const priceRanges = [
    { value: "all", label: "Tous les prix" },
    { value: "0-50", label: "Moins de 50€" },
    { value: "50-100", label: "50€ - 100€" },
    { value: "100-300", label: "100€ - 300€" },
    { value: "300-500", label: "300€ - 500€" },
    { value: "500+", label: "Plus de 500€" },
  ];

  // Options de tri
  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "price-asc", label: "Prix croissant" },
    { value: "price-desc", label: "Prix décroissant" },
    { value: "name-asc", label: "Nom A-Z" },
    { value: "date-desc", label: "Plus récents" },
  ];

  // Disponibilité
  const availabilityOptions = [
    { value: "all", label: "Tous les produits" },
    { value: "in-stock", label: "En stock" },
    { value: "pre-order", label: "En précommande" },
  ];

  const updateFilter = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      category: "",
      priceRange: "all",
      availability: "all",
      sortBy: "relevance",
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const getActiveFilters = () => {
    const activeFilters = [];

    if (filters.category && filters.category !== "") {
      const category = categories.find(
        (c) => String(c.id) === String(filters.category)
      );
      const categoryName = category ? category.name : filters.category;
      activeFilters.push({
        key: "category",
        label: categoryName,
        value: filters.category,
      });
    }

    if (filters.priceRange && filters.priceRange !== "all") {
      const priceLabel = priceRanges.find(
        (p) => p.value === filters.priceRange
      )?.label;
      if (priceLabel) {
        activeFilters.push({
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
        activeFilters.push({
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
        activeFilters.push({
          key: "sortBy",
          label: `Tri: ${sortLabel}`,
          value: filters.sortBy,
        });
      }
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();
  const hasActiveFilters = activeFilters.length > 0;

  const removeFilter = (filterKey) => {
    const defaultValues = {
      category: "",
      priceRange: "all",
      availability: "all",
      sortBy: "relevance",
    };
    updateFilter(filterKey, defaultValues[filterKey]);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header des filtres */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2 flex-1">
          <Filter size={18} className="text-gray-600" />
          <h3 className="font-medium text-gray-800">Filtres</h3>

          {/* Affichage des filtres actifs à droite du titre */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 ml-4 flex-wrap">
              {activeFilters.map((filter) => (
                <span
                  key={filter.key}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {filter.label}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFilter(filter.key);
                    }}
                    className="hover:text-blue-900"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetFilters();
              }}
              className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
            >
              Tout effacer
            </button>
          )}

          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Contenu des filtres */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tri */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Trier par
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prix */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prix</label>
              <select
                value={filters.priceRange}
                onChange={(e) => updateFilter("priceRange", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Disponibilité */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Disponibilité
              </label>
              <select
                value={filters.availability}
                onChange={(e) => updateFilter("availability", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-sm"
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
      )}
    </div>
  );
};

export default SearchFilters;
