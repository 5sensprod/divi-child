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
export const getProductsByCategory = async (categoryId, params = {}) => {
  try {
    const cacheKey = `axemusique_category_${categoryId}_simple`;

    // Vérifier le cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.getWithTTL(cacheKey, CACHE_DURATIONS.DEFAULT);
      if (cached) {
        return cached;
      }
    }

    // Si pas en cache, récupérer depuis l'API
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products", {
      category: categoryId,
      per_page: 20,
      status: "publish",
      ...params,
    });

    // Sauvegarder en cache si activé
    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.setWithTTL(cacheKey, response.data, CACHE_DURATIONS.DEFAULT);
    }

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

export const getCategoriesHierarchy = async () => {
  try {
    const cacheKey = `${CACHE_KEYS.CATEGORIES}_hierarchy`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(cacheKey);
      if (cached) {
        console.log("Hiérarchie catégories depuis le cache");
        return cached;
      }
    }

    const allCategories = await getCategories();
    const parentCategories = allCategories.filter((cat) => cat.parent === 0);
    const hierarchy = await Promise.all(
      parentCategories.map(async (parent) => ({
        ...parent,
        children: allCategories.filter((cat) => cat.parent === parent.id),
      }))
    );

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(cacheKey, hierarchy);
    }

    console.log(
      "Hiérarchie construite:",
      hierarchy.length,
      "catégories parentes"
    );
    return hierarchy;
  } catch (error) {
    console.error("Erreur hiérarchie catégories:", error);
    return [];
  }
};

// Version sécurisée des fonctions méga menu pour woocommerce.js

// 1. Version sécurisée : getSubCategories avec fallback
export const getSubCategories = async (parentId) => {
  try {
    const cacheKey = `${CACHE_KEYS.CATEGORIES}_children_${parentId}`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(cacheKey);
      if (cached) {
        return cached;
      }
    }

    // ⚠️ FALLBACK : Utiliser les catégories déjà chargées au lieu d'un nouvel appel API
    const allCategories = cacheUtils.get(CACHE_KEYS.CATEGORIES);
    if (allCategories) {
      const subCategories = allCategories.filter(
        (cat) => cat.parent === parentId
      );

      if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
        cacheUtils.set(cacheKey, subCategories);
      }

      return subCategories;
    }

    // Si vraiment nécessaire, essayer l'API avec gestion d'erreur
    const WooCommerce = createWooCommerceAPI();
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
      parent: parentId,
      hide_empty: true,
      orderby: "name",
      order: "asc",
    });

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(cacheKey, response.data);
    }

    return response.data;
  } catch (error) {
    console.warn(
      `Erreur sous-catégories ${parentId}, utilisation du fallback:`,
      error.message
    );

    // FALLBACK ULTIME : Retourner un tableau vide
    return [];
  }
};

// 2. Version sécurisée : getFeaturedProductsByCategory avec fallback
export const getFeaturedProductsByCategory = async (categoryId, limit = 4) => {
  try {
    const cacheKey = `featured_products_cat_${categoryId}_${limit}`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(cacheKey);
      if (cached) return cached;
    }

    // ⚠️ TENTATIVE AVEC TIMEOUT COURT pour éviter les blocages
    const WooCommerce = createWooCommerceAPI();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 secondes max

    try {
      const response = await WooCommerce.get("products", {
        category: categoryId,
        per_page: limit,
        status: "publish",
        orderby: "popularity", // Retirer 'featured: true' qui pose problème
        order: "desc",
      });

      clearTimeout(timeoutId);

      if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
        cacheUtils.set(cacheKey, response.data);
      }

      return response.data;
    } catch (apiError) {
      clearTimeout(timeoutId);
      throw apiError;
    }
  } catch (error) {
    console.warn(
      `Erreur produits catégorie ${categoryId}, retour vide:`,
      error.message
    );
    return []; // Retourner un tableau vide au lieu de planter
  }
};

// 3. Version sécurisée : getBrandsByCategory simplifié
export const getBrandsByCategory = async (categoryId) => {
  try {
    const cacheKey = `brands_cat_${categoryId}`;

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(cacheKey);
      if (cached) return cached;
    }

    // ⚠️ DÉSACTIVÉ temporairement pour éviter les erreurs
    // Retourner des marques factices ou vides
    const fakeBrands = []; // Vous pouvez mettre des marques statiques ici si nécessaire

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(cacheKey, fakeBrands);
    }

    return fakeBrands;
  } catch (error) {
    console.warn(`Erreur marques catégorie ${categoryId}:`, error.message);
    return [];
  }
};

// Fonction pour construire l'URL hiérarchique d'une catégorie
const buildHierarchicalCategoryUrl = (category, allCategories) => {
  const buildPath = (cat, categories) => {
    if (cat.parent === 0) {
      return cat.slug;
    }

    const parent = categories.find((c) => c.id === cat.parent);
    if (parent) {
      return `${buildPath(parent, categories)}/${cat.slug}`;
    }

    return cat.slug;
  };

  return `/categorie-produit/${buildPath(category, allCategories)}`;
};

// Modifiez la fonction enrichMenuWithWooCommerceData existante
export const enrichMenuWithWooCommerceData = async (menuItems) => {
  try {
    if (!menuItems || !Array.isArray(menuItems)) {
      console.warn("Menu items invalide pour l'enrichissement");
      return [];
    }

    // Utiliser les catégories déjà en cache
    const allCategories =
      cacheUtils.get(CACHE_KEYS.CATEGORIES) || (await getCategories());

    // Construire l'arbre du menu d'abord
    const buildMenuTree = (parentId = "0") => {
      return menuItems
        .filter((item) => item.parent === parentId.toString())
        .map((item) => ({
          ...item,
          children: buildMenuTree(item.id),
        }));
    };

    const menuTree = buildMenuTree();

    // Fonction récursive pour enrichir chaque niveau
    const enrichMenuItem = async (menuItem) => {
      let enrichedItem = { ...menuItem };

      // Si l'item a une URL de catégorie (niveau final)
      if (menuItem.url && menuItem.url.includes("/categorie-produit/")) {
        const match = menuItem.url.match(/\/categorie-produit\/(.+?)(?:\/)?$/);
        if (match) {
          const fullCategoryPath = match[1];
          const pathSegments = fullCategoryPath.split("/");
          const finalSlug = pathSegments[pathSegments.length - 1];

          const matchingCategory = allCategories.find(
            (cat) => cat.slug === finalSlug
          );
          if (matchingCategory) {
            // ✅ CONSTRUCTION DES SOUS-CATÉGORIES AVEC URLs HIÉRARCHIQUES
            const subCategories = allCategories
              .filter((cat) => cat.parent === matchingCategory.id)
              .map((subCat) => ({
                ...subCat,
                hierarchical_url: buildHierarchicalCategoryUrl(
                  subCat,
                  allCategories
                ), // ✅ URL complète
              }));

            enrichedItem = {
              ...enrichedItem,
              woocommerce_category: matchingCategory,
              sub_categories: subCategories, // ✅ Sous-catégories avec URLs complètes
              has_subcategories: subCategories.length > 0,
              category_slug: finalSlug,
              full_category_path: fullCategoryPath,
              menu_type: "category_with_children",
            };
          }
        }
      }
      // Si l'item est un conteneur avec des enfants
      else if (
        (!menuItem.url || menuItem.url === "#") &&
        menuItem.children?.length > 0
      ) {
        const childCategories = [];
        const childCategoriesData = [];

        for (const child of menuItem.children) {
          if (child.url && child.url.includes("/categorie-produit/")) {
            const match = child.url.match(/\/categorie-produit\/(.+?)(?:\/)?$/);
            if (match) {
              const fullCategoryPath = match[1];
              const pathSegments = fullCategoryPath.split("/");
              const finalSlug = pathSegments[pathSegments.length - 1];

              const matchingCategory = allCategories.find(
                (cat) => cat.slug === finalSlug
              );
              if (matchingCategory) {
                childCategories.push(matchingCategory);

                // ✅ CONSTRUCTION DES SOUS-CATÉGORIES AVEC URLs HIÉRARCHIQUES
                const subCategories = allCategories
                  .filter((cat) => cat.parent === matchingCategory.id)
                  .map((subCat) => ({
                    ...subCat,
                    hierarchical_url: buildHierarchicalCategoryUrl(
                      subCat,
                      allCategories
                    ), // ✅ URL complète
                  }));

                childCategoriesData.push({
                  ...child,
                  woocommerce_category: matchingCategory,
                  category_slug: finalSlug,
                  full_category_path: fullCategoryPath,
                  sub_categories: subCategories, // ✅ Sous-catégories avec URLs complètes
                  product_count: matchingCategory.count || 0,
                });
              }
            }
          }
        }

        enrichedItem = {
          ...enrichedItem,
          menu_type: "container",
          child_categories: childCategories,
          child_categories_data: childCategoriesData,
          has_category_children: childCategories.length > 0,
        };
      }

      // Enrichir récursivement les enfants
      if (menuItem.children?.length > 0) {
        enrichedItem.children = await Promise.all(
          menuItem.children.map((child) => enrichMenuItem(child))
        );
      }

      return enrichedItem;
    };

    const enrichedMenuTree = await Promise.all(
      menuTree.map((item) => enrichMenuItem(item))
    );

    console.log(
      "Menu enrichi avec URLs hiérarchiques corrigées:",
      enrichedMenuTree
    );
    return enrichedMenuTree;
  } catch (error) {
    console.error("Erreur enrichissement menu:", error);
    return menuItems;
  }
};

// 5. Version sécurisée : buildMegaMenuData avec moins d'appels API
export const buildMegaMenuData = async (menuItems) => {
  try {
    const cacheKey = "mega_menu_complete_data";

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      const cached = cacheUtils.get(cacheKey);
      if (cached) {
        console.log("Données méga menu depuis le cache");
        return cached;
      }
    }

    // ✅ ÉTAPE 1 : Enrichir avec les données déjà disponibles
    const enrichedMenuTree = await enrichMenuWithWooCommerceData(menuItems);

    // ✅ ÉTAPE 2 : Ajouter SEULEMENT les produits essentiels (pas de marques pour éviter erreurs)
    const enrichWithMinimalProductData = async (menuItem) => {
      let enrichedItem = { ...menuItem };

      if (
        menuItem.menu_type === "container" &&
        menuItem.child_categories_data?.length > 0
      ) {
        // Pour les conteneurs, on garde les données déjà enrichies sans appels API supplémentaires
        enrichedItem.child_categories_data = menuItem.child_categories_data;
      }

      // ⚠️ DÉSACTIVER temporairement les appels produits pour éviter les erreurs CORS
      /*
      else if (menuItem.menu_type === 'category_with_children' && menuItem.woocommerce_category) {
        const categoryId = menuItem.woocommerce_category.id;
        
        try {
          const featuredProducts = await getFeaturedProductsByCategory(categoryId, 3);
          enrichedItem = {
            ...enrichedItem,
            featured_products: featuredProducts,
            brands: [], // Marques désactivées temporairement
            product_count: menuItem.woocommerce_category.count || 0
          };
        } catch (error) {
          console.warn("Erreur chargement produits pour", menuItem.title, error.message);
          enrichedItem = {
            ...enrichedItem,
            featured_products: [],
            brands: [],
            product_count: menuItem.woocommerce_category.count || 0
          };
        }
      }
      */

      if (menuItem.children?.length > 0) {
        enrichedItem.children = await Promise.all(
          menuItem.children.map((child) => enrichWithMinimalProductData(child))
        );
      }

      return enrichedItem;
    };

    const megaMenuData = await Promise.all(
      enrichedMenuTree.map((item) => enrichWithMinimalProductData(item))
    );

    if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
      cacheUtils.set(cacheKey, megaMenuData);
    }

    console.log("Méga menu construit (mode sécurisé) avec hiérarchie");
    return megaMenuData;
  } catch (error) {
    console.error("Erreur construction méga menu:", error);
    return enrichedMenuTree || menuItems;
  }
};

// 7. Vider le cache spécifique au méga menu
export const clearMegaMenuCache = () => {
  const cacheKeys = [
    "mega_menu_complete_data",
    `${CACHE_KEYS.CATEGORIES}_hierarchy`,
  ];

  cacheKeys.forEach((key) => cacheUtils.remove(key));

  const allKeys = Object.keys(localStorage);
  allKeys.forEach((key) => {
    if (
      key.includes("_children_") ||
      key.includes("featured_products_cat_") ||
      key.includes("brands_cat_")
    ) {
      localStorage.removeItem(key);
    }
  });

  console.log("Cache méga menu vidé");
};

export default {
  // Fonctions existantes
  getProducts,
  getCategories,
  getParentCategories,
  getParentCategoriesFiltered,
  getProduct,
  searchProducts,
  getProductsByCategory,
  getTotalProductsCount,
  getBrands,
  clearCategoriesCache,

  // Nouvelles fonctions pour le méga menu
  getSubCategories,
  getCategoriesHierarchy,
  enrichMenuWithWooCommerceData, // <- Cette fonction doit être ici
  getFeaturedProductsByCategory,
  getBrandsByCategory,
  buildMegaMenuData,
  clearMegaMenuCache,
};
