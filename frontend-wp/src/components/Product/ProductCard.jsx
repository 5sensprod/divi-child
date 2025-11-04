// frontend-wp/src/components/Product/ProductCard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import WishlistButton from "../UI/WishlistButton";
import { formatPrice } from "../../utils/format";

// ✅ IMAGE PAR DÉFAUT - Uniquement pour ProductFilter
const FALLBACK_IMAGE =
  "https://placehold.co/800x800/f3f4f6/9ca3af?text=Produit";

const ProductCard = ({
  product,
  allowFallback = false,
  showCategory = true,
}) => {
  const navigate = useNavigate();
  const [imgSrc, setImgSrc] = useState(
    product?.images?.[0]?.src || (allowFallback ? FALLBACK_IMAGE : null)
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

  // ✅ Gestion d'erreur - Fallback seulement si allowFallback=true
  const handleImageError = () => {
    if (!errorOccurred && allowFallback) {
      console.warn(`Image non trouvée pour: ${product?.name || "produit"}`);
      setImgSrc(FALLBACK_IMAGE);
      setErrorOccurred(true);
      setLoaded(true);
    }
  };

  // ✅ Construire le chemin de la catégorie
  const getCategoryPath = (category) => {
    if (!category) return null;
    return `/categorie-produit/${category.slug}`;
  };

  // ✅ Si pas d'image et fallback non autorisé, ne rien afficher
  if (!imgSrc && !allowFallback) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white border border-black/5 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <Link to={url} className="block">
        <div className="relative h-52 bg-white">
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

          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {hasPromo && (
            <span className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-red-500 text-white shadow">
              PROMO
            </span>
          )}

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

      <div className="p-4 flex flex-col">
        {/* Catégorie et Marque */}
        <div className="flex items-center gap-2 mb-2 min-h-[20px]">
          {showCategory && product?.categories?.[0] && (
            <button
              onClick={(e) => {
                e.preventDefault();
                navigate(getCategoryPath(product.categories[0]));
              }}
              className="text-xs text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded hover:bg-sky-100 hover:text-sky-700 transition-colors"
            >
              {product.categories[0].name}
            </button>
          )}
          {product?.brands?.[0] && (
            <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
              {product.brands[0].name}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-2 mb-3">
          <Link to={url} title={product?.name} className="flex-1 min-h-[3rem]">
            <h3 className="line-clamp-2 font-semibold text-gray-900 hover:text-sky-600 transition-colors h-[3rem]">
              {product?.name}
            </h3>
          </Link>

          {/* ✅ Bouton Wishlist */}
          <WishlistButton
            product={product}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
            iconSize={18}
          />
        </div>

        <div className="flex items-baseline gap-2 flex-wrap mt-auto">
          {hasPromo ? (
            <>
              <span className="text-lg font-bold text-pink-600">
                {formatPrice(product?.sale_price)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product?.regular_price)}
              </span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                PROMO
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(product?.regular_price || product?.price)}
            </span>
          )}
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
