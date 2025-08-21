import React, { useState, useEffect, createContext, useContext } from "react";
import { ChevronDown, Menu, X, ShoppingCart, Search } from "lucide-react";
import axios from "axios";
import { getProducts } from "./services/woocommerce";

// Context pour les données WordPress
const WordPressContext = createContext();

// Configuration de l'API depuis les variables d'environnement
const API_CONFIG = {
  // ✅ Utiliser le proxy local au lieu de l'URL complète
  baseURL: "/wp-json/wp/v2",
  siteURL: import.meta.env.VITE_WP_SITE_URL || "https://axemusique.shop",
  timeout: 30000,
  isDevMode: import.meta.env.VITE_DEV_MODE === "true",
  auth: {
    username: import.meta.env.VITE_WP_USER,
    password: import.meta.env.VITE_WP_APP_PASSWORD,
  },
};

// Configuration axios pour WordPress (posts, menus, etc.)
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

// Hook personnalisé pour l'API WordPress avec chargement intelligent
const useWordPressAPI = () => {
  const [data, setData] = useState({
    siteData: null,
    // ✅ Menu par défaut immédiatement disponible
    menus: {
      main: {
        name: "Menu Principal",
        items: [
          { id: 1, title: "Accueil", url: "/", parent: 0 },
          { id: 2, title: "Instruments", url: "/instruments", parent: 0 },
          { id: 3, title: "Accessoires", url: "/accessoires", parent: 0 },
          { id: 4, title: "Contact", url: "/contact", parent: 0 },
        ],
      },
    },
    products: [],
    loading: {
      initial: true,
      menus: true, // Toujours essayer de charger depuis l'API/cache
      products: true,
      siteData: true,
    },
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ CHARGEMENT IMMÉDIAT DES DONNÉES CACHÉES (une seule fois)
        const loadCachedData = () => {
          const MENU_CACHE_KEY = "axemusique_menu";

          try {
            const cached = localStorage.getItem(MENU_CACHE_KEY);
            if (cached) {
              const { data: menuData, timestamp } = JSON.parse(cached);
              const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 heures
              const isValid = Date.now() - timestamp < CACHE_DURATION;

              if (isValid) {
                console.log("⚡ Menu chargé instantanément depuis le cache");
                setData((prev) => ({
                  ...prev,
                  menus: menuData,
                  loading: { ...prev.loading, menus: false, initial: false },
                }));
                return menuData;
              } else {
                // Cache expiré, le supprimer
                localStorage.removeItem(MENU_CACHE_KEY);
                console.log("🗑️ Cache menu expiré");
              }
            }
          } catch (e) {
            console.warn("Cache menu corrompu", e);
            localStorage.removeItem(MENU_CACHE_KEY);
          }

          // Pas de cache valide, mais on a déjà le menu par défaut
          console.log("📋 Utilisation du menu par défaut");
          setData((prev) => ({
            ...prev,
            loading: { ...prev.loading, initial: false },
          }));
          return null;
        };

        // ✅ Charger le cache UNE SEULE FOIS
        const cachedMenu = loadCachedData();

        // Si mode développement, utiliser les données de test
        if (API_CONFIG.isDevMode) {
          const mockData = {
            siteData: {
              site_title: "Axe Musique - Mode Test",
              site_description:
                "Boutique en ligne moderne avec React + WordPress",
              logo: null,
              contact_info: {
                email: "contact@axemusique.shop",
                phone: "01 23 45 67 89",
              },
            },
            menus: cachedMenu || data.menus, // Garder le menu par défaut si pas de cache
            products: [
              {
                id: 1,
                name: "Guitare Électrique Premium",
                regular_price: "899.99",
                sale_price: "699.99",
                on_sale: true,
                images: [
                  {
                    src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                  },
                ],
                stock_status: "instock",
              },
              {
                id: 2,
                name: "Piano Numérique",
                regular_price: "1299.99",
                sale_price: "",
                on_sale: false,
                images: [
                  {
                    src: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
                  },
                ],
                stock_status: "instock",
              },
            ],
          };

          await new Promise((resolve) => setTimeout(resolve, 1000));
          setData((prev) => ({
            ...mockData,
            loading: {
              initial: false,
              menus: false,
              products: false,
              siteData: false,
            },
            error: null,
          }));
        } else {
          // Utiliser la vraie API WordPress
          console.log("Connexion à l'API WordPress:", API_CONFIG.baseURL);

          try {
            // Tester d'abord si l'API est accessible
            const testResponse = await api.get("/");
            console.log(
              "API WordPress accessible:",
              testResponse.data.name || testResponse.data.namespace
            );

            // 🚀 CHARGEMENT INTELLIGENT EN PARALLÈLE
            const loadSiteData = async () => {
              try {
                const response = await api.get("/site-data");
                setData((prev) => ({
                  ...prev,
                  siteData: response.data,
                  loading: { ...prev.loading, siteData: false },
                }));
                return response.data;
              } catch (err) {
                console.warn("Endpoint site-data non disponible:", err.message);
                const fallbackData = {
                  site_title: "Axe Musique",
                  site_description: "Votre magasin de musique en ligne",
                  logo: null,
                  contact_info: { email: "contact@axemusique.shop", phone: "" },
                };
                setData((prev) => ({
                  ...prev,
                  siteData: fallbackData,
                  loading: { ...prev.loading, siteData: false },
                }));
                return fallbackData;
              }
            };

            const loadMenu = async () => {
              if (cachedMenu) {
                console.log("✅ Menu déjà chargé depuis le cache");
                setData((prev) => ({
                  ...prev,
                  loading: { ...prev.loading, menus: false },
                }));
                return cachedMenu;
              }

              try {
                console.log("🔄 Récupération du menu depuis l'API...");
                const response = await api.get("/menus");

                // Sauvegarder en cache
                const cacheData = {
                  data: response.data,
                  timestamp: Date.now(),
                };
                localStorage.setItem(
                  "axemusique_menu",
                  JSON.stringify(cacheData)
                );
                console.log("💾 Menu mis en cache pour 24h");

                setData((prev) => ({
                  ...prev,
                  menus: response.data,
                  loading: { ...prev.loading, menus: false },
                }));
                return response.data;
              } catch (menuError) {
                console.warn(
                  "Endpoint menus non disponible:",
                  menuError.message
                );
                // Garder le menu par défaut, juste arrêter le loading
                setData((prev) => ({
                  ...prev,
                  loading: { ...prev.loading, menus: false },
                }));
                return data.menus; // Menu par défaut
              }
            };

            const loadProducts = async () => {
              try {
                const products = await getProducts({ per_page: 20 });
                setData((prev) => ({
                  ...prev,
                  products: products,
                  loading: { ...prev.loading, products: false },
                }));
                return products;
              } catch (wcError) {
                console.warn(
                  "Service WooCommerce non disponible:",
                  wcError.message
                );

                const fallbackProducts = [
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

                setData((prev) => ({
                  ...prev,
                  products: fallbackProducts,
                  loading: { ...prev.loading, products: false },
                }));
                return fallbackProducts;
              }
            };

            // Charger tout en parallèle
            await Promise.all([loadSiteData(), loadMenu(), loadProducts()]);

            console.log("✅ Toutes les données WordPress chargées");
          } catch (apiError) {
            console.error("❌ Erreur détaillée API:", apiError);

            // Fallback complet - garde le menu par défaut
            setData((prev) => ({
              ...prev,
              siteData: {
                site_title: "Axe Musique",
                site_description: "Votre magasin de musique en ligne",
                logo: null,
                contact_info: {
                  email: "contact@axemusique.shop",
                  phone: "01 23 45 67 89",
                },
              },
              // menus garde sa valeur par défaut
              products: [],
              loading: {
                initial: false,
                menus: false,
                products: false,
                siteData: false,
              },
              error: "Erreur de connexion à WordPress",
            }));
          }
        }
      } catch (error) {
        console.error("❌ Erreur API WordPress:", error);
        setData((prev) => ({
          ...prev,
          loading: {
            initial: false,
            menus: false,
            products: false,
            siteData: false,
          },
          error: "Erreur de connexion à WordPress.",
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};

// Composant Header avec menu WordPress
// Composant Header avec menu WordPress
const Header = () => {
  const { siteData, menus } = useContext(WordPressContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Condition modifiée : afficher dès que le menu est disponible
  if (!menus) {
    return (
      <div className="h-16 bg-gray-100 animate-pulse flex items-center justify-center">
        <div className="w-32 h-6 bg-gray-300 rounded"></div>
      </div>
    );
  }

  const mainMenu = menus.main || menus[Object.keys(menus)[0]];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            {siteData?.logo && (
              <img src={siteData.logo} alt="Logo" className="h-8 w-auto" />
            )}
            <h1 className="text-xl font-bold text-gray-800">
              {siteData?.site_title || "Axe Musique"}
            </h1>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainMenu &&
              mainMenu.items?.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  {item.title}
                </a>
              ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Menu mobile */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t py-4 animate-in slide-in-from-top">
            {mainMenu &&
              mainMenu.items?.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.title}
                </a>
              ))}
          </div>
        )}
      </div>
    </header>
  );
};

// Composant Produit avec données WooCommerce réelles
const ProductCard = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-64 bg-gray-200">
        <img
          src={
            product.images?.[0]?.src ||
            "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400"
          }
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {product.on_sale && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Promo
          </div>
        )}

        {product.stock_status !== "instock" && (
          <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Rupture
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {product.sale_price && product.sale_price !== "" && (
              <span className="text-lg font-bold text-green-600">
                {product.sale_price}€
              </span>
            )}
            <span
              className={`${
                product.sale_price && product.sale_price !== ""
                  ? "text-sm text-gray-500 line-through"
                  : "text-lg font-bold text-gray-800"
              }`}
            >
              {product.regular_price}€
            </span>
          </div>

          <div className="flex items-center">
            <div className="flex text-yellow-400 text-sm">{"★★★★★"}</div>
            <span className="ml-1 text-sm text-gray-600">(4.5)</span>
          </div>
        </div>

        <button
          className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 font-semibold ${
            product.stock_status === "instock"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={product.stock_status !== "instock"}
        >
          {product.stock_status === "instock"
            ? "Ajouter au panier"
            : "Non disponible"}
        </button>
      </div>
    </div>
  );
};

// Composant principal avec chargement intelligent
const App = () => {
  const wordpressData = useWordPressAPI();

  // Spinner global seulement au tout début
  if (wordpressData.loading.initial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Initialisation...</p>
        </div>
      </div>
    );
  }

  if (wordpressData.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Erreur de connexion
          </h2>
          <p className="text-gray-600 mb-6">{wordpressData.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
          <p className="text-sm text-gray-500 mt-4">
            💡 Mode:{" "}
            {API_CONFIG.isDevMode
              ? "Développement (données de test)"
              : "Production (API WordPress)"}
            <br />
            Modifiez VITE_DEV_MODE dans .env pour basculer
          </p>
        </div>
      </div>
    );
  }

  return (
    <WordPressContext.Provider value={wordpressData}>
      <div className="min-h-screen bg-gray-50">
        {/* Header - S'affiche immédiatement si menu en cache */}
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section - S'affiche immédiatement */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Bienvenue sur{" "}
              {wordpressData.siteData?.site_title || "Axe Musique"}
            </h2>
            <p className="text-xl opacity-90 mb-6">
              {wordpressData.siteData?.site_description ||
                "Votre magasin de musique en ligne"}
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Découvrir nos instruments
            </button>
          </section>

          {/* Section Produits - Spinner spécifique si en cours de chargement */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Nos Instruments
              </h2>
              {wordpressData.loading.products && (
                <div className="flex items-center text-gray-500">
                  <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm">Chargement des produits...</span>
                </div>
              )}
            </div>

            {wordpressData.loading.products ? (
              // Skeleton loader pour les produits
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="h-64 bg-gray-200 animate-pulse"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 animate-pulse rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3 mb-3"></div>
                      <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Vrais produits
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wordpressData.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>
              &copy; 2025 {wordpressData.siteData?.site_title || "Axe Musique"}.
              Tous droits réservés.
            </p>
            <p className="text-gray-400 mt-2">
              Frontend React + Backend WordPress
            </p>
          </div>
        </footer>
      </div>
    </WordPressContext.Provider>
  );
};

export default App;
