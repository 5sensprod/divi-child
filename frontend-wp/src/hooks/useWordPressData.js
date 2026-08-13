// src/hooks/useWordPressData.js

import { useState, useEffect } from "react";
import {
  getProducts,
  getCategories,
  getBrands,
  enrichProductsWithBrandImages,
} from "../services/woocommerce";
import { wordpressService } from "../services/wordpress";
import {
  API_CONFIG,
  DEFAULT_DATA,
  FALLBACK_PRODUCTS,
} from "../utils/constants";
import { cacheUtils, CACHE_KEYS, activeMenuCacheKey } from "../utils/cache";

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
      // Affichage immédiat depuis le cache — DE LA SOURCE COURANTE (ticket 8).
      // Lire `CACHE_KEYS.MENU` en dur ferait apparaître le menu WordPress au
      // premier rendu même quand le site est basculé sur le menu publié, le
      // temps que la requête retombe. Un menu qui change sous les yeux du
      // visiteur, et un doute permanent sur ce que la bascule a réellement fait.
      const cachedMenu = cacheUtils.get(activeMenuCacheKey());
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
        // ─── Le menu part en premier, et s'affiche seul ────────────────────
        //
        // Mesuré le 10 août 2026 : le menu publié arrive en 0,13 s, les marques
        // en 1,64 s, les catégories en ~2 s. Attendre `Promise.allSettled` pour
        // TOUT afficher faisait patienter le menu ~2,5 s derrière des données
        // qu'il n'utilise pas.
        //
        // `loadMenu()` a son propre repli et ne lève jamais : le `.catch` final
        // est une ceinture, pas un cas prévu.
        wordpressService
          .loadMenu()
          .then((menuData) => {
            setData((prev) => ({
              ...prev,
              menus: menuData,
              loading: { ...prev.loading, menus: false },
            }));
          })
          .catch((error) => {
            console.error("Menu : échec inattendu du chargement", error);
          });

        // ─── testConnection : seulement quand WordPress sert encore ────────
        //
        // Il coûte 0,64 s EN SÉRIE avant tout le reste, et télécharge 328 Ko
        // d'index `wp-json` que personne ne lit. Son seul rôle est de décider
        // s'il faut interroger WordPress pour le menu — question sans objet
        // quand la source est le fichier publié.
        //
        // `loadSiteData()` reste appelé dans tous les cas : il a son propre
        // repli et ne lève jamais.
        let wordpressAvailable = true;
        if (!API_CONFIG.usePublishedMenu) {
          try {
            await wordpressService.testConnection();
          } catch (error) {
            console.warn(
              "⚠️ API WordPress non accessible, mode WooCommerce uniquement",
            );
            wordpressAvailable = false;
          }
        }

        // ─── Les trois appels WooCommerce, coupés sous `useAxeCatalog` ─────
        //
        // Neutralisé plutôt que réécrit : ce hook n'a plus de consommateur sous
        // le drapeau — `BrandCarousel`, `AnimatedStats` et `ProductFilter` sont
        // masqués (`Home.jsx`), la recherche passe par `AxeSearch`. Les laisser
        // partir, c'est trois requêtes WooCommerce par chargement de page, avec
        // les clés du bundle, pour un résultat que plus personne n'affiche.
        //
        // Le menu et `siteData` restent : ils viennent de WordPress, pas de
        // WooCommerce, et le site vitrine en a toujours besoin.
        const promises = API_CONFIG.useAxeCatalog
          ? [Promise.resolve([]), Promise.resolve([]), Promise.resolve([])]
          : [getProducts({ per_page: 20 }), getCategories(), getBrands()];

        if (wordpressAvailable) {
          promises.push(wordpressService.loadSiteData());
        }

        const results = await Promise.allSettled(promises);

        // Extraire les résultats
        const productsResult = results[0];
        const categoriesResult = results[1];
        const brandsResult = results[2];
        const siteDataResult = wordpressAvailable
          ? results[3]
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
          // `menus` n'est volontairement PAS repris ici : il est posé par sa
          // propre promesse, plus tôt. Le réécrire depuis `prev` risquerait
          // d'annuler un menu déjà affiché si les deux se croisaient.
          products,
          categories: allCategories,
          parentCategories: parentCats,
          brands: allBrands,
          loading: {
            ...prev.loading,
            initial: false,
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
      // Les DEUX menus, pas seulement celui de la source courante : « vider
      // tout le cache » doit tenir sa promesse même après une bascule.
      cacheUtils.remove(CACHE_KEYS.MENU);
      cacheUtils.remove(CACHE_KEYS.MENU_PUBLISHED);
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
