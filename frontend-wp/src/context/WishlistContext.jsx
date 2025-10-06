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

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [notification, setNotification] = useState(null);

  // Charger depuis localStorage
  useEffect(() => {
    const saved = localStorage.getItem("axemusique_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (error) {
        console.error("Erreur chargement wishlist:", error);
      }
    }
  }, []);

  // Sauvegarder dans localStorage
  useEffect(() => {
    localStorage.setItem("axemusique_wishlist", JSON.stringify(wishlist));
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
