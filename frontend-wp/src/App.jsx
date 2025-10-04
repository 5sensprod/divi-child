import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WordPressProvider } from "./context/WordPressContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";
import { API_CONFIG } from "./utils/constants";

// Pages React
import CategoryPage from "./pages/CategoryPage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage"; // 👈 AJOUTER

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
    `🎛️ React Categories: ${API_CONFIG.useReactCategories ? "ON" : "OFF"}`
  );
  console.log(
    `🎛️ React Products: ${API_CONFIG.useReactProducts ? "ON" : "OFF"}`
  );

  return (
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

            {/* Pages catégories - conditionnel selon l'env */}
            {API_CONFIG.useReactCategories ? (
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

            {/* 👇 NOUVEAU : Pages produits - conditionnel selon l'env */}
            {API_CONFIG.useReactProducts ? (
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

            {/* Toutes les autres routes -> WordPress */}
            <Route path="*" element={<RedirectToWordPress />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </WordPressProvider>
  );
};

export default App;
