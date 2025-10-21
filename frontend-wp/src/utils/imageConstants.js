// src/utils/imageConstants.js

/**
 * ⚠️ IMPORTANT : Configuration des images par défaut
 *
 * Ces URLs ne doivent JAMAIS pointer vers votre propre serveur pour éviter les boucles.
 * Utilisez des services d'images placeholder fiables et stables.
 */

export const IMAGE_FALLBACKS = {
  // Image par défaut principale
  DEFAULT:
    "https://via.placeholder.com/800x800/e5e7eb/9ca3af?text=Image+non+disponible",

  // Image pour les produits
  PRODUCT: "https://via.placeholder.com/800x800/f3f4f6/6b7280?text=Produit",

  // Image pour les miniatures
  THUMBNAIL: "https://via.placeholder.com/200x200/e5e7eb/9ca3af?text=Image",

  // Image pour les catégories
  CATEGORY: "https://via.placeholder.com/400x400/dbeafe/3b82f6?text=Categorie",
};

/**
 * Alternative : Vous pouvez héberger votre propre image par défaut
 * sur un CDN externe (Cloudinary, imgix, etc.) ou un autre domaine
 *
 * Exemple :
 * DEFAULT: "https://cdn.votresite.com/placeholder.jpg"
 */

// Export par défaut
export default IMAGE_FALLBACKS;
