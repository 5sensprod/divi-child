// src/components/Search/SearchFilters.jsx
import { useMemo, useState, useRef, useEffect } from "react";
import { X, SlidersHorizontal, ChevronDown, ChevronRight } from "lucide-react";

// Dropdown custom catégorie avec accordion
const CategoryDropdown = ({ categories, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedParents, setExpandedParents] = useState(new Set());
  const ref = useRef(null);

  const parents = categories.filter((c) => !c.parent || c.parent === 0);
  const children = categories.filter((c) => c.parent && c.parent !== 0);

  const selectedCat = categories.find((c) => String(c.id) === String(value));

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleParent = (id) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const select = (id) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 border text-sm px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
          value
            ? "bg-gray-800 border-gray-700 text-white"
            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
        }`}
      >
        <span>{selectedCat ? selectedCat.name : "Toutes catégories"}</span>
        <ChevronDown
          size={12}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden animate-slide-down">
          {/* Option "Toutes" */}
          <button
            onClick={() => select("")}
            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
              !value
                ? "bg-gray-50 text-gray-900 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            Toutes les catégories
          </button>

          <div className="border-t border-gray-100 max-h-64 overflow-y-auto">
            {parents.map((parent) => {
              const kids = children.filter((c) => c.parent === parent.id);
              const isExpanded = expandedParents.has(parent.id);
              const isSelected = String(value) === String(parent.id);

              return (
                <div key={parent.id}>
                  {/* Parent */}
                  <div className="flex items-center">
                    <button
                      onClick={() => select(parent.id)}
                      className={`flex-1 text-left px-3 py-2 text-sm transition-colors ${
                        isSelected
                          ? "bg-pink-50 text-pink-600 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {parent.name}
                    </button>
                    {kids.length > 0 && (
                      <button
                        onClick={() => toggleParent(parent.id)}
                        className="px-2 py-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <ChevronRight
                          size={12}
                          className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Enfants */}
                  {kids.length > 0 && isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      {kids.map((child) => {
                        const isChildSelected =
                          String(value) === String(child.id);
                        return (
                          <button
                            key={child.id}
                            onClick={() => select(child.id)}
                            className={`w-full text-left pl-6 pr-3 py-1.5 text-xs transition-colors ${
                              isChildSelected
                                ? "bg-pink-50 text-pink-600 font-medium"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {child.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const SearchFilters = ({
  categories = [],
  filters = {},
  onFiltersChange,
  onResetFilters,
  hasActiveFilters,
  simplified = false,
}) => {
  const priceRanges = [
    { value: "all", label: "Tous les prix" },
    { value: "0-50", label: "< 50€" },
    { value: "50-100", label: "50€ - 100€" },
    { value: "100-300", label: "100€ - 300€" },
    { value: "300-500", label: "300€ - 500€" },
    { value: "500+", label: "> 500€" },
  ];

  const sortOptions = [
    { value: "relevance", label: "Pertinence" },
    { value: "price-asc", label: "Prix ↑" },
    { value: "price-desc", label: "Prix ↓" },
    { value: "name-asc", label: "Nom A-Z" },
    { value: "name-desc", label: "Nom Z-A" },
    { value: "date-desc", label: "Plus récents" },
  ];

  const availabilityOptions = [
    { value: "all", label: "Disponibilité" },
    { value: "in-stock", label: "En stock" },
    { value: "pre-order", label: "Précommande" },
  ];

  const updateFilter = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const activeFilters = useMemo(() => {
    const active = [];
    if (filters.category) {
      const cat = categories.find(
        (c) => String(c.id) === String(filters.category),
      );
      active.push({
        key: "category",
        label: cat?.name || filters.category,
        reset: () => updateFilter("category", ""),
      });
    }
    if (filters.priceRange && filters.priceRange !== "all") {
      const label = priceRanges.find(
        (p) => p.value === filters.priceRange,
      )?.label;
      if (label)
        active.push({
          key: "priceRange",
          label,
          reset: () => updateFilter("priceRange", "all"),
        });
    }
    if (filters.availability && filters.availability !== "all") {
      const label = availabilityOptions.find(
        (a) => a.value === filters.availability,
      )?.label;
      if (label)
        active.push({
          key: "availability",
          label,
          reset: () => updateFilter("availability", "all"),
        });
    }
    if (
      filters.sortBy &&
      filters.sortBy !== "relevance" &&
      filters.sortBy !== "name-asc"
    ) {
      const label = sortOptions.find((s) => s.value === filters.sortBy)?.label;
      if (label)
        active.push({
          key: "sortBy",
          label: `Tri: ${label}`,
          reset: () =>
            updateFilter("sortBy", simplified ? "name-asc" : "relevance"),
        });
    }
    return active;
  }, [filters, categories]);

  const selectClass =
    "appearance-none bg-white border border-gray-200 text-gray-600 text-sm px-3 py-1.5 rounded-full focus:outline-none focus:border-gray-400 cursor-pointer hover:border-gray-300 transition-colors";

  return (
    <div className="space-y-2">
      {/* Ligne de filtres compacte */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={14} className="text-gray-400 flex-shrink-0" />

        {/* Tri */}
        <select
          value={filters.sortBy || (simplified ? "name-asc" : "relevance")}
          onChange={(e) => updateFilter("sortBy", e.target.value)}
          className={selectClass}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Catégorie - dropdown custom accordéon */}
        <CategoryDropdown
          categories={categories}
          value={filters.category || ""}
          onChange={(val) => updateFilter("category", val)}
        />

        {/* Prix */}
        <select
          value={filters.priceRange || "all"}
          onChange={(e) => updateFilter("priceRange", e.target.value)}
          className={selectClass}
        >
          {priceRanges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>

        {/* Disponibilité */}
        <select
          value={filters.availability || "all"}
          onChange={(e) => updateFilter("availability", e.target.value)}
          className={selectClass}
        >
          {availabilityOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Bouton reset */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors px-2 py-1.5"
          >
            <X size={12} />
            Effacer
          </button>
        )}
      </div>

      {/* Badges filtres actifs */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full"
            >
              {f.label}
              <button
                onClick={f.reset}
                className="hover:text-gray-900 transition-colors"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
