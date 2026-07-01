// src/components/Search/ProductExpansion.jsx
import { useState, useEffect } from "react";
import {
  ShoppingBag,
  Package,
  Star,
  Info,
  ExternalLink,
  Heart,
  Truck,
  Shield,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";
import { useBreadcrumb } from "../../hooks/useBreadcrumb";
import WishlistButton from "../UI/WishlistButton";

const ProductExpansion = ({
  product,
  isLoading = false,
  fullProduct = null,
}) => {
  const [imageError, setImageError] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const displayProduct = fullProduct || product;
  const { breadcrumbItems, loading: loadingBreadcrumb } =
    useBreadcrumb(displayProduct);

  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(price));
  };

  const getStockStatus = (product) => {
    const status = product?.stock_status;
    const manageStock = product?.manage_stock || false;
    const stockQuantity = product?.stock_quantity ?? null;

    const isReappro =
      manageStock &&
      status === "outofstock" &&
      stockQuantity !== null &&
      stockQuantity === 0;

    if (status === "instock") {
      return {
        text: "En stock",
        color: "text-green-600",
        bg: "bg-green-50",
        icon: "✓",
      };
    }

    if (status === "onbackorder" || isReappro) {
      return {
        text: "En cours de réappro",
        color: "text-orange-600",
        bg: "bg-orange-50",
        icon: "⏳",
      };
    }

    if (status === "outofstock") {
      // manageStock=false → sur commande, manageStock=true → vraie rupture
      if (!manageStock) {
        return {
          text: "Sur commande",
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          icon: "📦",
        };
      }
      return {
        text: "Rupture de stock",
        color: "text-red-600",
        bg: "bg-red-50",
        icon: "✗",
      };
    }

    return {
      text: "Non disponible",
      color: "text-gray-600",
      bg: "bg-gray-50",
      icon: "?",
    };
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-white animate-pulse">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const images = displayProduct.images || [];
  const mainImage = images[selectedImageIndex] || images[0];
  const stockInfo = getStockStatus(displayProduct);

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white border-t border-gray-100">
      <div className="p-6 lg:p-8">
        {/* Layout principal en 2 colonnes */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Colonne gauche - Images */}
          <div className="space-y-4">
            {/* Image principale */}
            <div className="relative group">
              <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                {mainImage && !imageError ? (
                  <img
                    src={mainImage.src}
                    alt={displayProduct.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag size={64} />
                  </div>
                )}

                {/* Navigation des images */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Indicateur d'images */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === selectedImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Galerie miniatures */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === selectedImageIndex
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.src}
                      alt={`${displayProduct.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Colonne droite - Informations */}
          <div className="space-y-6">
            {/* En-tête produit */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                  {displayProduct.name}
                </h1>
                {/* ❤️ relié au WishlistContext */}
                <WishlistButton
                  product={displayProduct}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                />
              </div>

              {/* Prix */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {displayProduct.sale_price &&
                displayProduct.regular_price !== displayProduct.sale_price ? (
                  <>
                    <span className="text-3xl font-bold text-red-600">
                      {formatPrice(displayProduct.sale_price)}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(displayProduct.regular_price)}
                    </span>
                    <span className="px-2.5 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold rounded-full shadow-sm">
                      Solde
                    </span>
                    <span className="px-2.5 py-1 bg-gray-900 text-white text-sm font-bold rounded-full shadow-sm">
                      -
                      {Math.round(
                        100 -
                          (Number(displayProduct.sale_price) /
                            Number(displayProduct.regular_price)) *
                            100,
                      )}
                      %
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(
                      displayProduct.price || displayProduct.regular_price,
                    )}
                  </span>
                )}
              </div>

              {/* Statut et métadonnées */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium ${stockInfo.bg} ${stockInfo.color}`}
                >
                  <span>{stockInfo.icon}</span>
                  {stockInfo.text}
                </span>

                {displayProduct.brands?.length > 0 && (
                  <>
                    {displayProduct.brands.map((brand) => {
                      const formattedName =
                        brand.name.charAt(0).toUpperCase() +
                        brand.name.slice(1).toLowerCase();
                      return (
                        <span
                          key={brand.id}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-600 border border-blue-200"
                        >
                          <Tag size={14} />
                          {formattedName}
                        </span>
                      );
                    })}
                  </>
                )}

                {displayProduct.sku && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Package size={14} />
                    <span>Réf: {displayProduct.sku}</span>
                  </div>
                )}

                {displayProduct.average_rating &&
                  parseFloat(displayProduct.average_rating) > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`${
                              i < Math.floor(displayProduct.average_rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-600">
                        {displayProduct.average_rating}/5
                      </span>
                      {displayProduct.rating_count && (
                        <span className="text-gray-400">
                          ({displayProduct.rating_count} avis)
                        </span>
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Description courte */}
            {displayProduct.short_description && (
              <div className="prose prose-sm max-w-none">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: displayProduct.short_description,
                  }}
                />
              </div>
            )}

            {/* Caractéristiques principales */}
            {displayProduct.attributes?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Info size={18} />
                  Caractéristiques
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {displayProduct.attributes
                      .slice(0, 6)
                      .map((attr, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1"
                        >
                          <span className="text-gray-600 font-medium">
                            {attr.name}:
                          </span>
                          <span className="text-gray-900 text-sm">
                            {Array.isArray(attr.options)
                              ? attr.options.join(", ")
                              : attr.options}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Catégories avec breadcrumb */}
            {loadingBreadcrumb ? (
              <div>
                <span className="text-sm text-gray-500 mb-2 block">
                  Catégories:
                </span>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            ) : (
              breadcrumbItems.length > 1 && (
                <div>
                  <span className="text-sm text-gray-500 mb-2 block">
                    Catégories:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {breadcrumbItems
                      .filter((item) => item.label !== "Accueil" && item.path)
                      .map((item, index) => (
                        <a
                          key={index}
                          href={item.path}
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = item.path;
                          }}
                          className="px-2 py-0.5 rounded-md text-xs font-medium bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Description complète */}
        {displayProduct.description && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Description détaillée
              </h3>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showFullDescription ? "Réduire" : "Voir plus"}
              </button>
            </div>
            <div
              className={`prose prose-sm max-w-none text-gray-700 transition-all duration-300 ${
                showFullDescription ? "" : "line-clamp-6 overflow-hidden"
              }`}
              dangerouslySetInnerHTML={{
                __html: displayProduct.description,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductExpansion;
