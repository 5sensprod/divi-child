import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WordPressProvider } from "./context/WordPressContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";

// Composant de redirection
const RedirectToWordPress = () => {
  useEffect(() => {
    // Rediriger automatiquement vers la page WordPress correspondante
    window.location.href = window.location.href;
  }, []);

  return <div>Redirection vers WordPress...</div>;
};

const App = () => {
  return (
    <WordPressProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Toutes les autres routes redirigent vers WordPress */}
            <Route path="*" element={<RedirectToWordPress />} />
          </Routes>
        </Layout>
      </Router>
    </WordPressProvider>
  );
};

export default App;
