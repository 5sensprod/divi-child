import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSiteMenu } from "../../context/MenuContext";
import { HEADER_CONFIG } from "../../config/components";
import Navigation from "../navigation/Navigation";
import AxeSearch from "../Search/AxeSearch";

const Header = () => {
  const location = useLocation();
  const { menu, loading } = useSiteMenu();
  const [currentTheme, setCurrentTheme] = useState("neon");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isProductPage = /^\/produit\/[^/]+\/?$/.test(location.pathname);

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

  const menuItems = (menu?.items || []).map((item) => ({
    ...item,
    // `true` par défaut dans `useNavigation`. Accessoires conserve
    // volontairement les seuls enfants définis dans le menu publié.
    showCatalogChildren:
      item.title?.trim().toLocaleLowerCase("fr") !== "accessoires",
  }));

  return (
    <header className="relative">
      <div className="z-navigation">
        <Navigation
          menuItems={menuItems}
          siteTitle={HEADER_CONFIG.defaults.siteTitle}
          loading={loading}
          currentTheme={currentTheme}
          fixedCompact={isProductPage}
          onSearchClick={handleSearchOpen}
          {...HEADER_CONFIG.navigation}
        />
      </div>

      <AxeSearch isOpen={isSearchOpen} onClose={handleSearchClose} />
    </header>
  );
};

export default Header;
