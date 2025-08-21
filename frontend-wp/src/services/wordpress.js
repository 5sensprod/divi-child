// src/services/wordpress.js

import axios from "axios";
import { API_CONFIG, DEFAULT_DATA } from "../utils/constants";
import { cacheUtils, CACHE_KEYS } from "../utils/cache";

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

  // Charger le menu
  async loadMenu() {
    try {
      const cached =
        import.meta.env.VITE_DISABLE_CACHE !== "true"
          ? cacheUtils.get(CACHE_KEYS.MENU)
          : null;
      if (cached) return cached;

      // Utiliser directement l'endpoint qui fonctionne
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

      // Sauvegarder en cache si activé
      if (import.meta.env.VITE_DISABLE_CACHE !== "true") {
        cacheUtils.set(CACHE_KEYS.MENU, finalMenuData);
      }

      return finalMenuData;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Menu WordPress non récupéré:", error.message);
      }
      throw error;
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
