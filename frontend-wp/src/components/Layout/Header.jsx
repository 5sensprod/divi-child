// src/components/Layout/Header.jsx

import { useWordPress } from "../../context/WordPressContext";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";

const Header = ({ showHero = false }) => {
  const { siteData, menus } = useWordPress();

  if (!menus) {
    return (
      <div className="h-20 bg-gray-900 animate-pulse flex items-center justify-center">
        <div className="w-32 h-6 bg-gray-700 rounded"></div>
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
