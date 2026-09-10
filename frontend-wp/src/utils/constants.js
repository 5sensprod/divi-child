// ─── Configuration du site ────────────────────────────────────────────────────
// Depuis le 10 septembre 2026, WordPress et WooCommerce sont retirés du site.
// Il n'y a plus d'URL `wp-json`, plus d'identifiants WordPress, plus de clés
// WooCommerce et plus de drapeaux de bascule : deux sources, toutes deux
// alimentées par PocketApp.
export const API_CONFIG = {
  timeout: 30000,

  // Menu publié par PocketApp. Même origine que le site en production, donc
  // aucune question de CORS ; en développement, le proxy de `vite.config.js`
  // s'en charge.
  publishedMenuUrl:
    import.meta.env.VITE_PUBLISHED_MENU_URL || "/data/menu.json",

  // Endpoint PUBLIC de lecture du catalogue. Aucune clé : le bundle est
  // public, et y mettre un secret serait refaire la faille des clés
  // WooCommerce. Même origine en production ; en développement, le proxy de
  // `vite.config.js` s'en charge.
  axeCatalogUrl:
    import.meta.env.VITE_AXE_CATALOG_URL || "/server/api/catalog.php",
};

// Titre et accroche du site. Venaient de l'endpoint WordPress `site-data`,
// qui se rabattait de toute façon sur ces valeurs.
export const SITE_INFO = {
  title: "Axe Musique",
  description: "Votre magasin de musique en ligne",
};

// ─── Menu de secours ──────────────────────────────────────────────────────────
// Servi quand `/data/menu.json` est absent, illisible ou d'une version
// inconnue. Sans lui, la navigation du site disparaît. Uniquement des URL qui
// existent réellement dans `App.jsx`, parents en chaîne `"0"` à la racine.
export const DEFAULT_MENU = {
  name: "Menu Principal",
  items: [
    { id: "1", title: "Accueil", url: "/", parent: "0" },
    { id: "2", title: "Boutique", url: "/shop", parent: "0" },
    { id: "4", title: "Mentions légales", url: "/mentions-legales", parent: "0" },
  ],
};
