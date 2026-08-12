import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WordPressProvider } from "./context/WordPressContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { WishlistProvider } from "./context/WishlistContext";
import AxeCategoryPage from "./pages/axe/AxeCategoryPage";
import AxeProductPage from "./pages/axe/AxeProductPage";
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

const App = () => {
  useWordPressRedirect();
  console.log(
    `🎛️ React Categories: ${API_CONFIG.useReactCategories ? "ON" : "OFF"}`,
  );
  console.log(
    `🎛️ React Products: ${API_CONFIG.useReactProducts ? "ON" : "OFF"}`,
  );
  useEffect(() => {
    getProductsOnSale();
  }, []);

  return (
    <WishlistProvider>
      <WordPressProvider>
        <ThemeProvider initial="neon">
          <Router>
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
                <Route
                  path="/categorie-produit/*"
                  element={
                    <Layout>
                      <AxeCategoryPage />
                    </Layout>
                  }
                />
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

              <Route
                path="/bons-plans"
                element={
                  <Layout>
                    <BonsPlansPage />
                  </Layout>
                }
              />

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
