import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { cacheUtils, CACHE_KEYS } from "../utils/cache";

// Configuration WooCommerce
const createWooCommerceAPI = () => {
  const consumerKey =
    import.meta.env.VITE_WC_CONSUMER_KEY ||
    "ck_f0757e22e7bb7365f6ea3e1ef5108af1b2634b64";
  const consumerSecret =
    import.meta.env.VITE_WC_CONSUMER_SECRET ||
    "cs_df7031b1d320ee93fd8677405bcd6190e8e06979";
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

// Alternative : Filtrer côté client (si l'API ne supporte pas parent: 0) AVEC CACHE
export const getParentCategoriesFiltered = async () => {
  try {
    // Créer une clé de cache spécifique pour les catégories parentes filtrées
    const filteredCacheKey = `${CACHE_KEYS.CATEGORIES}_parent_filtered`;

    // Vérifier le cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(filteredCacheKey);
      if (cached) {
        console.log("=== CATÉGORIES PARENTES FILTRÉES DEPUIS LE CACHE ===");
        console.log("Nombre de catégories parentes (cache):", cached.length);
        return cached;
      }
    }

    // Récupérer toutes les catégories (avec leur propre cache)
    const allCategories = await getCategories();

    // Filtrer les catégories parentes (parent === 0)
    const parentCategories = allCategories.filter(
      (category) => category.parent === 0
    );

    console.log("=== CATÉGORIES PARENTES (FILTRÉES) ===");
    console.log("Nombre total de catégories:", allCategories.length);
    console.log("Nombre de catégories parentes:", parentCategories.length);
    console.log("Catégories parentes:", parentCategories);

    // Sauvegarder en cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(filteredCacheKey, parentCategories);
      console.log("Catégories parentes filtrées sauvegardées en cache");
    }

    return parentCategories;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        "Erreur filtrage catégories parentes:",
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

    // Construire les paramètres de base
    const params = {
      per_page: 20,
      status: "publish",
      ...searchParams,
    };

    // Ajouter le terme de recherche s'il existe
    if (searchTerm && searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    let response = await WooCommerce.get("products", params);

    // Si pas de résultats avec recherche + catégorie, essayer juste la catégorie
    if (response.data.length === 0 && searchTerm && searchParams.category) {
      const categoryOnlyParams = { ...params };
      delete categoryOnlyParams.search;

      const fallbackResponse = await WooCommerce.get(
        "products",
        categoryOnlyParams
      );
      return fallbackResponse.data;
    }

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
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      category: categoryId,
      per_page: 20,
      status: "publish",
      ...params,
    });

    return response.data;
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
  console.log("Cache des catégories vidé");
};

export default {
  getProducts,
  getCategories,
  getParentCategories,
  getParentCategoriesFiltered,
  getProduct,
  searchProducts,
  getProductsByCategory,
  clearCategoriesCache,
};
