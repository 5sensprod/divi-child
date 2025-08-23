// src/components/Layout/Header/Header.jsx
// Container principal simplifié

import { useWordPress } from "../../../context/WordPressContext";
import { HEADER_CONFIG } from "../../../config/components";
import Navigation from "../Navigation";
import HeroBackground from "./HeroBackground";
import HeroSlider from "./HeroSlider";

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();

  return (
    <header className="relative">
      {showHero && <HeroBackground />}

      <div className="z-navigation sticky top-0">
        <Navigation
          menuItems={menus?.items || []}
          siteTitle={siteData?.site_title || HEADER_CONFIG.defaults.siteTitle}
          loading={loading.menus}
          {...HEADER_CONFIG.navigation}
        />
      </div>

      {showHero && (
        <HeroSlider
          siteTitle={siteData?.site_title || HEADER_CONFIG.defaults.siteTitle}
          siteDescription={
            siteData?.site_description || HEADER_CONFIG.defaults.siteDescription
          }
        />
      )}
    </header>
  );
};

export default Header;
