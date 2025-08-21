import React, { useState, useEffect, createContext, useContext } from "react";
import { ChevronDown, Menu, X, ShoppingCart, Search } from "lucide-react";
import axios from "axios";
import { getProducts } from "./services/woocommerce";

// Context pour les données WordPress
const WordPressContext = createContext();

// Configuration de l'API depuis les variables d'environnement
const API_CONFIG = {
  baseURL:
    import.meta.env.VITE_WP_API_URL || "https://axemusique.shop/wp-json/wp/v2",
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

// Hook personnalisé pour l'API WordPress
const useWordPressAPI = () => {
  const [data, setData] = useState({
    siteData: null,
    menus: null,
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, loading: true, error: null }));

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
            menus: {
              main: {
                name: "Menu Principal",
                items: [
                  { id: 1, title: "Accueil", url: "/", parent: 0 },
                  {
                    id: 2,
                    title: "Instruments",
                    url: "/instruments",
                    parent: 0,
                  },
                  {
                    id: 3,
                    title: "Accessoires",
                    url: "/accessoires",
                    parent: 0,
                  },
                  { id: 4, title: "Contact", url: "/contact", parent: 0 },
                ],
              },
            },
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

          // Simuler un délai d'API
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setData({ ...mockData, loading: false, error: null });
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

            // Récupérer les données en parallèle
            const requests = [
              api.get("/site-data").catch((err) => {
                console.warn("Endpoint site-data non disponible:", err.message);
                return {
                  data: {
                    site_title: "Axe Musique",
                    site_description: "Votre magasin de musique en ligne",
                    logo: null,
                    contact_info: {
                      email: "contact@axemusique.shop",
                      phone: "",
                    },
                  },
                };
              }),
              api.get("/menus").catch((err) => {
                console.warn("Endpoint menus non disponible:", err.message);
                return {
                  data: {
                    main: {
                      name: "Menu Principal",
                      items: [
                        { id: 1, title: "Accueil", url: "/", parent: 0 },
                        {
                          id: 2,
                          title: "Boutique",
                          url: "/boutique",
                          parent: 0,
                        },
                        { id: 3, title: "Contact", url: "/contact", parent: 0 },
                      ],
                    },
                  },
                };
              }),
              // Utiliser le service WooCommerce
              (async () => {
                try {
                  const products = await getProducts({ per_page: 20 });
                  return { data: products };
                } catch (wcError) {
                  console.warn(
                    "Service WooCommerce non disponible:",
                    wcError.message
                  );

                  // Fallback vers des données de test spécifiques à la musique
                  console.log("Utilisation de données de démonstration...");
                  return {
                    data: [
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
                    ],
                  };
                }
              })(),
            ];

            const [siteResponse, menusResponse, productsResponse] =
              await Promise.all(requests);

            setData({
              siteData: siteResponse.data,
              menus: menusResponse.data,
              products: productsResponse.data,
              loading: false,
              error: null,
            });

            console.log("Données WordPress chargées avec succès");
          } catch (apiError) {
            console.error("Erreur détaillée API:", apiError);

            // Si même l'API de base ne fonctionne pas, utiliser des données de démonstration
            console.log(
              "Fallback vers les données de démonstration complètes..."
            );
            setData({
              siteData: {
                site_title: "Axe Musique",
                site_description: "Votre magasin de musique en ligne",
                logo: null,
                contact_info: {
                  email: "contact@axemusique.shop",
                  phone: "01 23 45 67 89",
                },
              },
              menus: {
                main: {
                  name: "Menu Principal",
                  items: [
                    { id: 1, title: "Accueil", url: "/", parent: 0 },
                    {
                      id: 2,
                      title: "Instruments",
                      url: "/instruments",
                      parent: 0,
                    },
                    {
                      id: 3,
                      title: "Accessoires",
                      url: "/accessoires",
                      parent: 0,
                    },
                    { id: 4, title: "Contact", url: "/contact", parent: 0 },
                  ],
                },
              },
              products: [
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
              ],
              loading: false,
              error: null,
            });
          }
        }
      } catch (error) {
        console.error("Erreur API WordPress:", error);
        let errorMessage = "Erreur de connexion à WordPress.";

        if (error.response) {
          errorMessage += ` Statut: ${error.response.status}`;
        } else if (error.request) {
          errorMessage += " Vérifiez votre connexion réseau.";
        }

        setData((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};

// Composant Header avec menu WordPress
const Header = () => {
  const { siteData, menus } = useContext(WordPressContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!siteData || !menus) {
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
            {siteData.logo && (
              <img src={siteData.logo} alt="Logo" className="h-8 w-auto" />
            )}
            <h1 className="text-xl font-bold text-gray-800">
              {siteData.site_title}
            </h1>
          </div>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            {mainMenu &&
              mainMenu.items.map((item) => (
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
              mainMenu.items.map((item) => (
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

// Composant principal
const App = () => {
  const wordpressData = useWordPressAPI();

  if (wordpressData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données WordPress...</p>
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
        <Header />

        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Bienvenue sur {wordpressData.siteData?.site_title}
            </h2>
            <p className="text-xl opacity-90 mb-6">
              {wordpressData.siteData?.site_description}
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Découvrir nos instruments
            </button>
          </section>

          {/* Produits */}
          <section>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Nos Instruments
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wordpressData.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>
              &copy; 2025 {wordpressData.siteData?.site_title}. Tous droits
              réservés.
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
