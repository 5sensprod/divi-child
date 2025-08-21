import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

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

// Service pour récupérer les catégories
export const getCategories = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
      hide_empty: true,
    });

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

// Service pour rechercher des produits
export const searchProducts = async (searchTerm) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      search: searchTerm,
      per_page: 20,
    });

    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Erreur recherche:", error.response?.data || error.message);
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

export default {
  getProducts,
  getCategories,
  getProduct,
  searchProducts,
  getProductsByCategory,
};
