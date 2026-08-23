import { Heart } from "lucide-react";
import { useWishlist } from "../../context/WishlistContext";

const WishlistButton = ({ product, className = "", iconSize = 24 }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = product?.id != null && isInWishlist(product.id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product?.id == null) return;

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
      disabled={product?.id == null}
      className={`group relative flex items-center justify-center transition-all ${className}`}
      aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-pressed={isFavorite}
      title={isFavorite ? "Je n’aime plus" : "J’aime"}
    >
      <Heart
        size={iconSize}
        className={`transition-all ${
          isFavorite
            ? "fill-pink-500 text-pink-500 scale-110"
            : "text-gray-400 group-hover:text-pink-500 group-hover:scale-110"
        }`}
      />
    </button>
  );
};

export default WishlistButton;
