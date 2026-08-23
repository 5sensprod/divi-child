// src/context/WishlistContext.jsx
import { createContext, useContext, useState, useEffect, useRef } from "react";

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

// Les identifiants peuvent revenir sous forme de nombre ou de chaîne selon
// l'API et le cache. Les comparer sous une forme unique évite qu'un produit
// déjà aimé apparaisse comme nouveau après un rechargement.
const sameProduct = (product, productId) =>
  String(product?.id) === String(productId);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    // Initialisation avec le localStorage
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("Erreur lecture localStorage:", error);
      return [];
    }
  });
  const wishlistRef = useRef(wishlist);
  const [notification, setNotification] = useState(null);
  const notificationTimer = useRef(null);

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Erreur sauvegarde localStorage:", error);
    }
  }, [wishlist]);

  useEffect(
    () => () => {
      if (notificationTimer.current) clearTimeout(notificationTimer.current);
    },
    [],
  );

  const productName = (product) => product?.name || product?.title || "Produit";

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    if (notificationTimer.current) clearTimeout(notificationTimer.current);
    notificationTimer.current = setTimeout(() => setNotification(null), 3000);
  };

  const addToWishlist = (product) => {
    if (product?.id == null) return;

    const previous = wishlistRef.current;
    if (previous.some((item) => sameProduct(item, product.id))) return;

    const next = [...previous, product];
    wishlistRef.current = next;
    setWishlist(next);
    showNotification(`${productName(product)} ajouté aux favoris`, "success");
  };

  const removeFromWishlist = (productId) => {
    const previous = wishlistRef.current;
    const product = previous.find((item) => sameProduct(item, productId));
    if (!product) return;

    const next = previous.filter((item) => !sameProduct(item, productId));
    wishlistRef.current = next;
    setWishlist(next);
    showNotification(`${productName(product)} retiré des favoris`, "info");
  };

  const isInWishlist = (productId) => {
    return wishlist.some((product) => sameProduct(product, productId));
  };

  const toggleWishlist = (product) => {
    if (product?.id == null) return;

    // La ref est mise à jour avant le prochain rendu : plusieurs clics très
    // rapides ne peuvent ni créer de doublon, ni lire un état obsolète.
    const previous = wishlistRef.current;
    const exists = previous.some((item) => sameProduct(item, product.id));
    const next = exists
      ? previous.filter((item) => !sameProduct(item, product.id))
      : [...previous, product];

    wishlistRef.current = next;
    setWishlist(next);
    showNotification(
      `${productName(product)} ${exists ? "retiré des" : "ajouté aux"} favoris`,
      exists ? "info" : "success",
    );
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
