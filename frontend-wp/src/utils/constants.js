// Configuration de l'API
export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_WP_API_URL || "https://axemusique.shop/wp-json/wp/v2",
  siteURL: import.meta.env.VITE_WP_SITE_URL || "https://axemusique.shop",
  timeout: 30000,
  // Supprimé isDevMode - plus besoin
  useReactCategories: import.meta.env.VITE_USE_REACT_CATEGORIES === "true",
  useReactProducts: import.meta.env.VITE_USE_REACT_PRODUCTS === "true",

  // ─── Source du menu de navigation (ticket 8) ───────────────────────────
  // `false` = WordPress (`/wp-json/wp/v2/menus`), le comportement historique.
  // `true`  = fichier publié par PocketApp.
  //
  // PAR DÉFAUT SUR WORDPRESS, et la variable absente vaut `false` : déployer ce
  // build ne change donc rien en production. Le retour arrière est une variable
  // d'environnement et un rebuild — pas une restauration de fichiers, qui
  // n'existe pas ici (le site part par FTP sans retour arrière).
  usePublishedMenu: import.meta.env.VITE_USE_PUBLISHED_MENU === "true",

  // URL du menu publié. Même origine que le site en production, donc aucune
  // question de CORS ; en développement, le proxy de `vite.config.js` s'en
  // charge — le fichier est servi SANS en-tête `Access-Control-Allow-Origin`,
  // contrairement à `/wp-json`.
  publishedMenuUrl:
    import.meta.env.VITE_PUBLISHED_MENU_URL || "/data/menu.json",

  // ─── Catalogue Axe Musique (base SQL alimentée par PocketApp) ────────────
  // `false` = le site ne lit que WooCommerce, comportement historique.
  // `true`  = la section catalogue de la page d'accueil lit NOTRE base.
  //
  // PAR DÉFAUT SUR WOOCOMMERCE, comme le drapeau du menu : déployer ce build
  // ne change rien tant que la variable est absente. Même raison qu'au ticket
  // 8 — le site part par FTP, sans retour arrière possible.
  useAxeCatalog: import.meta.env.VITE_USE_AXE_CATALOG === "true",

  // Endpoint PUBLIC de lecture du catalogue. Aucune clé : le bundle est
  // public, et y mettre un secret serait refaire la faille des clés
  // WooCommerce. Même origine en production ; en développement, le proxy de
  // `vite.config.js` s'en charge.
  axeCatalogUrl:
    import.meta.env.VITE_AXE_CATALOG_URL || "/server/api/catalog.php",
  auth: {
    username: import.meta.env.VITE_WP_USER,
    password: import.meta.env.VITE_WP_APP_PASSWORD,
  },
};

// Données par défaut
export const DEFAULT_DATA = {
  siteData: {
    site_title: "Axe Musique",
    site_description: "Votre magasin de musique en ligne",
    logo: null,
    contact_info: {
      email: "contact@axemusique.shop",
      phone: "",
    },
  },

  // ─── Menu de repli (ticket 8) ────────────────────────────────────────────
  // Sert quand les DEUX sources échouent — WordPress en maintenance, fichier
  // publié absent ou de version inconnue. Sans lui, la navigation du site
  // disparaît (faille 3.4 de l'audit).
  //
  // Il était présent avant ce ticket mais INOPÉRANT, pour deux raisons qui
  // valent d'être connues :
  //
  //   1. sa forme était `{main: {name, items}}` alors que le seul consommateur,
  //      `Header.jsx:39`, lit `menus?.items` — le repli rendait donc
  //      `undefined`, c'est-à-dire un menu vide ;
  //   2. `parent: 0` (nombre) ne correspondait pas au `item.parent === "0"`
  //      (chaîne) de `useNavigation.js:111`, et ses URL — `/categorie/guitares`,
  //      `/boutique` — ne correspondent à AUCUNE route de `App.jsx`.
  //
  // Il est donc réécrit, pas branché : forme aplatie, parents en chaîne, et
  // uniquement des URL qui existent réellement.
  menus: {
    name: "Menu Principal",
    items: [
      { id: "1", title: "Accueil", url: "/", parent: "0" },
      { id: "2", title: "Boutique", url: "/shop", parent: "0" },
      { id: "3", title: "Bons plans", url: "/bons-plans", parent: "0" },
      { id: "4", title: "Mentions légales", url: "/mentions-legales", parent: "0" },
    ],
  },

  categories: [
    { id: 1, name: "Guitares", slug: "guitares", count: 15 },
    { id: 2, name: "Pianos", slug: "pianos", count: 8 },
    { id: 3, name: "Batterie", slug: "batterie", count: 12 },
  ],

  loading: {
    initial: true,
    menus: true,
    products: true,
    categories: true,
    siteData: true,
  },
};

// Produits fallback
export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Trompette SiB Professionnelle",
    regular_price: "1299.99",
    sale_price: "999.99",
    on_sale: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      },
    ],
    stock_status: "instock",
  },
  {
    id: 2,
    name: "Guitare Classique",
    regular_price: "449.99",
    sale_price: "",
    on_sale: false,
    images: [
      {
        src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
      },
    ],
    stock_status: "instock",
  },
  {
    id: 3,
    name: "Piano Numérique 88 touches",
    regular_price: "2499.99",
    sale_price: "1999.99",
    on_sale: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
      },
    ],
    stock_status: "instock",
  },
  {
    id: 4,
    name: "Violon 4/4 avec archet",
    regular_price: "899.99",
    sale_price: "",
    on_sale: false,
    images: [
      {
        src: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400",
      },
    ],
    stock_status: "instock",
  },
  {
    id: 5,
    name: "Batterie Acoustique Complète",
    regular_price: "1899.99",
    sale_price: "1599.99",
    on_sale: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400",
      },
    ],
    stock_status: "instock",
  },
  {
    id: 6,
    name: "Microphone Studio",
    regular_price: "349.99",
    sale_price: "",
    on_sale: false,
    images: [
      {
        src: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400",
      },
    ],
    stock_status: "instock",
  },
];
