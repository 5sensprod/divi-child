// src/components/navigation/HeaderWishlistButton.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";
import { formatPrice } from "../../utils/format";

const HeaderWishlistButton = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleProductClick = (slug) => {
    navigate(`/produit/${slug}`);
    setIsOpen(false);
  };

  // ✅ Vérifie si un produit est en solde + calcule le pourcentage
  const getPromoInfo = (product) => {
    const hasPromo =
      Number(product?.sale_price || 0) > 0 &&
      product?.regular_price &&
      product.sale_price !== product.regular_price;

    if (!hasPromo) return { hasPromo: false };

    const discountPercent = Math.round(
      100 - (Number(product.sale_price) / Number(product.regular_price)) * 100,
    );

    return { hasPromo: true, discountPercent };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/90 hover:text-pink-300 transition-colors"
        aria-label="Favoris"
      >
        <Heart className="w-5 h-5" />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {wishlist.length > 99 ? "99+" : wishlist.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-dropdown animate-slide-down">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
              Mes favoris ({wishlist.length})
            </h3>
          </div>

          {wishlist.length === 0 ? (
            <div className="p-8 text-center">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">
                Aucun produit dans vos favoris
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {wishlist.map((product) => {
                const { hasPromo, discountPercent } = getPromoInfo(product);

                return (
                  <div
                    key={product.id}
                    className="flex gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          product.images?.[0]?.src || "/placeholder-product.jpg"
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded cursor-pointer"
                        onClick={() => handleProductClick(product.slug)}
                        onError={(e) =>
                          (e.target.src = "/placeholder-product.jpg")
                        }
                      />
                      {hasPromo && (
                        <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-pink-600 transition-colors"
                        onClick={() => handleProductClick(product.slug)}
                      >
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        {hasPromo ? (
                          <>
                            <span className="text-sm font-bold text-pink-600">
                              {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(product.regular_price)}
                            </span>
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              Solde
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-bold text-pink-600">
                            {formatPrice(
                              product.price || product.regular_price,
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="self-start p-1 hover:bg-gray-200 rounded transition-colors"
                      aria-label="Retirer des favoris"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderWishlistButton;
