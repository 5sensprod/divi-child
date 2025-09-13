import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WordPressProvider } from "./context/WordPressContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import { ThemeProvider } from "./context/ThemeContext";

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

  return (
    <WordPressProvider>
      <ThemeProvider initial="neon">
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Home />
                </Layout>
              }
            />
            <Route path="*" element={<RedirectToWordPress />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </WordPressProvider>
  );
};

export default App;
