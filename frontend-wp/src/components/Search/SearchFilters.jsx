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

  const [expandedSections, setExpandedSections] = useState(
    new Set(["category"])
  );

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

  const toggleSection = (section) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(section)) {
        newSet.delete(section);
      } else {
        newSet.add(section);
      }
      return newSet;
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.category !== "" ||
      filters.priceRange !== "all" ||
      filters.availability !== "all" ||
      filters.sortBy !== "relevance"
    );
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 lg:px-6 py-4">
        {/* Header des filtres */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <h3 className="font-medium text-gray-800">Filtres</h3>
            {hasActiveFilters() && (
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                Actifs
              </span>
            )}
          </div>

          {hasActiveFilters() && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <X size={14} />
              Réinitialiser
            </button>
          )}
        </div>

        {/* Grid des filtres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tri */}
          <FilterSection
            title="Trier par"
            isExpanded={expandedSections.has("sort")}
            onToggle={() => toggleSection("sort")}
          >
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Catégories - CORRECTION ICI */}
          <FilterSection
            title="Catégorie"
            isExpanded={expandedSections.has("category")}
            onToggle={() => toggleSection("category")}
          >
            <select
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Prix */}
          <FilterSection
            title="Prix"
            isExpanded={expandedSections.has("price")}
            onToggle={() => toggleSection("price")}
          >
            <select
              value={filters.priceRange}
              onChange={(e) => updateFilter("priceRange", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </FilterSection>

          {/* Disponibilité */}
          <FilterSection
            title="Disponibilité"
            isExpanded={expandedSections.has("availability")}
            onToggle={() => toggleSection("availability")}
          >
            <select
              value={filters.availability}
              onChange={(e) => updateFilter("availability", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FilterSection>
        </div>
      </div>
    </div>
  );
};

// Composant pour une section de filtre
const FilterSection = ({ title, children, isExpanded, onToggle }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-700">{title}</span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
