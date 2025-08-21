// Utilitaires pour la gestion du cache
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures

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
};

export const CACHE_KEYS = {
  MENU: "axemusique_menu",
  CATEGORIES: "axemusique_categories",
  SITE_DATA: "axemusique_site_data",
};
