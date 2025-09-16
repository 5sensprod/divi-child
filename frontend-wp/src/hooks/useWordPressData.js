// src/hooks/useWordPressData.js

import { useState, useEffect } from "react";
import { getProducts, getParentCategories } from "../services/woocommerce";
import { wordpressService } from "../services/wordpress";
import { DEFAULT_DATA, FALLBACK_PRODUCTS } from "../utils/constants";
import { cacheUtils, CACHE_KEYS } from "../utils/cache";

// Hook pour gérer les données WordPress (sans UI)
export const useWordPressData = () => {
  const [data, setData] = useState({
    ...DEFAULT_DATA,
    products: [],
    categories: [], // ← Ajout des catégories dans le state initial
    error: null,
  });

  useEffect(() => {
    const initializeApp = async () => {
      // Chargement immédiat du cache pour le menu ET les catégories
      const cachedMenu = cacheUtils.get(CACHE_KEYS.MENU);
      const cachedCategories =
        import.meta.env.VITE_DISABLE_CACHE !== "true"
          ? cacheUtils.get(`${CACHE_KEYS.CATEGORIES}_parent`)
          : null;

      // Mise à jour immédiate avec les données en cache
      if (cachedMenu || cachedCategories) {
        setData((prev) => ({
          ...prev,
          menus: cachedMenu || prev.menus,
          categories: cachedCategories || prev.categories,
          loading: {
            ...prev.loading,
            menus: !cachedMenu,
            categories: !cachedCategories,
            initial: false,
          },
        }));

        console.log("=== CHARGEMENT DEPUIS LE CACHE ===");
        console.log("Menu en cache:", !!cachedMenu);
        console.log("Catégories en cache:", !!cachedCategories);
      } else {
        setData((prev) => ({
          ...prev,
          loading: { ...prev.loading, initial: false },
        }));
      }

      try {
        await loadProductionData();
      } catch (error) {
        handleError(error);
      }
    };

    const loadProductionData = async () => {
      try {
        // Tester la connexion WordPress
        await wordpressService.testConnection();

        // Charger toutes les données en parallèle - AJOUT DES CATÉGORIES PARENTES
        const [
          siteDataResult,
          menuDataResult,
          productsResult,
          categoriesResult,
        ] = await Promise.allSettled([
          wordpressService.loadSiteData(),
          wordpressService.loadMenu(),
          getProducts({ per_page: 20 }),
          getParentCategories(), // ← Utilisation des catégories parentes avec cache
        ]);

        console.log("=== RÉSULTATS DU CHARGEMENT ===");
        console.log("Menu structure:", menuDataResult.value);
        console.log("Categories loaded:", categoriesResult.value); // ← Log pour vérifier

        // Mise à jour du state avec les résultats
        setData((prev) => ({
          ...prev,
          siteData:
            siteDataResult.status === "fulfilled"
              ? siteDataResult.value
              : DEFAULT_DATA.siteData,
          menus:
            menuDataResult.status === "fulfilled"
              ? menuDataResult.value
              : prev.menus,
          products:
            productsResult.status === "fulfilled"
              ? productsResult.value
              : FALLBACK_PRODUCTS,
          categories:
            categoriesResult.status === "fulfilled"
              ? categoriesResult.value
              : prev.categories, // ← Conserver les catégories en cache si l'API échoue
          loading: {
            initial: false,
            menus: false,
            products: false,
            categories: false,
            siteData: false,
          },
          error: null,
        }));

        console.log("=== CHARGEMENT TERMINÉ ===");
        console.log("Catégories finales:", categoriesResult.value?.length || 0);
      } catch (error) {
        // Fallback complet en cas d'erreur
        console.error("=== ERREUR LORS DU CHARGEMENT ===", error);
        setData((prev) => ({
          ...prev,
          products: FALLBACK_PRODUCTS,
          // Ne pas écraser les catégories en cache en cas d'erreur
          categories: prev.categories.length > 0 ? prev.categories : [],
          loading: {
            initial: false,
            menus: false,
            products: false,
            categories: false,
            siteData: false,
          },
          error: "Erreur de connexion à WordPress",
        }));
      }
    };

    const handleError = (error) => {
      if (import.meta.env.DEV) {
        console.error("Erreur WordPress:", error);
      }

      setData((prev) => ({
        ...prev,
        loading: {
          initial: false,
          menus: false,
          products: false,
          categories: false,
          siteData: false,
        },
        error: "Erreur de connexion à WordPress.",
      }));
    };

    initializeApp();
  }, []);

  // Méthodes utilitaires pour interagir avec les données
  const actions = {
    // Recharger les produits
    reloadProducts: async () => {
      setData((prev) => ({
        ...prev,
        loading: { ...prev.loading, products: true },
      }));

      try {
        const products = await getProducts({ per_page: 20 });
        setData((prev) => ({
          ...prev,
          products,
          loading: { ...prev.loading, products: false },
        }));
      } catch (error) {
        setData((prev) => ({
          ...prev,
          products: FALLBACK_PRODUCTS,
          loading: { ...prev.loading, products: false },
        }));
      }
    },

    // Recharger les catégories AVEC gestion du cache
    reloadCategories: async (forceRefresh = false) => {
      setData((prev) => ({
        ...prev,
        loading: { ...prev.loading, categories: true },
      }));

      try {
        // Si forceRefresh, vider le cache d'abord
        if (forceRefresh) {
          const { clearCategoriesCache } = await import(
            "../services/woocommerce"
          );
          clearCategoriesCache();
        }

        const categories = await getParentCategories();
        setData((prev) => ({
          ...prev,
          categories,
          loading: { ...prev.loading, categories: false },
        }));

        console.log("Catégories rechargées:", categories.length);
      } catch (error) {
        console.error("Erreur rechargement catégories:", error);
        setData((prev) => ({
          ...prev,
          categories: prev.categories, // Conserver les catégories existantes
          loading: { ...prev.loading, categories: false },
        }));
      }
    },

    // Rechercher des produits
    searchProducts: async (searchTerm) => {
      setData((prev) => ({
        ...prev,
        loading: { ...prev.loading, products: true },
      }));

      try {
        const { searchProducts } = await import("../services/woocommerce");
        const products = await searchProducts(searchTerm);
        setData((prev) => ({
          ...prev,
          products,
          loading: { ...prev.loading, products: false },
        }));
      } catch (error) {
        setData((prev) => ({
          ...prev,
          loading: { ...prev.loading, products: false },
        }));
      }
    },

    // Charger des produits par catégorie
    loadProductsByCategory: async (categoryId) => {
      setData((prev) => ({
        ...prev,
        loading: { ...prev.loading, products: true },
      }));

      try {
        const { getProductsByCategory } = await import(
          "../services/woocommerce"
        );
        const products = await getProductsByCategory(categoryId);
        setData((prev) => ({
          ...prev,
          products,
          loading: { ...prev.loading, products: false },
        }));
      } catch (error) {
        setData((prev) => ({
          ...prev,
          loading: { ...prev.loading, products: false },
        }));
      }
    },

    // Nouvelle méthode pour vider tout le cache
    clearAllCache: () => {
      cacheUtils.remove(CACHE_KEYS.MENU);
      cacheUtils.remove(CACHE_KEYS.CATEGORIES);
      cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent`);
      cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent_filtered`);
      cacheUtils.remove(CACHE_KEYS.SITE_DATA);
      console.log("Tout le cache a été vidé");
    },
  };

  return { ...data, actions };
};
