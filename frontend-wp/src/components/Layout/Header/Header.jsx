import { useState, useEffect } from "react";
import { useWordPress } from "../../../context/WordPressContext";
import { HEADER_CONFIG, getCurrentTheme } from "../../../config/components";
import Navigation from "../Navigation";
import HeroBackground from "./HeroBackground";
import HeroSlider from "./HeroSlider";
import SearchModal from "../../Search/SearchModal"; // Import de la modal

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();
  const [currentTheme, setCurrentTheme] = useState("neon");
  const [isSearchOpen, setIsSearchOpen] = useState(false); // État pour la modal

  // Écouter les changements de thème depuis le HeroSlider
  useEffect(() => {
    if (!showHero) return;

    // Observer les changements de variables CSS pour détecter le changement de thème
    const observer = new MutationObserver(() => {
      const theme = getCurrentTheme();
      setCurrentTheme(theme);
    });

    // Observer les changements sur le root element
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // Alternative: écouter les changements de variables CSS
    const handleThemeChange = () => {
      const gradient = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--current-gradient");

      if (gradient.includes("var(--gradient-primary)")) {
        setCurrentTheme("neon");
      } else if (gradient.includes("var(--gradient-warm)")) {
        setCurrentTheme("sunset");
      }
    };

    // Vérifier le thème initial
    handleThemeChange();

    // Écouter les changements de propriétés CSS
    const interval = setInterval(handleThemeChange, 100);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [showHero]);

  // Gestionnaire pour ouvrir la modal de recherche
  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  // Gestionnaire pour fermer la modal de recherche
  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  // Raccourci clavier pour ouvrir la recherche (Ctrl+K ou Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="relative">
      {showHero && <HeroBackground />}

      <div className="z-navigation sticky top-0">
        <Navigation
          menuItems={menus?.items || []}
          siteTitle={siteData?.site_title || HEADER_CONFIG.defaults.siteTitle}
          loading={loading.menus}
          currentTheme={currentTheme}
          onSearchClick={handleSearchOpen} // Passer le gestionnaire à Navigation
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

      {/* Modal de recherche */}
      <SearchModal isOpen={isSearchOpen} onClose={handleSearchClose} />
    </header>
  );
};

export default Header;
