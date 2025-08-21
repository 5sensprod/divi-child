// src/components/Layout/Header.jsx

import { useWordPress } from "../../context/WordPressContext";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();

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
          loading={loading.menus}
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
