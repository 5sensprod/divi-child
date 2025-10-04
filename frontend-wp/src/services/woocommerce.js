import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { cacheUtils, CACHE_KEYS, CACHE_DURATIONS } from "../utils/cache";

// Configuration WooCommerce
const createWooCommerceAPI = () => {
  const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;
  const siteURL = import.meta.env.VITE_WP_SITE_URL || "https://axemusique.shop";

  return new WooCommerceRestApi({
    url: siteURL,
    consumerKey: consumerKey,
    consumerSecret: consumerSecret,
    version: "wc/v3",
    queryStringAuth: true,
  });
};

// Service pour récupérer les produits
export const getProducts = async (params = {}) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const defaultParams = {
      per_page: 20,
      status: "publish",
      ...params,
    };

    const response = await WooCommerce.get("products", defaultParams);
    return response.data;
  } catch (error) {
    // Log seulement les erreurs importantes en mode développement
    if (import.meta.env.DEV) {
      console.error(
        "Erreur WooCommerce:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// Service pour récupérer TOUTES les catégories AVEC CACHE
export const getCategories = async () => {
  try {
    // Vérifier le cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(CACHE_KEYS.CATEGORIES);
      if (cached) {
        console.log("=== CATÉGORIES DEPUIS LE CACHE ===");
        console.log("Nombre de catégories (cache):", cached.length);
        return cached;
      }
    }

    // Si pas en cache, récupérer depuis l'API
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
      hide_empty: true,
    });

    // Console.log pour voir les catégories récupérées
    console.log("=== TOUTES LES CATÉGORIES (API) ===");
    console.log("Nombre de catégories:", response.data.length);
    console.log("Données complètes:", response.data);

    // Affichage simplifié des catégories
    console.log("Liste des catégories:");
    response.data.forEach((category) => {
      console.log(
        `- ID: ${category.id}, Nom: ${category.name}, Slug: ${category.slug}, Parent: ${category.parent}`
      );
    });

    // Sauvegarder en cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(CACHE_KEYS.CATEGORIES, response.data);
      console.log("Catégories sauvegardées en cache");
    }

    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        "Erreur catégories:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// Service pour récupérer UNIQUEMENT les catégories PARENTES AVEC CACHE
export const getParentCategories = async () => {
  try {
    const parentCategoriesCacheKey = `${CACHE_KEYS.CATEGORIES}_parent`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(parentCategoriesCacheKey);
      if (cached) {
        console.log("=== CATÉGORIES PARENTES DEPUIS LE CACHE ===");
        console.log("Nombre de catégories parentes (cache):", cached.length);
        return cached;
      }
    }

    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
      hide_empty: true,
      parent: 0,
      orderby: "id", // Tri par ID (ordre de création)
      order: "asc", // Ordre croissant (du plus ancien au plus récent)
    });

    // Tri supplémentaire côté client si nécessaire
    const sortedCategories = response.data.sort((a, b) => {
      // Tri par ID (ordre de création)
      return a.id - b.id;

      // OU tri par date de création si disponible
      // return new Date(a.date_created) - new Date(b.date_created);
    });

    console.log("=== CATÉGORIES PARENTES TRIÉES ===");
    console.log("Nombre de catégories parentes:", sortedCategories.length);
    sortedCategories.forEach((category, index) => {
      console.log(
        `${index + 1}. ID: ${category.id}, Nom: ${category.name}, Date: ${
          category.date_created
        }`
      );
    });

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(parentCategoriesCacheKey, sortedCategories);
      console.log("Catégories parentes triées sauvegardées en cache");
    }

    return sortedCategories;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        "Erreur catégories parentes:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// Service pour récupérer un produit spécifique
export const getProduct = async (productId) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get(`products/${productId}`);
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Erreur produit:", error.response?.data || error.message);
    }
    throw error;
  }
};

// SERVICE CORRIGÉ : Recherche avec filtres
export const searchProducts = async (searchTerm = "", searchParams = {}) => {
  try {
    const WooCommerce = createWooCommerceAPI();

    const params = {
      per_page: 20,
      status: "publish",
      ...searchParams,
    };

    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    const response = await WooCommerce.get("products", params);

    // ✅ Supprimer ou modifier cette logique de fallback
    // Ne pas faire de fallback automatique qui ignore le terme de recherche
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        "Erreur searchProducts:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// Service pour récupérer les produits par catégorie
// Service pour récupérer les produits par catégorie AVEC headers de pagination
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const page = params.page || 1;
    const per_page = params.per_page || 12;

    // Créer une clé de cache unique pour chaque page
    const cacheKey = `axemusique_category_${categoryId}_page_${page}_perpage_${per_page}`;

    // Vérifier le cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.getWithTTL(cacheKey, CACHE_DURATIONS.DEFAULT);
      if (cached) {
        console.log(`📦 Produits de la page ${page} depuis le cache`);
        return cached;
      }
    }

    // Si pas en cache, récupérer depuis l'API
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      category: categoryId,
      per_page: per_page,
      page: page,
      status: "publish",
      ...params,
    });

    // Extraire les informations de pagination depuis les headers
    const result = {
      data: response.data,
      headers: {
        "x-wp-total": response.headers["x-wp-total"],
        "x-wp-totalpages": response.headers["x-wp-totalpages"],
      },
      pagination: {
        total: parseInt(response.headers["x-wp-total"]) || 0,
        totalPages: parseInt(response.headers["x-wp-totalpages"]) || 0,
        currentPage: page,
        perPage: per_page,
      },
    };

    console.log(`📊 Pagination info:`, result.pagination);

    // Sauvegarder en cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.setWithTTL(cacheKey, result, CACHE_DURATIONS.DEFAULT);
    }

    return result;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        "Erreur produits par catégorie:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};
// Fonction utilitaire pour vider le cache des catégories
export const clearCategoriesCache = () => {
  cacheUtils.remove(CACHE_KEYS.CATEGORIES);
  cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent`);
  cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent_filtered`);
};

export const getTotalProductsCount = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      per_page: 1, // On récupère juste 1 produit pour avoir les headers
      status: "publish",
    });

    // Le nombre total est dans les headers de la réponse
    const totalCount =
      response.headers["x-wp-total"] || response.headers["X-WP-Total"];
    return parseInt(totalCount) || 0;
  } catch (error) {
    console.error("Erreur getTotalProductsCount:", error);
    return 0;
  }
};

// Service pour récupérer toutes les marques uniques
export const getBrands = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    // Si vous avez un plugin de marques, utilisez l'endpoint approprié
    const response = await WooCommerce.get("products/brands", {
      per_page: 100,
    });
    return response.data;
  } catch (error) {
    // Fallback : extraire les marques depuis les produits
    console.log("Pas d'endpoint brands, extraction depuis les produits...");
    return [];
  }
};

export default {
  // Fonctions existantes
  getProducts,
  getCategories,
  getParentCategories,
  getProduct,
  searchProducts,
  getProductsByCategory,
  getTotalProductsCount,
  getBrands,
  clearCategoriesCache,
};
