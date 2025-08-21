import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { WordPressProvider } from "./context/WordPressContext";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Category from "./pages/Category";
import Product from "./pages/Product";

const App = () => {
  return (
    <WordPressProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<Shop />} />
            <Route path="/categorie/:slug" element={<Category />} />
            <Route path="/produit/:id" element={<Product />} />
            <Route
              path="*"
              element={
                <div className="text-center py-12">
                  <h1 className="text-2xl">Page non trouvée</h1>
                </div>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </WordPressProvider>
  );
};

export default App;
