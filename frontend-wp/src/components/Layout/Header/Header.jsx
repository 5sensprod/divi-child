import { useState, useEffect } from "react";
import { useWordPress } from "../../../context/WordPressContext";
import { HEADER_CONFIG, getCurrentTheme } from "../../../config/components";
import Navigation from "../Navigation";
import Background from "../../UI/Background";
import HeroSlider from "./HeroSlider";
import Search from "../../Search/Search";

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();
  const [currentTheme, setCurrentTheme] = useState("neon");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentSlideTheme, setCurrentSlideTheme] = useState("neon"); // État pour le thème de la slide

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

    // Alternative: écouter les changements de variables CSS avec détection améliorée
    const handleThemeChange = () => {
      const gradient = getComputedStyle(document.documentElement)
        .getPropertyValue("--current-gradient")
        .trim();

      // Amélioration de la détection des thèmes
      if (gradient.includes("var(--gradient-warm)")) {
        setCurrentSlideTheme("sunset");
      } else if (gradient.includes("var(--gradient-ocean)")) {
        setCurrentSlideTheme("oceanNight");
      } else if (gradient.includes("var(--gradient-havana)")) {
        setCurrentSlideTheme("havana");
      } else {
        setCurrentSlideTheme("neon");
      }

      console.log(
        "🎭 Header détecte thème:",
        gradient,
        "→",
        gradient.includes("var(--gradient-warm)")
          ? "sunset"
          : gradient.includes("var(--gradient-ocean)")
          ? "oceanNight"
          : gradient.includes("var(--gradient-havana)")
          ? "havana"
          : "neon"
      );
    };

    // Vérifier le thème initial
    handleThemeChange();

    // Écouter les changements de propriétés CSS plus fréquemment
    const interval = setInterval(handleThemeChange, 200);

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
