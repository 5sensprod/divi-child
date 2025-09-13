// src/services/mediaService.js
import { cacheUtils } from "../utils/cache";

/**
 * Service simple pour optimiser les images des catégories
 * Compatible avec ton cache.js existant
 */

// Configuration WordPress API
const WP_API_URL =
  import.meta.env.VITE_WP_API_URL || "https://axemusique.shop/wp-json/wp/v2";
const WP_USER = import.meta.env.VITE_WP_USER || "appstock-sync-api";
const WP_PASSWORD =
  import.meta.env.VITE_WP_APP_PASSWORD || "Vv6I EWDr R27G sCaw uEWx e6Z5";

// TTL pour le cache des médias (1 heure)
const MEDIA_CACHE_TTL = 60 * 60 * 1000;

/**
 * Récupère les métadonnées d'un média WordPress
 */
export const getMediaMetadata = async (mediaId) => {
  if (!mediaId) return null;

  try {
    const cacheKey = `wp_media_${mediaId}`;

    // Vérifier le cache
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.getWithTTL(cacheKey, MEDIA_CACHE_TTL);
      if (cached) {
        return cached;
      }
    }

    // Récupérer depuis l'API WordPress
    const response = await fetch(`${WP_API_URL}/media/${mediaId}`, {
      headers: {
        Authorization: `Basic ${btoa(`${WP_USER}:${WP_PASSWORD}`)}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const mediaData = await response.json();

    // Sauvegarder en cache
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.setWithTTL(cacheKey, mediaData, MEDIA_CACHE_TTL);
    }

    return mediaData;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        `Impossible de récupérer le média ${mediaId}:`,
        error.message
      );
    }
    return null;
  }
};

/**
 * Génère les URLs d'images optimisées depuis les métadonnées WordPress
 */
export const generateOptimizedImage = (mediaData) => {
  if (!mediaData || !mediaData.media_details) {
    // Image par défaut
    return {
      srcset: "",
      sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
      src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      width: 400,
      height: 300,
    };
  }

  const { media_details, source_url } = mediaData;
  const { sizes, width: fullWidth, height: fullHeight } = media_details;

  if (!sizes || Object.keys(sizes).length === 0) {
    // Pas de tailles multiples, utiliser l'image originale
    return {
      srcset: "",
      sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
      src: source_url,
      width: fullWidth || 400,
      height: fullHeight || 300,
    };
  }

  // Construire le srcset avec les tailles disponibles
  const baseUrl = source_url.substring(0, source_url.lastIndexOf("/") + 1);
  const srcsetEntries = [];

  // Tailles préférées dans l'ordre
  const preferredSizes = ["thumbnail", "medium", "medium_large", "large"];
  let defaultSrc = source_url;
  let defaultWidth = fullWidth || 400;
  let defaultHeight = fullHeight || 300;

  // Ajouter les tailles disponibles au srcset
  preferredSizes.forEach((sizeName) => {
    if (sizes[sizeName]) {
      const sizeData = sizes[sizeName];
      srcsetEntries.push(`${baseUrl}${sizeData.file} ${sizeData.width}w`);

      // Utiliser 'medium' comme image par défaut si disponible
      if (sizeName === "medium") {
        defaultSrc = baseUrl + sizeData.file;
        defaultWidth = sizeData.width;
        defaultHeight = sizeData.height;
      }
    }
  });

  // Ajouter l'image full size
  if (fullWidth) {
    srcsetEntries.push(`${source_url} ${fullWidth}w`);
  }

  return {
    srcset: srcsetEntries.join(", "),
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
    src: defaultSrc,
    width: defaultWidth,
    height: defaultHeight,
  };
};

/**
 * Enrichit une catégorie avec une image optimisée
 */
export const enrichCategoryWithOptimizedImage = async (category) => {
  // Si pas d'image, utiliser l'image par défaut
  if (!category.image || !category.image.id) {
    return {
      ...category,
      optimizedImage: generateOptimizedImage(null),
    };
  }

  // Récupérer les métadonnées et générer l'image optimisée
  const mediaData = await getMediaMetadata(category.image.id);
  const optimizedImage = generateOptimizedImage(mediaData);

  return {
    ...category,
    optimizedImage,
  };
};

/**
 * Enrichit toutes les catégories avec des images optimisées
 */
export const enrichCategoriesWithOptimizedImages = async (categories) => {
  if (!categories || categories.length === 0) {
    return [];
  }

  try {
    const enrichedCategories = await Promise.all(
      categories.map((category) => enrichCategoryWithOptimizedImage(category))
    );

    if (import.meta.env.DEV) {
      console.log(
        `✅ ${enrichedCategories.length} catégories enrichies avec images optimisées`
      );
    }

    return enrichedCategories;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Erreur enrichissement catégories:", error);
    }

    // Fallback: retourner les catégories avec images par défaut
    return categories.map((category) => ({
      ...category,
      optimizedImage: generateOptimizedImage(null),
    }));
  }
};

/**
 * Détecte si on est sur mobile
 */
export const isMobileDevice = () => {
  return (
    window.innerWidth <= 768 ||
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0
  );
};

/**
 * Précharge les images (version simple)
 */
export const preloadImages = (categories) => {
  if (!categories || categories.length === 0) return;

  categories.slice(0, 3).forEach((category) => {
    if (category.optimizedImage && category.optimizedImage.src) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = category.optimizedImage.src;
      document.head.appendChild(link);
    }
  });
};

export default {
  getMediaMetadata,
  generateOptimizedImage,
  enrichCategoryWithOptimizedImage,
  enrichCategoriesWithOptimizedImages,
  isMobileDevice,
  preloadImages,
};
