// Utilitaires pour la gestion du cache
import { API_CONFIG } from "./constants";
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures
const SEARCH_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes pour la recherche

export const cacheUtils = {
  // Récupérer du cache
  get: (key) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      const isValid = Date.now() - timestamp < CACHE_DURATION;
      if (isValid) {
        return data;
      } else {
        localStorage.removeItem(key);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  },

  // Sauvegarder en cache
  set: (key, data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Erreur sauvegarde cache:", error);
      }
    }
  },

  // Supprimer du cache
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      // Ignorer les erreurs de suppression
    }
  },

  // === NOUVELLES MÉTHODES POUR LA RECHERCHE ===

  // Récupérer du cache avec TTL personnalisé
  getWithTTL: (key, customTTL = CACHE_DURATION) => {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const isValid = Date.now() - timestamp < customTTL;

      if (isValid) {
        return data;
      } else {
        localStorage.removeItem(key);
        return null;
      }
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  },

  // Sauvegarder en cache avec TTL personnalisé (pas de TTL stocké, juste pour clarté)
  setWithTTL: (key, data, customTTL = CACHE_DURATION) => {
    // Note: On ne stocke pas le TTL, on l'utilise juste comme documentation
    // Le TTL sera passé lors du getWithTTL
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Erreur sauvegarde cache:", error);
      }
    }
  },

  // Nettoyer le cache de recherche (utile pour libérer l'espace)
  clearSearchCache: () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(CACHE_KEYS.SEARCH_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn("Erreur nettoyage cache recherche:", error);
      }
    }
  },

  // Vérifier la taille du cache (optionnel, pour monitoring)
  getCacheSize: () => {
    try {
      let total = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage.getItem(key).length;
        }
      }
      return Math.round(total / 1024); // Retourne en KB
    } catch (error) {
      return 0;
    }
  },
};

export const CACHE_KEYS = {
  MENU: "axemusique_menu",
  // Menu publié par PocketApp — clé DISTINCTE de MENU, et c'est le mécanisme
  // d'invalidation à la bascule (ticket 8) : changer de source change de clé,
  // donc le cache de l'autre source n'est jamais resservi. Revenir en arrière
  // retrouve le sien. Aucune purge à écrire.
  MENU_PUBLISHED: "axemusique_menu_published",
  CATEGORIES: "axemusique_categories",
  SITE_DATA: "axemusique_site_data",
  PRODUCTS: "axemusique_products",
  // Nouveaux keys pour la recherche
  SEARCH_PREFIX: "axemusique_search_", // Préfixe pour les recherches
  RECENT_SEARCHES: "axemusique_recent_searches", // Historique des recherches
  POPULAR_PRODUCTS: "axemusique_popular_products", // Produits populaires pour suggestions
};

/**
 * Clé de cache du menu de la source ACTIVE (ticket 8).
 *
 * Un seul endroit décide, pour que personne n'écrive `CACHE_KEYS.MENU` en dur
 * et ne réintroduise le menu WordPress dans un site basculé.
 */
export const activeMenuCacheKey = () =>
  API_CONFIG.usePublishedMenu ? CACHE_KEYS.MENU_PUBLISHED : CACHE_KEYS.MENU;

// Constantes pour les durées de cache
export const CACHE_DURATIONS = {
  DEFAULT: CACHE_DURATION,
  SEARCH: SEARCH_CACHE_DURATION,
  POPULAR_PRODUCTS: 60 * 60 * 1000, // 1 heure
  RECENT_SEARCHES: 7 * 24 * 60 * 60 * 1000, // 7 jours
};
