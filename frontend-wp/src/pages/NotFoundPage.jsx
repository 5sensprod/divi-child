// src/pages/NotFoundPage.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Background from "../components/UI/Background";
import Title from "../components/UI/Title";

const NotFoundPage = () => {
  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 md:pt-40 md:pb-32 overflow-hidden min-h-[600px] flex items-center">
        <Background variant="auto" opacity={0.95} animated={true} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Numéro 404 stylisé */}
            <div className="mb-8">
              <Title
                tag="h1"
                className="text-8xl md:text-9xl mb-4"
                animationType="equalizer"
                gradient="ocean"
                mode="neon"
              >
                404
              </Title>
            </div>

            {/* Message d'erreur */}
            <Title
              tag="h2"
              className="mb-6"
              animationType="none"
              gradient="sunset"
              mode="neon"
            >
              Page introuvable
            </Title>

            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
              Oups ! La page que vous recherchez semble avoir disparu dans les
              coulisses. Peut-être qu'elle est partie en tournée ?
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Retour à l'accueil
              </Link>
            </div>

            {/* Suggestions */}
            <div className="mt-12 pt-8 border-t border-gray-600">
              <p className="text-gray-300 mb-4">Vous cherchez peut-être :</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  to="/categorie-produit/guitares"
                  className="px-4 py-2 bg-gray-800/50 text-gray-200 rounded-full text-sm hover:bg-gray-700/50 transition-colors"
                >
                  Guitares
                </Link>
                <Link
                  to="/categorie-produit/batteries"
                  className="px-4 py-2 bg-gray-800/50 text-gray-200 rounded-full text-sm hover:bg-gray-700/50 transition-colors"
                >
                  Batteries
                </Link>
                <Link
                  to="/categorie-produit/pianos"
                  className="px-4 py-2 bg-gray-800/50 text-gray-200 rounded-full text-sm hover:bg-gray-700/50 transition-colors"
                >
                  Pianos
                </Link>
                <Link
                  to="/categorie-produit/sono"
                  className="px-4 py-2 bg-gray-800/50 text-gray-200 rounded-full text-sm hover:bg-gray-700/50 transition-colors"
                >
                  Sono
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFoundPage;
