import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { WordPressProvider } from "./context/WordPressContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";
import AxeCategoryPage from "./pages/axe/AxeCategoryPage";
import AxeProductPage from "./pages/axe/AxeProductPage";
import AxeShopPage from "./pages/axe/AxeShopPage";
import { API_CONFIG } from "./utils/constants";
import { getProductsOnSale } from "./services/woocommerce";
// Pages React
import CategoryPage from "./pages/CategoryPage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import LegalPage from "./pages/LegalPage";
import BonsPlansPage from "./pages/BonsPlansPage";
import NotFoundPage from "./pages/NotFoundPage"; // 👈 AJOUTER

// Composant de redirection optimisé
const RedirectToWordPress = () => {
  useEffect(() => {
    // Masquer immédiatement le body
    document.body.style.visibility = "hidden";
    // Redirection immédiate avec replace pour éviter l'historique
    window.location.replace(window.location.href);
  }, []);
  // Ne rien retourner - composant invisible
  return null;
};

// Hook pour gérer les redirections
const useWordPressRedirect = () => {
  useEffect(() => {
    // Ajouter une classe CSS pour les redirections
    const handleRouteChange = () => {
      if (window.location.pathname !== "/") {
        document.body.classList.add("redirecting");
      }
    };
    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
      document.body.classList.remove("redirecting");
    };
  }, []);
};

const scrollPositions = new Map();

const scrollInstantly = ({ top, left = 0 }) => {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top, left });
  root.style.scrollBehavior = previousBehavior;
};

/**
 * Une nouvelle destination commence en haut de page. En revanche, un retour
 * ou une avance dans l'historique laisse le navigateur restaurer la position
 * associée à cette entrée — comportement attendu quand on revient à une
 * liste après avoir consulté un produit.
 */
const ScrollManager = () => {
  const location = useLocation();
  const { pathname, search, hash, key } = location;
  const navigationType = useNavigationType();
  const currentKey = useRef(key);
  currentKey.current = key;

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    // Le clic est capturé AVANT que React Router change d'entrée d'historique.
    // C'est le relevé le plus fidèle : ni le focus du nouveau lien, ni le
    // rendu de la page suivante n'ont encore pu déplacer la fenêtre.
    const rememberBeforeNavigation = () => {
      scrollPositions.set(currentKey.current, {
        top: window.scrollY,
        left: window.scrollX,
        capturedAt: performance.now(),
      });
    };

    document.addEventListener("click", rememberBeforeNavigation, true);

    return () => {
      document.removeEventListener("click", rememberBeforeNavigation, true);
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    let frame;
    let retryTimer;

    if (navigationType === "POP") {
      const savedPosition = scrollPositions.get(key);

      if (savedPosition) {
        const startedAt = performance.now();

        // Au retour, une liste issue de l'API est d'abord plus courte pendant
        // son chargement. On réessaie jusqu'à ce que sa hauteur permette de
        // rejoindre la vraie position, au lieu de rester bloqué au bas du
        // squelette de chargement.
        const restore = () => {
          scrollInstantly(savedPosition);

          const restored =
            Math.abs(window.scrollY - savedPosition.top) <= 2 &&
            Math.abs(window.scrollX - savedPosition.left) <= 2;

          if (!restored && performance.now() - startedAt < 3000) {
            retryTimer = window.setTimeout(restore, 50);
          }
        };

        frame = window.requestAnimationFrame(restore);
      }
    } else if (hash) {
      // Une ancre est une destination volontaire dans la page, pas un scroll
      // hérité de la page précédente.
      frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(
          decodeURIComponent(hash.slice(1)),
        );
        target?.scrollIntoView({ block: "start" });
      });
    } else {
      // `html { scroll-behavior: smooth }` est utile pour les ancres, mais une
      // page d'arrivée doit apparaître immédiatement en haut, sans animation.
      scrollInstantly({ top: 0, left: 0 });
    }

    return () => {
      // En développement, StrictMode monte puis démonte l'effet une première
      // fois sans changer de page. On ne sauvegarde que lors d'un vrai
      // changement de clé d'historique pour ne pas écraser la bonne position.
      if (currentKey.current !== key) {
        const captured = scrollPositions.get(key);
        const hasFreshClickPosition =
          captured?.capturedAt && performance.now() - captured.capturedAt < 250;

        if (!hasFreshClickPosition) {
          scrollPositions.set(key, {
            top: window.scrollY,
            left: window.scrollX,
          });
        }
      }

      if (frame) window.cancelAnimationFrame(frame);
      if (retryTimer) window.clearTimeout(retryTimer);
    };
  }, [pathname, search, hash, key, navigationType]);

  return null;
};

const App = () => {
  useWordPressRedirect();
  console.log(
    `🎛️ React Categories: ${API_CONFIG.useReactCategories ? "ON" : "OFF"}`,
  );
  console.log(
    `🎛️ React Products: ${API_CONFIG.useReactProducts ? "ON" : "OFF"}`,
  );
  // Préchauffage du cache des produits soldés — UNIQUEMENT quand WooCommerce
  // sert encore. Sous `useAxeCatalog`, plus rien n'affiche de solde : le site
  // n'a aucune notion de promotion (décision du 10 août 2026). Cet appel serait
  // alors une requête WooCommerce pour personne, portant les clés du bundle.
  useEffect(() => {
    if (API_CONFIG.useAxeCatalog) return;
    getProductsOnSale();
  }, []);

  return (
    <WishlistProvider>
      <WordPressProvider>
        <ThemeProvider initial="neon">
          <Router>
            <ScrollManager />
            <Routes>
              {/* Page d'accueil - toujours React */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />

              {/* 👇 NOUVEAU : Page mentions légales - toujours React */}
              <Route
                path="/mentions-legales"
                element={
                  <Layout>
                    <LegalPage />
                  </Layout>
                }
              />

              {/* ─── Pages catégories ──────────────────────────────────────
                  Trois cas, dans cet ordre de priorité :
                    1. `useAxeCatalog` → notre base SQL ;
                    2. `useReactCategories` → WooCommerce en React ;
                    3. sinon → redirection vers WordPress.
                  Le premier drapeau PRIME : quand le catalogue Axe est actif,
                  les slugs sont les nôtres et la page WooCommerce ne saurait
                  pas les résoudre. */}
              {API_CONFIG.useAxeCatalog ? (
                <>
                  <Route
                    path="/categorie-produit/*"
                    element={
                      <Layout>
                        <AxeCategoryPage />
                      </Layout>
                    }
                  />
                  {/* `/shop` tombait sur la page 404 sous ce drapeau : elle
                      n'était routée que dans la branche `useReactCategories`,
                      alors que le menu la propose. */}
                  <Route
                    path="/shop"
                    element={
                      <Layout>
                        <AxeShopPage />
                      </Layout>
                    }
                  />
                </>
              ) : API_CONFIG.useReactCategories ? (
                <>
                  <Route
                    path="/categorie-produit/*"
                    element={
                      <Layout>
                        <CategoryPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/shop"
                    element={
                      <Layout>
                        <ShopPage />
                      </Layout>
                    }
                  />
                </>
              ) : (
                <>
                  <Route
                    path="/categorie-produit/*"
                    element={<RedirectToWordPress />}
                  />
                  <Route path="/shop" element={<RedirectToWordPress />} />
                </>
              )}

              {/* Pages produits — même priorité que ci-dessus. */}
              {API_CONFIG.useAxeCatalog ? (
                <Route
                  path="/produit/:slug"
                  element={
                    <Layout>
                      <AxeProductPage />
                    </Layout>
                  }
                />
              ) : API_CONFIG.useReactProducts ? (
                <Route
                  path="/produit/:slug"
                  element={
                    <Layout>
                      <ProductPage />
                    </Layout>
                  }
                />
              ) : (
                <Route path="/produit/*" element={<RedirectToWordPress />} />
              )}

              {/* ─── Bons plans ────────────────────────────────────────────
                  La route DISPARAÎT sous `useAxeCatalog`, et l'entrée de menu
                  avec elle (`Navigation.jsx`, `MobileMenu.jsx`, `Header.jsx`).
                  Notre catalogue n'a aucune notion de promotion — ni prix
                  barré, ni `sale_price` — et ce n'est pas un oubli mais le
                  modèle arrêté le 10 août 2026. Laisser la page sur WooCommerce
                  afficherait des soldes sur des produits dont toutes les autres
                  pages du site donnent un prix venu d'ailleurs. */}
              {!API_CONFIG.useAxeCatalog && (
                <Route
                  path="/bons-plans"
                  element={
                    <Layout>
                      <BonsPlansPage />
                    </Layout>
                  }
                />
              )}

              {/* Page 404 React pour toutes les routes inconnues */}
              <Route
                path="*"
                element={
                  <Layout>
                    <NotFoundPage />
                  </Layout>
                }
              />
            </Routes>
          </Router>
        </ThemeProvider>
      </WordPressProvider>
    </WishlistProvider>
  );
};

export default App;
