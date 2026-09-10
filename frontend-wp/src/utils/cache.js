// Utilitaires pour la gestion du cache
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
  // Menu publié par PocketApp — seule source du menu (`services/menu.js`).
  MENU_PUBLISHED: "axemusique_menu_published",
  // Nouveaux keys pour la recherche
  SEARCH_PREFIX: "axemusique_search_", // Préfixe pour les recherches
  RECENT_SEARCHES: "axemusique_recent_searches", // Historique des recherches
  POPULAR_PRODUCTS: "axemusique_popular_products", // Produits populaires pour suggestions
};

// Constantes pour les durées de cache
export const CACHE_DURATIONS = {
  DEFAULT: CACHE_DURATION,
  // Menu publié par PocketApp : 5 minutes, et non 24 h. Le fichier pèse
  // quelques Ko et est déjà demandé en `no-store` (published-menu.js) ; avec
  // 24 h, une publication restait invisible une journée pour tout visiteur
  // déjà venu — constaté le 10 septembre 2026. Vérifié À LA LECTURE
  // (`getWithTTL`) : une copie écrite sous l'ancienne règle expire d'elle-même.
  MENU_PUBLISHED: 5 * 60 * 1000,
  SEARCH: SEARCH_CACHE_DURATION,
  POPULAR_PRODUCTS: 60 * 60 * 1000, // 1 heure
  RECENT_SEARCHES: 7 * 24 * 60 * 60 * 1000, // 7 jours
};
