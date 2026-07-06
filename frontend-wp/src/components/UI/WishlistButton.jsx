import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

const WishlistButton = ({ product, className = "" }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();

    window.dispatchEvent(
      new CustomEvent("wishlist:fly-to-header", {
        detail: {
          buttonX: rect.left + rect.width / 2,
          buttonY: rect.top + rect.height / 2,
          direction: isFavorite ? "remove" : "add",
        },
      }),
    );

    toggleWishlist(product);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
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
