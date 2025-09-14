// Configuration de l'API
export const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_WP_API_URL || "https://axemusique.shop/wp-json/wp/v2",
  siteURL: import.meta.env.VITE_WP_SITE_URL || "https://axemusique.shop",
  timeout: 30000,
  // Supprimé isDevMode - plus besoin
  useReactCategories: import.meta.env.VITE_USE_REACT_CATEGORIES === "true",
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

  menus: {
    main: {
      name: "Menu Principal",
      items: [
        { id: 1, title: "Accueil", url: "/", parent: 0 },
        { id: 2, title: "Boutique", url: "/boutique", parent: 0 },
        { id: 3, title: "Instruments", url: "#", parent: 0 }, // Parent
        { id: 4, title: "Guitares", url: "/categorie/guitares", parent: 3 }, // Enfant de Instruments
        { id: 5, title: "Pianos", url: "/categorie/pianos", parent: 3 }, // Enfant de Instruments
        { id: 6, title: "Batterie", url: "/categorie/batterie", parent: 3 }, // Enfant de Instruments
        { id: 7, title: "Contact", url: "/contact", parent: 0 },
      ],
    },
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
