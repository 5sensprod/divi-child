import React from "react";
import { Link } from "react-router-dom";
import { useWordPress } from "../context/WordPressContext";
import ProductGrid from "../components/Product/ProductGrid";

const Home = () => {
  const { siteData, products, loading } = useWordPress();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bienvenue sur {siteData?.site_title || "Axe Musique"}
          </h1>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {siteData?.site_description || "Votre magasin de musique en ligne"}
          </p>
          <Link
            to="/boutique"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Découvrir nos instruments
          </Link>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nos Catégories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Guitares",
                image:
                  "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
                slug: "guitares",
              },
              {
                name: "Pianos",
                image:
                  "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
                slug: "pianos",
              },
              {
                name: "Batterie",
                image:
                  "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=400",
                slug: "batterie",
              },
            ].map((category) => (
              <Link
                key={category.slug}
                to={`/categorie/${category.slug}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Produits vedettes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Produits Vedettes
            </h2>
            <Link
              to="/boutique"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Voir tout →
            </Link>
          </div>

          <ProductGrid
            products={products.slice(0, 8)}
            loading={loading.products}
            className="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Plus de 1000 instruments disponibles
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Découvrez notre catalogue complet d'instruments de musique
          </p>
          <Link
            to="/boutique"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Explorer le catalogue
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
