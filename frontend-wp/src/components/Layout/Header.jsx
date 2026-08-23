import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWordPress } from "../../context/WordPressContext";
import { HEADER_CONFIG } from "../../config/components";
import Navigation from "../navigation/Navigation";
import Search from "../Search/Search";
import AxeSearch from "../Search/AxeSearch";
import { API_CONFIG } from "../../utils/constants";

const Header = () => {
  const location = useLocation();
  const { siteData, menus, loading } = useWordPress();
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

  // ─── L'entrée « Bons plans » disparaît sous `useAxeCatalog` ──────────────
  // Le menu est une donnée publiée, pas du code : on ne peut pas l'y retirer
  // depuis ici. On le filtre donc au passage, sinon l'entrée resterait cliquable
  // et mènerait à la page 404, la route ayant été retirée (`App.jsx`).
  const menuItems = (menus?.items || [])
    .filter(
      (item) =>
        !API_CONFIG.useAxeCatalog || !`${item.url}`.includes("/bons-plans"),
    )
    .map((item) => ({
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
          siteTitle={siteData?.site_title || HEADER_CONFIG.defaults.siteTitle}
          loading={loading.menus}
          currentTheme={currentTheme}
          fixedCompact={isProductPage}
          onSearchClick={handleSearchOpen}
          {...HEADER_CONFIG.navigation}
        />
      </div>

      {/* Modal de recherche — notre catalogue ou WooCommerce, jamais les deux */}
      {API_CONFIG.useAxeCatalog ? (
        <AxeSearch isOpen={isSearchOpen} onClose={handleSearchClose} />
      ) : (
        <Search isOpen={isSearchOpen} onClose={handleSearchClose} />
      )}
    </header>
  );
};

export default Header;
