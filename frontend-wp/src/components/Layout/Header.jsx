import { useState, useEffect } from "react";
import { useWordPress } from "../../context/WordPressContext";
import { HEADER_CONFIG } from "../../config/components";
import Navigation from "../navigation/Navigation";
import Search from "../Search/Search";

const Header = () => {
  const { siteData, menus, loading } = useWordPress();
  const [currentTheme, setCurrentTheme] = useState("neon");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      <div className="z-navigation">
        <Navigation
          menuItems={menus?.items || []}
          siteTitle={siteData?.site_title || HEADER_CONFIG.defaults.siteTitle}
          loading={loading.menus}
          currentTheme={currentTheme}
          onSearchClick={handleSearchOpen}
          {...HEADER_CONFIG.navigation}
        />
      </div>

      {/* Modal de recherche */}
      <Search isOpen={isSearchOpen} onClose={handleSearchClose} />
    </header>
  );
};

export default Header;
