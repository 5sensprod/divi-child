// src/components/UI/WishlistButton.jsx
import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

const WishlistButton = ({ product, className = "" }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleWishlist(product);
      }}
      className={`group relative flex items-center justify-center transition-all ${className}`}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart
        className={`w-6 h-6 transition-all ${
          isFavorite
            ? "fill-pink-500 text-pink-500 scale-110"
            : "text-gray-400 group-hover:text-pink-500 group-hover:scale-110"
        }`}
      />
    </button>
  );
};

export default WishlistButton;
