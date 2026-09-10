import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { MenuProvider } from "./context/MenuContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";
import AxeCategoryPage from "./pages/axe/AxeCategoryPage";
import AxeProductPage from "./pages/axe/AxeProductPage";
import AxeShopPage from "./pages/axe/AxeShopPage";
import LegalPage from "./pages/LegalPage";
import NotFoundPage from "./pages/NotFoundPage";

// ─── Le site n'a plus qu'une source ─────────────────────────────────────────
// Depuis le 10 septembre 2026, WordPress et WooCommerce sont retirés : le
// catalogue vient de `catalog.php` (notre base SQL, alimentée par PocketApp) et
// le menu de `/data/menu.json`. Les drapeaux de bascule (`useAxeCatalog`,
// `useReactCategories`, `useReactProducts`, `usePublishedMenu`), les pages
// WooCommerce et la redirection vers WordPress sont supprimés avec eux.

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
  return (
    <WishlistProvider>
      <MenuProvider>
        <ThemeProvider initial="neon">
          <Router>
            <ScrollManager />
            <Routes>
              <Route
                path="/"
                element={
                  <Layout>
                    <Home />
                  </Layout>
                }
              />

              <Route
                path="/mentions-legales"
                element={
                  <Layout>
                    <LegalPage />
                  </Layout>
                }
              />

              <Route
                path="/categorie-produit/*"
                element={
                  <Layout>
                    <AxeCategoryPage />
                  </Layout>
                }
              />

              <Route
                path="/shop"
                element={
                  <Layout>
                    <AxeShopPage />
                  </Layout>
                }
              />

              <Route
                path="/produit/:slug"
                element={
                  <Layout>
                    <AxeProductPage />
                  </Layout>
                }
              />

              {/* Page 404 React pour toutes les routes inconnues — y compris
                  l'ancienne `/bons-plans` : le catalogue n'a pas de promotion. */}
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
      </MenuProvider>
    </WishlistProvider>
  );
};

export default App;
