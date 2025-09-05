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

// Service pour récupérer TOUTES les catégories
export const getCategories = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
      hide_empty: true,
    });

    // Console.log pour voir les catégories récupérées
    console.log("=== TOUTES LES CATÉGORIES ===");
    console.log("Nombre de catégories:", response.data.length);
    console.log("Données complètes:", response.data);

    // Affichage simplifié des catégories
    console.log("Liste des catégories:");
    response.data.forEach((category) => {
      console.log(
        `- ID: ${category.id}, Nom: ${category.name}, Slug: ${category.slug}, Parent: ${category.parent}`
      );
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

// Service pour récupérer UNIQUEMENT les catégories PARENTES
export const getParentCategories = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
      hide_empty: true,
      parent: 0, // ← Paramètre API pour récupérer uniquement les catégories parentes
    });

    // Console.log pour voir les catégories parentes
    console.log("=== CATÉGORIES PARENTES UNIQUEMENT ===");
    console.log("Nombre de catégories parentes:", response.data.length);
    console.log("Données complètes:", response.data);

    // Affichage simplifié des catégories parentes
    console.log("Liste des catégories parentes:");
    response.data.forEach((category) => {
      console.log(
        `- ID: ${category.id}, Nom: ${category.name}, Slug: ${category.slug}`
      );
    });

    return response.data;
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

// Alternative : Filtrer côté client (si l'API ne supporte pas parent: 0)
export const getParentCategoriesFiltered = async () => {
  try {
    const allCategories = await getCategories();

    // Filtrer les catégories parentes (parent === 0)
    const parentCategories = allCategories.filter(
      (category) => category.parent === 0
    );

    console.log("=== CATÉGORIES PARENTES (FILTRÉES) ===");
    console.log("Nombre total de catégories:", allCategories.length);
    console.log("Nombre de catégories parentes:", parentCategories.length);
    console.log("Catégories parentes:", parentCategories);

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

export default {
  getProducts,
  getCategories,
  getParentCategories,
  getParentCategoriesFiltered,
  getProduct,
  searchProducts,
  getProductsByCategory,
};
