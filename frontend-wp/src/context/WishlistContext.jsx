// src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};

// Clé pour le localStorage
const STORAGE_KEY = "axemusique_wishlist";

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Initialisation avec le localStorage
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Erreur lecture localStorage:", error);
      return [];
    }
  });
  const [notification, setNotification] = useState(null);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Erreur sauvegarde localStorage:", error);
    }
  }, [wishlist]);

  const addToWishlist = (product) => {
    setWishlist((prev) => [...prev, product]);
    showNotification(`${product.name} ajouté aux favoris`, "success");
  };

  const removeFromWishlist = (productId) => {
    const product = wishlist.find((p) => p.id === productId);
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    if (product) {
      showNotification(`${product.name} retiré des favoris`, "info");
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        notification,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
