// src/components/UI/SortFilter.jsx
import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

const SortFilter = ({ currentSort = "default", onChange, className = "" }) => {
  const handleSortChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tri rapide</h3>
        {currentSort !== "default" && (
          <button
            onClick={() => handleSortChange("default")}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Tri par prix uniquement */}
      <div className="flex gap-2">
        <button
          onClick={() => handleSortChange("price-asc")}
          className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            currentSort === "price-asc"
              ? "bg-pink-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ArrowUp size={18} />
          <span className="text-sm font-medium">Prix ↑</span>
        </button>
        <button
          onClick={() => handleSortChange("price-desc")}
          className={`flex-1 px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            currentSort === "price-desc"
              ? "bg-pink-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ArrowDown size={18} />
          <span className="text-sm font-medium">Prix ↓</span>
        </button>
      </div>
    </div>
  );
};

export default SortFilter;
