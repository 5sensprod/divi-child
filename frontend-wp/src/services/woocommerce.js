import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Configuration WooCommerce avec fallback hardcodé
const createWooCommerceAPI = () => {
  // Debug TOUTES les variables d'environnement Vite
  console.log("🔍 TOUTES les variables d'environnement Vite:");
  console.log("import.meta.env:", import.meta.env);

  // FALLBACK hardcodé si .env ne marche pas
  const consumerKey =
    import.meta.env.VITE_WC_CONSUMER_KEY ||
    "ck_f0757e22e7bb7365f6ea3e1ef5108af1b2634b64";
  const consumerSecret =
    import.meta.env.VITE_WC_CONSUMER_SECRET ||
    "cs_df7031b1d320ee93fd8677405bcd6190e8e06979";
  const siteURL = import.meta.env.VITE_WP_SITE_URL || "https://axemusique.shop";

  // Debug des variables d'environnement
  console.log("🔍 Debug WooCommerce API officielle:");
  console.log("Site URL:", siteURL);
  console.log(
    "Consumer Key:",
    consumerKey ? `${consumerKey.substring(0, 15)}...` : "NON DÉFINI"
  );
  console.log(
    "Consumer Secret:",
    consumerSecret ? `${consumerSecret.substring(0, 15)}...` : "NON DÉFINI"
  );
  console.log(
    "Source Consumer Key:",
    import.meta.env.VITE_WC_CONSUMER_KEY ? "env" : "hardcodé"
  );
  console.log(
    "Source Consumer Secret:",
    import.meta.env.VITE_WC_CONSUMER_SECRET ? "env" : "hardcodé"
  );

  // Déterminer le type d'authentification
  const isWooCommerceKeys =
    consumerKey.startsWith("ck_") && consumerSecret.startsWith("cs_");
  console.log(
    "Type auth:",
    isWooCommerceKeys ? "✅ WooCommerce API Keys" : "❌ Format invalide"
  );

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

    console.log("🛒 Récupération des produits WooCommerce (clés API)...");
    const response = await WooCommerce.get("products", defaultParams);

    console.log("✅ Produits récupérés:", response.data.length);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur WooCommerce:",
      error.response?.data || error.message
    );

    // Diagnostic des erreurs courantes
    if (error.response?.status === 401) {
      console.error("🔐 Erreur 401: Problème d'authentification");
      console.error(
        "💡 Vérifiez que vos clés WooCommerce sont valides et ont les bonnes permissions"
      );
    } else if (error.response?.status === 404) {
      console.error(
        "🔍 Erreur 404: Endpoint non trouvé - WooCommerce est-il activé ?"
      );
    }

    throw error;
  }
};

// Service pour récupérer les catégories
export const getCategories = async () => {
  try {
    const WooCommerce = createWooCommerceAPI();
    console.log("📁 Récupération des catégories...");
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
      hide_empty: true,
    });

    console.log("✅ Catégories récupérées:", response.data.length);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur catégories:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Service pour récupérer un produit spécifique
export const getProduct = async (productId) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    console.log(`🔍 Récupération du produit ${productId}...`);
    const response = await WooCommerce.get(`products/${productId}`);

    console.log("✅ Produit récupéré:", response.data.name);
    return response.data;
  } catch (error) {
    console.error("❌ Erreur produit:", error.response?.data || error.message);
    throw error;
  }
};

// Service pour rechercher des produits
export const searchProducts = async (searchTerm) => {
  try {
    const WooCommerce = createWooCommerceAPI();
    console.log(`🔍 Recherche: "${searchTerm}"`);
    const response = await WooCommerce.get("products", {
      search: searchTerm,
      per_page: 20,
    });

    console.log("✅ Produits trouvés:", response.data.length);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Erreur recherche:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default {
  getProducts,
  getCategories,
  getProduct,
  searchProducts,
};
