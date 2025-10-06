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
              {wishlist.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={product.images?.[0]?.src || "/placeholder-product.jpg"}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded cursor-pointer"
                    onClick={() => handleProductClick(product.slug)}
                    onError={(e) => (e.target.src = "/placeholder-product.jpg")}
                  />
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-sm font-medium text-gray-900 line-clamp-2 cursor-pointer hover:text-pink-600 transition-colors"
                      onClick={() => handleProductClick(product.slug)}
                    >
                      {product.name}
                    </h4>
                    <p className="text-sm font-bold text-pink-600 mt-1">
                      {formatPrice(product.price || product.regular_price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="self-start p-1 hover:bg-gray-200 rounded transition-colors"
                    aria-label="Retirer des favoris"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderWishlistButton;
