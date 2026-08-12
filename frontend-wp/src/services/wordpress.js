// src/services/wordpress.js

import axios from "axios";
import { API_CONFIG, DEFAULT_DATA } from "../utils/constants";
import { cacheUtils, CACHE_KEYS, activeMenuCacheKey } from "../utils/cache";
import { loadPublishedMenu } from "./published-menu";

// Configuration axios
const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  auth:
    API_CONFIG.auth.username && API_CONFIG.auth.password
      ? {
          username: API_CONFIG.auth.username,
          password: API_CONFIG.auth.password,
        }
      : undefined,
  headers: {
    "Content-Type": "application/json",
  },
});

// Service WordPress
export const wordpressService = {
  // Charger les données du site
  async loadSiteData() {
    try {
      const cached = cacheUtils.get(CACHE_KEYS.SITE_DATA);
      if (cached) return cached;

      const response = await api.get("/site-data");
      cacheUtils.set(CACHE_KEYS.SITE_DATA, response.data);
      return response.data;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Endpoint site-data non disponible");
      }
      return DEFAULT_DATA.siteData;
    }
  },

  // Charger le menu depuis WordPress. Historique, inchangé.
  async loadMenuFromWordPress() {
    const response = await api.get("/menus");

    // Extraire le menu "main" si disponible
    let finalMenuData = response.data;
    if (response.data && response.data.main) {
      finalMenuData = response.data.main;
    } else if (response.data && typeof response.data === "object") {
      // Prendre le premier menu disponible
      const firstMenuKey = Object.keys(response.data)[0];
      if (firstMenuKey) {
        finalMenuData = response.data[firstMenuKey];
      }
    }

    return finalMenuData;
  },

  /**
   * Charger le menu — ticket 8.
   *
   * Trois changements par rapport à la version précédente, à traiter ensemble
   * parce qu'ils se tiennent :
   *
   * 1. LA SOURCE est choisie par `API_CONFIG.usePublishedMenu`, par défaut
   *    WordPress. Basculer ne demande qu'une variable d'environnement.
   *
   * 2. LE CACHE EST PROPRE À LA SOURCE. Sans ça, basculer le drapeau laisserait
   *    les visiteurs au cache chaud sur l'ancien menu jusqu'à 24 h — la bascule
   *    semblerait sans effet (faille 3.6). Deux clés distinctes rendent le
   *    changement immédiat, et permettent de revenir en arrière sans perdre le
   *    cache de l'autre source. Aucune purge à écrire.
   *
   * 3. L'ÉCHEC NE REMONTE PLUS. `loadMenu()` faisait `throw`, ce qui cassait la
   *    navigation dès que WordPress était indisponible (faille 3.4), alors
   *    qu'un repli existait sans être branché. Il l'est ici, et il sert aussi
   *    au refus d'une `contractVersion` inconnue (§5 du contrat).
   */
  async loadMenu() {
    const usePublished = API_CONFIG.usePublishedMenu;
    const cacheKey = activeMenuCacheKey();
    const cacheEnabled = import.meta.env.VITE_DISABLE_CACHE !== "true";

    try {
      const cached = cacheEnabled ? cacheUtils.get(cacheKey) : null;
      if (cached) return cached;

      const menuData = usePublished
        ? await loadPublishedMenu()
        : await this.loadMenuFromWordPress();

      if (cacheEnabled) {
        cacheUtils.set(cacheKey, menuData);
      }

      return menuData;
    } catch (error) {
      // Le repli n'est pas silencieux : sans ce message, un menu de secours
      // ressemble à un menu mal configuré.
      console.warn(
        `Menu (source : ${usePublished ? "PocketApp" : "WordPress"}) non récupéré, repli sur le menu par défaut :`,
        error.message,
      );
      return DEFAULT_DATA.menus;
    }
  },

  // Tester la connexion API
  async testConnection() {
    try {
      const response = await api.get("/");
      return response.data;
    } catch (error) {
      throw new Error("API WordPress non accessible");
    }
  },
};
