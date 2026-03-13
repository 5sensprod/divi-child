// src/hooks/useWordPressData.js

import { useState, useEffect } from "react";
import {
  getProducts,
  getCategories,
  getBrands,
  enrichProductsWithBrandImages,
} from "../services/woocommerce";
import { wordpressService } from "../services/wordpress";
import { DEFAULT_DATA, FALLBACK_PRODUCTS } from "../utils/constants";
import { cacheUtils, CACHE_KEYS } from "../utils/cache";

// Hook pour gérer les données WordPress (sans UI)
export const useWordPressData = () => {
  const [data, setData] = useState({
    ...DEFAULT_DATA,
    products: [],
    categories: [],
    parentCategories: [],
    brands: [],
    error: null,
  });

  useEffect(() => {
    const initializeApp = async () => {
      // Chargement immédiat du cache pour le menu ET les catégories
      const cachedMenu = cacheUtils.get(CACHE_KEYS.MENU);
      const cachedCategories =
        import.meta.env.VITE_DISABLE_CACHE !== "true"
          ? cacheUtils.get(CACHE_KEYS.CATEGORIES)
          : null;

      // Filtrer les catégories parentes du cache si disponibles
      const cachedParentCategories = cachedCategories
        ? cachedCategories.filter((cat) => cat.parent === 0)
        : null;

      // Mise à jour immédiate avec les données en cache
      if (cachedMenu || cachedCategories) {
        setData((prev) => ({
          ...prev,
          menus: cachedMenu || prev.menus,
          categories: cachedCategories || prev.categories,
          parentCategories: cachedParentCategories || prev.parentCategories,
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
        console.log("Catégories parentes en cache:", !!cachedParentCategories);
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
        // Ne pas bloquer si testConnection échoue
        let wordpressAvailable = true;
        try {
          await wordpressService.testConnection();
        } catch (error) {
          console.warn(
            "⚠️ API WordPress non accessible, mode WooCommerce uniquement",
          );
          wordpressAvailable = false;
        }

        // Charger toutes les données en parallèle
        const promises = [
          getProducts({ per_page: 20 }),
          getCategories(),
          getBrands(),
        ];

        // N'ajouter les promesses WordPress que si l'API est disponible
        if (wordpressAvailable) {
          promises.push(
            wordpressService.loadSiteData(),
            wordpressService.loadMenu(),
          );
        }

        const results = await Promise.allSettled(promises);

        // Extraire les résultats
        const productsResult = results[0];
        const categoriesResult = results[1];
        const brandsResult = results[2];
        const siteDataResult = wordpressAvailable
          ? results[3]
          : { status: "rejected" };
        const menuDataResult = wordpressAvailable
          ? results[4]
          : { status: "rejected" };

        // Filtrer les catégories parentes côté client
        const allCategories =
          categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
        const parentCats = allCategories.filter((cat) => cat.parent === 0);

        // Marques
        const allBrands =
          brandsResult.status === "fulfilled" ? brandsResult.value : [];

        // Enrichir les produits avec les images de marques
        const productsRaw =
          productsResult.status === "fulfilled"
            ? productsResult.value
            : FALLBACK_PRODUCTS;
        const products = enrichProductsWithBrandImages(productsRaw, allBrands);

        console.log("=== RÉSULTATS DU CHARGEMENT ===");
        console.log("Menu structure:", menuDataResult.value);
        console.log("Categories loaded:", allCategories.length);
        console.log("Parent categories:", parentCats.length);
        console.log("Brands loaded:", allBrands.length);
        // ← ajoute ici
        console.log("BRANDS MAP SIZE:", allBrands.length);
        console.log("PREMIER PRODUIT BRAND:", products[0]?.brands?.[0]);

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
          products,
          categories: allCategories,
          parentCategories: parentCats,
          brands: allBrands,
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
      } catch (error) {
        // Fallback complet en cas d'erreur
        console.error("=== ERREUR LORS DU CHARGEMENT ===", error);
        setData((prev) => ({
          ...prev,
          products: FALLBACK_PRODUCTS,
          categories: prev.categories.length > 0 ? prev.categories : [],
          parentCategories:
            prev.parentCategories.length > 0 ? prev.parentCategories : [],
          brands: prev.brands.length > 0 ? prev.brands : [],
          loading: {
            initial: false,
            menus: false,
            products: false,
            categories: false,
            siteData: false,
          },
          error: null,
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
        error: null,
      }));
    };

    initializeApp();
  }, []);

  // Méthodes utilitaires pour interagir avec les données
  const actions = {
    clearAllCache: () => {
      cacheUtils.remove(CACHE_KEYS.MENU);
      cacheUtils.remove(CACHE_KEYS.CATEGORIES);
      cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent`);
      cacheUtils.remove(`${CACHE_KEYS.CATEGORIES}_parent_filtered`);
      cacheUtils.remove(CACHE_KEYS.SITE_DATA);
      cacheUtils.remove("axemusique_brands_all");
      console.log("Tout le cache a été vidé");
    },
  };

  return { ...data, actions };
};
