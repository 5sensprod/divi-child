// src/components/UI/WishlistNotification.jsx
import { useWishlist } from "../../context/WishlistContext";
import { Heart, X } from "lucide-react";

const WishlistNotification = () => {
  const { notification } = useWishlist();

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-slide-up">
      <div
        className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-md border ${
          notification.type === "success"
            ? "bg-pink-500/90 border-pink-400 text-white"
            : "bg-gray-900/90 border-white/10 text-white"
        }`}
      >
        <Heart className="w-5 h-5 flex-shrink-0" fill="currentColor" />
        <span className="font-medium">{notification.message}</span>
      </div>
    </div>
  );
};

export default WishlistNotification;
