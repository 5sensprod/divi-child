import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { cacheUtils, CACHE_KEYS, CACHE_DURATIONS } from "../utils/cache";
import { decodeHTMLEntities } from "../utils/format";

// Décoder récursivement les entités dans un objet
const decodeObject = (obj) => {
  if (!obj) return obj;
  if (typeof obj === "string") return decodeHTMLEntities(obj);
  if (Array.isArray(obj)) return obj.map(decodeObject);
  if (typeof obj === "object") {
    const decoded = {};
    for (const [key, value] of Object.entries(obj)) {
      decoded[key] = decodeObject(value);
    }
    return decoded;
  }
  return obj;
};

// Configuration WooCommerce
const createWooCommerceAPI = () => {
  const consumerKey = import.meta.env.VITE_WC_CONSUMER_KEY;
  const consumerSecret = import.meta.env.VITE_WC_CONSUMER_SECRET;
  const siteURL = import.meta.env.VITE_WP_SITE_URL || "https://axemusique.shop";

  return new WooCommerceRestApi({
    url: siteURL,
    consumerKey,
    consumerSecret,
    version: "wc/v3",
    queryStringAuth: true,
  });
};

// Récupérer les produits
export const getProducts = async (params = {}) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      per_page: 20,
      status: "publish",
      ...params,
    });
    return decodeObject(response.data);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        "Erreur WooCommerce:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// Récupérer toutes les catégories
export const getCategories = async () => {
  try {
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(CACHE_KEYS.CATEGORIES);
      if (cached) return cached;
    }

    const WooCommerce = createWooCommerceAPI();

    // Page 1
    const response1 = await WooCommerce.get("products/categories", {
      per_page: 100,
      page: 1,
      hide_empty: false,
    });

    // Page 2
    const response2 = await WooCommerce.get("products/categories", {
      per_page: 100,
      page: 2,
      hide_empty: false,
    });

    // Combiner les résultats
    const categories = decodeObject([...response1.data, ...response2.data]);

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(CACHE_KEYS.CATEGORIES, categories);
    }

    return categories;
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

// Récupérer un produit par ID
export const getProduct = async (productId) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get(`products/${productId}`);
    return decodeObject(response.data);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Erreur produit:", error.response?.data || error.message);
    }
    throw error;
  }
};

// Récupérer un produit par slug
export const getProductBySlug = async (slug) => {
  try {
    const cacheKey = `axemusique_product_${slug}`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.getWithTTL(cacheKey, CACHE_DURATIONS.DEFAULT);
      if (cached) return cached;
    }

    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      slug,
      status: "publish",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error("Produit non trouvé");
    }

    const product = decodeObject(response.data[0]);

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.setWithTTL(cacheKey, product, CACHE_DURATIONS.DEFAULT);
    }

    return product;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(
        "Erreur produit par slug:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
};

// Rechercher des produits
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
    return decodeObject(response.data);
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

// Récupérer les produits par catégorie
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const page = params.page || 1;
    const per_page = params.per_page || 12;
    const cacheKey = `axemusique_category_${categoryId}_page_${page}_perpage_${per_page}`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.getWithTTL(cacheKey, CACHE_DURATIONS.DEFAULT);
      if (cached) return cached;
    }

    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      category: categoryId,
      per_page,
      page,
      status: "publish",
      ...params,
    });

    const result = {
      data: decodeObject(response.data),
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

// Récupérer les marques d'une catégorie
export const getBrandsByCategory = async (categoryId) => {
  try {
    const cacheKey = `axemusique_brands_category_${categoryId}`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.getWithTTL(cacheKey, CACHE_DURATIONS.DEFAULT);
      if (cached) return cached;
    }

    const WooCommerce = createWooCommerceAPI();
    const { data } = await WooCommerce.get("products", {
      category: categoryId,
      per_page: 100,
      status: "publish",
    });

    const brandsMap = new Map();
    data.forEach((product) => {
      product.brands?.forEach((brand) => {
        const decodedName = decodeHTMLEntities(brand.name);
        const slug =
          brand.slug || decodedName.toLowerCase().replace(/\s+/g, "-");

        brandsMap.has(slug)
          ? brandsMap.get(slug).count++
          : brandsMap.set(slug, {
              id: brand.id || slug,
              name: decodedName,
              slug,
              count: 1,
            });
      });
    });

    const brands = Array.from(brandsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.setWithTTL(cacheKey, brands, CACHE_DURATIONS.DEFAULT);
    }

    return brands;
  } catch (error) {
    console.error("Erreur récupération marques:", error);
    return [];
  }
};

// Récupérer toutes les marques
export const getBrands = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products/brands", {
      per_page: 100,
    });
    return decodeObject(response.data);
  } catch (error) {
    console.log("Pas d'endpoint brands disponible");
    return [];
  }
};

// Récupérer le nombre total de produits
export const getTotalProductsCount = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      per_page: 1,
      status: "publish",
    });

    const totalCount =
      response.headers["x-wp-total"] || response.headers["X-WP-Total"];
    return parseInt(totalCount) || 0;
  } catch (error) {
    console.error("Erreur getTotalProductsCount:", error);
    return 0;
  }
};

// Vider le cache des catégories
export const clearCategoriesCache = () => {
  cacheUtils.remove(CACHE_KEYS.CATEGORIES);
  cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent`);
  cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent_filtered`);
};

export default {
  getProducts,
  getCategories,
  getProduct,
  getProductBySlug,
  searchProducts,
  getProductsByCategory,
  getBrandsByCategory,
  getBrands,
  getTotalProductsCount,
  clearCategoriesCache,
};
