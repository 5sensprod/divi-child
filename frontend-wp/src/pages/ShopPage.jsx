// src/pages/ShopPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_CONFIG } from "../utils/constants";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🏪 Chargement boutique...");

        // 1. Récupérer tous les produits
        const productsUrl = `${
          API_CONFIG.baseURL
        }/products?per_page=20&orderby=${sortBy}&consumer_key=${
          import.meta.env.VITE_WP_CONSUMER_KEY
        }&consumer_secret=${import.meta.env.VITE_WP_CONSUMER_SECRET}`;
        console.log("📡 URL produits:", productsUrl);

        const productsResponse = await fetch(productsUrl);
        if (!productsResponse.ok) {
          throw new Error(
            `Erreur ${productsResponse.status}: ${productsResponse.statusText}`
          );
        }

        const productsData = await productsResponse.json();
        console.log("🛍️ Produits chargés:", productsData);
        setProducts(productsData);

        // 2. Récupérer les catégories pour les filtres
        const categoriesUrl = `${
          API_CONFIG.baseURL
        }/products/categories?hide_empty=true&consumer_key=${
          import.meta.env.VITE_WP_CONSUMER_KEY
        }&consumer_secret=${import.meta.env.VITE_WP_CONSUMER_SECRET}`;
        console.log("📡 URL catégories:", categoriesUrl);

        const categoriesResponse = await fetch(categoriesUrl);
        if (!categoriesResponse.ok) {
          throw new Error(
            `Erreur catégories ${categoriesResponse.status}: ${categoriesResponse.statusText}`
          );
        }

        const categoriesData = await categoriesResponse.json();
        console.log("📂 Catégories chargées:", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("❌ Erreur lors du chargement:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [sortBy]);

  // Filtrer les produits par catégorie
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) =>
          product.categories?.some(
            (cat) => cat.id === parseInt(selectedCategory)
          )
        );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la boutique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Boutique</h1>
        <p className="text-gray-600">
          Découvrez notre sélection d'instruments de musique
        </p>
      </div>

      {/* Filtres et tri */}
      <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Filtres par catégories */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === "all"
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Toutes ({products.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category.id.toString()
                    ? "bg-pink-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Tri */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-600">
              Trier par:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="date">Plus récents</option>
              <option value="title">Nom A-Z</option>
              <option value="price">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="popularity">Popularité</option>
            </select>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? "s" : ""} trouvé
          {filteredProducts.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Grille de produits */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={product.images?.[0]?.src || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Catégories */}
                {product.categories && product.categories.length > 0 && (
                  <div className="mb-2">
                    {product.categories.slice(0, 2).map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/product-category/${cat.slug}`}
                        className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2 hover:bg-pink-100 hover:text-pink-700 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {product.on_sale && product.sale_price ? (
                      <>
                        <span className="text-lg font-bold text-pink-600">
                          {product.sale_price}€
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {product.regular_price}€
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900">
                        {product.regular_price}€
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.stock_status === "instock"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock_status === "instock"
                      ? "En stock"
                      : "Rupture"}
                  </span>
                </div>
                <button className="w-full mt-3 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors">
                  Voir le produit
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Aucun produit trouvé.</p>
          <button
            onClick={() => setSelectedCategory("all")}
            className="mt-4 text-pink-500 hover:text-pink-600 underline"
          >
            Voir tous les produits
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
