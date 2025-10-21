// frontend-wp/src/components/Product/ProductCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

// ✅ IMAGE PAR DÉFAUT - Service externe fiable
const FALLBACK_IMAGE =
  "https://placehold.co/800x800/f3f4f6/9ca3af?text=Produit";

const fmt = (v) => (v ? `${String(v).replace(".", ",")}€` : "");

const Stars = ({ value = 0, size = 14 }) => {
  const full = Math.floor(Number(value) || 0);
  const half = Number(value) - full >= 0.5;
  return (
    <div
      className="flex items-center gap-0.5 text-amber-500"
      aria-label={`Note ${value}/5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const state = i < full ? "full" : i === full && half ? "half" : "empty";
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            className="shrink-0"
          >
            {state === "full" && (
              <path
                fill="currentColor"
                d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
              />
            )}
            {state === "half" && (
              <>
                <path
                  fill="currentColor"
                  d="M12 2v15.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61z"
                />
                <path
                  fill="currentColor"
                  opacity="0.25"
                  d="M12 17.27V2L9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                />
              </>
            )}
            {state === "empty" && (
              <path
                fill="currentColor"
                opacity="0.25"
                d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24z"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const [imgSrc, setImgSrc] = useState(
    product?.images?.[0]?.src || FALLBACK_IMAGE
  );
  const [loaded, setLoaded] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false);

  const alt = product?.images?.[0]?.alt || product?.name || "Produit";
  const url = `/produit/${product.slug || product.id}`;

  const hasPromo =
    Number(product?.sale_price || 0) > 0 &&
    product?.regular_price &&
    product.sale_price !== product.regular_price;

  // Gestion du stock
  const stockStatus = product?.stock_status || "outofstock";
  const manageStock = product?.manage_stock || false;

  let isInStock, isOnOrder, isBackorder, isOutOfStock;

  if (manageStock) {
    isInStock = stockStatus === "instock";
    isOnOrder = false;
    isBackorder = false;
    isOutOfStock =
      stockStatus === "outofstock" || stockStatus === "onbackorder";
  } else {
    isInStock = stockStatus === "instock";
    isOnOrder = stockStatus === "outofstock";
    isBackorder = stockStatus === "onbackorder";
    isOutOfStock = false;
  }

  // ✅ GESTION D'ERREUR SÉCURISÉE - Une seule tentative de fallback
  const handleImageError = () => {
    if (!errorOccurred) {
      console.warn(`Image non trouvée pour: ${product?.name || "produit"}`);
      setImgSrc(FALLBACK_IMAGE);
      setErrorOccurred(true);
      setLoaded(true);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <Link to={url} className="block">
        <div className="relative h-52 bg-white">
          {/* ✅ IMAGE AVEC GESTION D'ERREUR SIMPLE */}
          <img
            src={imgSrc}
            alt={alt}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={handleImageError}
            className={`h-full w-full object-contain p-3 transition-opacity duration-300 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Loader */}
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Badge Promo */}
          {hasPromo && (
            <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-400 text-white shadow">
              Promo
            </span>
          )}

          {/* Badges de stock */}
          {manageStock && isOutOfStock && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-red-600/90 text-white shadow">
              Rupture
            </span>
          )}
          {!manageStock && isOnOrder && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/90 text-white shadow">
              Sur commande
            </span>
          )}
          {!manageStock && isBackorder && (
            <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-orange-500/90 text-white shadow">
              Réappro
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={url} title={product?.name}>
          <h3 className="line-clamp-2 font-semibold text-gray-900 hover:text-sky-600 transition-colors">
            {product?.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {fmt(
                product?.sale_price || product?.price || product?.regular_price
              )}
            </span>
            {hasPromo && (
              <span className="text-sm text-gray-500 line-through">
                {fmt(product?.regular_price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Stars value={Number(product?.average_rating || 4.5)} />
            {product?.rating_count ? (
              <span>({product.rating_count})</span>
            ) : null}
          </div>
        </div>

        <Link
          to={url}
          className={`mt-3 inline-flex w-full items-center justify-center h-10 rounded-xl text-sm font-medium text-white shadow-sm transition
            ${
              isInStock
                ? "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-fuchsia-500 hover:to-sky-400"
                : isOnOrder
                ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                : isBackorder
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                : "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700"
            }`}
        >
          Voir le produit
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
