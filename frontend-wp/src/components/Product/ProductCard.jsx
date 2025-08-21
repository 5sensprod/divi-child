import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <Link to={`/produit/${product.id}`} className="block">
        <div className="relative h-64 bg-gray-200">
          <img
            src={
              product.images?.[0]?.src ||
              "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
            }
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {product.on_sale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Promo
            </div>
          )}

          {product.stock_status !== "instock" && (
            <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-sm font-semibold">
              Rupture
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.sale_price && product.sale_price !== "" && (
              <span className="text-lg font-bold text-green-600">
                {product.sale_price}€
              </span>
            )}
            <span
              className={`${
                product.sale_price && product.sale_price !== ""
                  ? "text-sm text-gray-500 line-through"
                  : "text-lg font-bold text-gray-800"
              }`}
            >
              {product.regular_price}€
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex text-yellow-400 text-sm">★★★★★</div>
            <span className="ml-1 text-sm text-gray-600">(4.5)</span>
          </div>
        </div>

        <button
          className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 font-semibold ${
            product.stock_status === "instock"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={product.stock_status !== "instock"}
        >
          {product.stock_status === "instock"
            ? "Voir le produit"
            : "Non disponible"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
