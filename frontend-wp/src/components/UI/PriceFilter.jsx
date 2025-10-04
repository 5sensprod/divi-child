// src/components/UI/PriceFilter.jsx
import React, { useState, useEffect } from "react";

const PriceFilter = ({
  minPrice = 0,
  maxPrice = 2000,
  currentMin = 0,
  currentMax = 2000,
  onChange,
  className = "",
}) => {
  const [localMin, setLocalMin] = useState(currentMin);
  const [localMax, setLocalMax] = useState(currentMax);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLocalMin(currentMin);
    setLocalMax(currentMax);
  }, [currentMin, currentMax]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), localMax - 10);
    setLocalMin(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), localMin + 10);
    setLocalMax(value);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (onChange) {
      onChange({ min: localMin, max: localMax });
    }
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isDragging, localMin, localMax]);

  const calculatePercentage = (value) => {
    return ((value - minPrice) / (maxPrice - minPrice)) * 100;
  };

  const resetFilters = () => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
    if (onChange) {
      onChange({ min: minPrice, max: maxPrice });
    }
  };

  const isFiltered = localMin !== minPrice || localMax !== maxPrice;

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Prix</h3>
        {isFiltered && (
          <button
            onClick={resetFilters}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Affichage des valeurs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={localMin}
            onChange={(e) => {
              const value = Math.max(
                minPrice,
                Math.min(Number(e.target.value), localMax - 10)
              );
              setLocalMin(value);
            }}
            onBlur={handleMouseUp}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <span className="text-gray-600">€</span>
        </div>

        <span className="text-gray-500">-</span>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={localMax}
            onChange={(e) => {
              const value = Math.min(
                maxPrice,
                Math.max(Number(e.target.value), localMin + 10)
              );
              setLocalMax(value);
            }}
            onBlur={handleMouseUp}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <span className="text-gray-600">€</span>
        </div>
      </div>

      {/* Double slider */}
      <div className="relative h-2 mb-8">
        {/* Track de fond */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>

        {/* Track actif (entre les deux curseurs) */}
        <div
          className="absolute h-2 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full"
          style={{
            left: `${calculatePercentage(localMin)}%`,
            right: `${100 - calculatePercentage(localMax)}%`,
          }}
        ></div>

        {/* Slider pour le minimum */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localMin}
          onChange={handleMinChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-pink-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md hover:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:transition-transform"
        />

        {/* Slider pour le maximum */}
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={localMax}
          onChange={handleMaxChange}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-pink-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-pink-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md hover:[&::-moz-range-thumb]:scale-110 [&::-moz-range-thumb]:transition-transform"
        />
      </div>

      {/* Suggestions de prix rapides */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Moins de 50€", min: minPrice, max: 50 },
          { label: "50€ - 200€", min: 50, max: 200 },
          { label: "200€ - 500€", min: 200, max: 500 },
          { label: "Plus de 500€", min: 500, max: maxPrice },
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setLocalMin(preset.min);
              setLocalMax(preset.max);
              if (onChange) {
                onChange({ min: preset.min, max: preset.max });
              }
            }}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              localMin === preset.min && localMax === preset.max
                ? "bg-pink-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter;
