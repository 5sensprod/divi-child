// src/hooks/useWordPressData.js

import { useState, useEffect } from "react";
import { getProducts } from "../services/woocommerce";
import { wordpressService } from "../services/wordpress";
import { DEFAULT_DATA, FALLBACK_PRODUCTS } from "../utils/constants";
import { cacheUtils, CACHE_KEYS } from "../utils/cache";

// Hook pour gérer les données WordPress (sans UI)
export const useWordPressData = () => {
  const [data, setData] = useState({
    ...DEFAULT_DATA,
    products: [],
    error: null,
  });

  useEffect(() => {
    const initializeApp = async () => {
      // Chargement immédiat du cache
      const cachedMenu = cacheUtils.get(CACHE_KEYS.MENU);
      if (cachedMenu) {
        setData((prev) => ({
          ...prev,
          menus: cachedMenu,
          loading: { ...prev.loading, menus: false, initial: false },
        }));
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

        // Charger toutes les données en parallèle
        const [siteDataResult, menuDataResult, productsResult] =
          await Promise.allSettled([
            wordpressService.loadSiteData(),
            wordpressService.loadMenu(),
            getProducts({ per_page: 20 }),
          ]);
        console.log("Menu structure:", menuDataResult.value);

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
          loading: {
            initial: false,
            menus: false,
            products: false,
            categories: false,
            siteData: false,
          },
          error: null,
        }));
      } catch (error) {
        // Fallback complet en cas d'erreur
        setData((prev) => ({
          ...prev,
          products: FALLBACK_PRODUCTS,
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
  };

  return { ...data, actions };
};
