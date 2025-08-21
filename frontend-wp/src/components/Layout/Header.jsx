// src/components/Layout/Header.jsx

import { useWordPress } from "../../context/WordPressContext";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();

  // Vérifier si c'est un vrai menu WordPress (avec items)
  const hasRealMenu = menus && menus.items && menus.items.length > 0;

  if (!hasRealMenu || loading.menus) {
    return (
      <div
        className={`h-20 ${
          showHero ? "bg-black/80 backdrop-blur-lg" : "bg-gray-900"
        } animate-pulse sticky top-0 z-50`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo skeleton */}
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-gray-700 rounded-lg"></div>
              <div className="h-6 w-32 bg-gray-700 rounded"></div>
            </div>

            {/* Menu skeleton */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="h-5 w-20 bg-gray-700 rounded"></div>
              <div className="h-5 w-16 bg-gray-700 rounded"></div>
              <div className="h-5 w-24 bg-gray-700 rounded"></div>
              <div className="h-5 w-18 bg-gray-700 rounded"></div>
            </div>

            {/* Actions skeleton */}
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
              <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
              <div className="md:hidden h-10 w-10 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <header className="relative">
      {/* Navigation fixe */}
      <div
        className={`${
          showHero
            ? "absolute top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg"
            : "bg-gray-900 shadow-lg"
        } sticky top-0`}
      >
        <Navigation
          menuItems={menus?.items || []}
          siteTitle={siteData?.site_title || "Axe Musique"}
        />
      </div>

      {/* Section Hero (optionnelle) */}
      {showHero && (
        <HeroSection
          title={`Bienvenue sur ${siteData?.site_title || "Axe Musique"}`}
          subtitle={
            siteData?.site_description || "Votre magasin de musique en ligne"
          }
        />
      )}
    </header>
  );
};

export default Header;
