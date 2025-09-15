// src/components/Layout/Navigation.jsx - Version avec Portal React
import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { MenuSkeleton } from "../UI/LoadingSkeleton";
import { HEADER_CONFIG } from "../../config/components";
import { API_CONFIG } from "../../utils/constants";
import AxeLogo from "../UI/AxeLogo";
import SmartMegaMenu from "../menu/SmartMegaMenu";

// Composant principal DesktopMenuItemWithMega modifié pour utiliser le Portal
const DesktopMenuItemWithMega = ({
  item,
  isActive,
  isReactRoute,
  convertToReactUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const menuItemRef = useRef(null);
  const hoverTimeoutRef = useRef(null); // ✅ Timeout pour éviter les fermetures accidentelles

  // Charger toutes les catégories
  useEffect(() => {
    const loadAllCategories = async () => {
      try {
        const { getCategories } = await import("../../services/woocommerce");
        const categories = await getCategories();
        setAllCategories(categories);
      } catch (error) {
        console.error("Erreur chargement catégories:", error);
      }
    };

    if (allCategories.length === 0) {
      loadAllCategories();
    }
  }, []);

  const shouldShowMegaMenu = () => {
    if (item.menu_type === "container" && item.has_category_children) {
      return "container_mega_menu";
    }
    if (item.menu_type === "category_with_children" && item.has_subcategories) {
      return "category_mega_menu";
    }
    if ((!item.url || item.url === "#") && item.children?.length > 0) {
      const hasCategories = item.children.some(
        (child) => child.url && child.url.includes("/categorie-produit/")
      );
      if (hasCategories) return "container_simple";
    }
    if (item.children?.length > 0) {
      return "simple_dropdown";
    }
    return false;
  };

  const megaMenuType = shouldShowMegaMenu();

  // ✅ FONCTIONS DE GESTION DU HOVER AMÉLIORÉES
  const handleMouseEnter = () => {
    // Annuler tout timeout de fermeture en cours
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    // Délai avant fermeture pour permettre le passage de la souris
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 150); // 150ms de délai
  };

  const handleMenuMouseEnter = () => {
    // Annuler la fermeture si on entre dans le menu
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMenuMouseLeave = () => {
    // Fermeture immédiate si on quitte le menu
    setIsHovered(false);
  };

  // Nettoyer les timeouts au démontage
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Item sans enfants - lien simple
  if (!megaMenuType) {
    if (isReactRoute(item.url)) {
      const reactPath = convertToReactUrl(item.url);
      return (
        <Link
          to={reactPath}
          className={`nav-link ${
            isActive(reactPath) ? "nav-link-active" : "nav-link-inactive"
          }`}
        >
          {item.title}
        </Link>
      );
    }

    return (
      <a
        href={item.url}
        className="nav-link nav-link-inactive"
        target={item.target || "_self"}
      >
        {item.title}
      </a>
    );
  }

  // Item avec méga menu
  return (
    <>
      <div
        ref={menuItemRef}
        className="relative group"
        onMouseEnter={handleMouseEnter} // ✅ Utiliser les nouvelles fonctions
        onMouseLeave={handleMouseLeave} // ✅ Utiliser les nouvelles fonctions
      >
        <div className="nav-link nav-link-inactive flex items-center space-x-1 cursor-pointer">
          <span>{item.title}</span>
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${
              isHovered ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Méga menu avec gestion du hover */}
      <SmartMegaMenu
        isVisible={isHovered}
        triggerRef={menuItemRef}
        type={megaMenuType}
        data={item}
        onClose={() => setIsHovered(false)}
        convertToReactUrl={convertToReactUrl}
        onMouseEnter={handleMenuMouseEnter} // ✅ Passer les fonctions de hover
        onMouseLeave={handleMenuMouseLeave} // ✅ Passer les fonctions de hover
      />
    </>
  );
};
// Composant Navigation principal (reste identique sauf le DesktopMenuItemWithMega)
const Navigation = ({
  menuItems = [],
  siteTitle = HEADER_CONFIG.defaults.siteTitle,
  loading = false,
  showSearch = HEADER_CONFIG.navigation.showSearch,
  showCart = HEADER_CONFIG.navigation.showCart,
  cartCount = HEADER_CONFIG.navigation.cartCount,
  scrollThreshold = HEADER_CONFIG.navigation.scrollThreshold,
  currentTheme = "neon",
  onSearchClick,
}) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [megaMenuData, setMegaMenuData] = useState([]);
  const [megaMenuLoading, setMegaMenuLoading] = useState(false);

  const { navigation } = HEADER_CONFIG;

  // Charger les données du méga menu
  useEffect(() => {
    const loadMegaMenuData = async () => {
      if (menuItems?.length > 0 && megaMenuData.length === 0) {
        setMegaMenuLoading(true);
        try {
          const { buildMegaMenuData } = await import(
            "../../services/woocommerce"
          );
          const enrichedData = await buildMegaMenuData(menuItems);
          setMegaMenuData(enrichedData);
        } catch (error) {
          console.error("Erreur chargement méga menu:", error);
          setMegaMenuData(menuItems);
        } finally {
          setMegaMenuLoading(false);
        }
      }
    };

    loadMegaMenuData();
  }, [menuItems]);

  // Scroll detection
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > scrollThreshold;
          if (shouldBeScrolled !== isScrolled) setIsScrolled(shouldBeScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold, isScrolled]);

  // Close mobile on resize ≥ lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Build menu structure
  const organizedMenu = useMemo(() => {
    const dataToUse = megaMenuData.length > 0 ? megaMenuData : menuItems;
    if (!dataToUse?.length) return [];

    const buildMenuTree = (parentId = "0") => {
      return dataToUse
        .filter((item) => item.parent === parentId.toString())
        .map((item) => ({
          ...item,
          children: buildMenuTree(item.id),
        }));
    };

    return buildMenuTree();
  }, [menuItems, megaMenuData]);

  // Fonctions utilitaires
  const isReactRoute = (url) => {
    if (url === "/" || url === "" || url === "#") return true;
    if (API_CONFIG.useReactCategories) {
      if (url.includes("/categorie-produit/") || url.includes("/shop")) {
        return true;
      }
    }
    const reactRoutes = ["/contact", "/about", "/mentions-legales"];
    return reactRoutes.some((route) => url.includes(route));
  };

  const convertToReactUrl = (url) => {
    if (url === "/" || url === "" || url === "#") return "/";
    if (API_CONFIG.useReactCategories) {
      if (url.includes("/categorie-produit/")) {
        const match = url.match(/\/categorie-produit\/(.+?)(?:\/)?$/);
        if (match) {
          const fullPath = match[1];
          return `/categorie-produit/${fullPath}`;
        }
      }
      if (url.includes("/shop")) {
        return "/shop";
      }
    }
    return url;
  };

  const isActive = (path) => location.pathname === path;
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Classes dynamiques
  const navClasses = `fixed top-0 left-0 right-0 w-full z-navigation transition-all duration-300 ${
    isScrolled
      ? `${navigation.styles.background.scrolled} ${navigation.styles.padding.scrolled}`
      : `${navigation.styles.background.normal} ${navigation.styles.padding.normal}`
  }`;

  const heightClasses = isScrolled
    ? navigation.styles.height.scrolled
    : navigation.styles.height.normal;

  return (
    <>
      <nav className={navClasses}>
        <div className="container-divi">
          <div
            className={`grid items-center gap-4 ${heightClasses} grid-cols-3 lg:grid-cols-[auto_1fr_auto]`}
          >
            {/* GAUCHE — Burger (mobile) + Logo desktop */}
            <div className="flex items-center justify-start">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden text-white/90 hover:text-pink-300 hover:bg-white/10 rounded-lg transition-all active:scale-95 ${
                  isScrolled ? "p-2" : "p-3"
                } ${mobileMenuOpen ? "text-pink-300" : ""}`}
                aria-label="Ouvrir le menu"
              >
                {mobileMenuOpen ? (
                  <X size={isScrolled ? 22 : 24} />
                ) : (
                  <Menu size={isScrolled ? 26 : 28} />
                )}
              </button>

              <Link to="/" className="hidden lg:flex flex-shrink-0">
                <AxeLogo
                  theme={currentTheme}
                  isScrolled={isScrolled}
                  isMobile={false}
                  className="transition-all duration-500 hover:scale-105"
                  style={{ transformOrigin: "left center" }}
                />
              </Link>
            </div>

            {/* CENTRE — Logo mobile / Menu desktop */}
            <div className="justify-self-center lg:justify-self-stretch flex items-center">
              <Link to="/" className="lg:hidden block" aria-label="Accueil">
                <AxeLogo
                  theme={currentTheme}
                  isScrolled={isScrolled}
                  isMobile={true}
                  className="transition-all duration-500 hover:scale-105"
                />
              </Link>

              <div className="hidden lg:flex items-center justify-center flex-1 space-x-4">
                {loading || megaMenuLoading ? (
                  <MenuSkeleton />
                ) : (
                  organizedMenu.map((item) => (
                    <DesktopMenuItemWithMega
                      key={item.id}
                      item={item}
                      isActive={isActive}
                      isReactRoute={isReactRoute}
                      convertToReactUrl={convertToReactUrl}
                    />
                  ))
                )}
              </div>
            </div>

            {/* DROITE — Actions */}
            <div className="flex items-center justify-end space-x-3">
              {showSearch && (
                <button
                  onClick={onSearchClick}
                  className="p-2 text-white/90 hover:text-pink-300 transition-colors"
                  aria-label="Recherche"
                >
                  <Search size={20} />
                </button>
              )}
              {showCart && (
                <button
                  className="relative p-2 text-white/90 hover:text-pink-300 transition-colors"
                  aria-label="Panier"
                >
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Overlay - Gardez votre implémentation existante */}
      {mobileMenuOpen && (
        <MobileMenu
          menuItems={organizedMenu}
          loading={loading}
          isReactRoute={isReactRoute}
          convertToReactUrl={convertToReactUrl}
          isActive={isActive}
          onClose={closeMobileMenu}
          siteTitle={siteTitle}
          config={navigation.mobileMenu}
          currentTheme={currentTheme}
          onSearchClick={onSearchClick}
          showSearch={showSearch}
        />
      )}
    </>
  );
};

// ✨ CORRECTION : DropdownChildItem modifié
const DropdownChildItem = ({
  item,
  isReactRoute,
  convertToReactUrl, // ← Ajouter cette prop
  isActive,
  openDropdowns,
  toggleDropdown,
  onClose,
  level = 2,
}) => {
  const hasChildren = item.children?.length > 0;
  const isSubmenuOpen = openDropdowns.has(item.id);
  const commonClasses =
    "block px-4 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors border-b border-white/5 last:border-b-0";

  // Item sans enfants
  if (!hasChildren) {
    if (isReactRoute(item.url)) {
      // ✅ CORRECTION : Utiliser convertToReactUrl
      const reactPath = convertToReactUrl(item.url);
      return (
        <Link to={reactPath} className={commonClasses} onClick={onClose}>
          <span className={level > 2 ? "ml-4" : ""}>{item.title}</span>
        </Link>
      );
    }

    return (
      <a
        href={item.url}
        className={commonClasses}
        target={item.target || "_self"}
      >
        <span className={level > 2 ? "ml-4" : ""}>{item.title}</span>
      </a>
    );
  }

  // Item avec enfants - crée un sous-menu
  return (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(item.id)}
        className={`w-full text-left ${commonClasses} flex items-center justify-between ${
          isSubmenuOpen ? "text-pink-300 bg-white/5" : ""
        }`}
      >
        <span className={level > 2 ? "ml-4" : ""}>{item.title}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isSubmenuOpen ? "rotate-180 text-pink-300" : ""
          }`}
        />
      </button>

      {isSubmenuOpen && (
        <div className="ml-4 border-l border-white/10">
          {item.children.map((child) => (
            <DropdownChildItem
              key={child.id}
              item={child}
              isReactRoute={isReactRoute}
              convertToReactUrl={convertToReactUrl} // ← Passer la fonction
              isActive={isActive}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ✨ COMPOSANT MOBILE MENU MANQUANT
const MobileMenu = ({
  menuItems,
  loading,
  isReactRoute,
  convertToReactUrl,
  isActive,
  onClose,
  siteTitle,
  config,
  currentTheme,
  onSearchClick,
  showSearch,
}) => {
  const [openMobileMenus, setOpenMobileMenus] = useState(new Set());

  const toggleMobileSubmenu = (itemId) => {
    setOpenMobileMenus((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }

      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 z-mobile-menu animate-fade-in">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div
        className={`fixed top-0 left-0 right-0 ${config.background} animate-slide-down`}
      >
        {/* Header avec logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <AxeLogo
            width="120"
            theme={currentTheme}
            isScrolled={false}
            isMobile={true}
            alt={siteTitle}
          />
          <button
            onClick={onClose}
            className="p-2 text-white/90 hover:text-pink-300 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className={`px-4 py-4 ${config.maxHeight} overflow-y-auto`}>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-700/50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.id}
                  item={item}
                  isReactRoute={isReactRoute}
                  convertToReactUrl={convertToReactUrl}
                  isActive={isActive}
                  onClose={onClose}
                  openMobileMenus={openMobileMenus}
                  toggleMobileSubmenu={toggleMobileSubmenu}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ✨ CORRECTION : MobileMenuItem modifié
const MobileMenuItem = ({
  item,
  isReactRoute,
  convertToReactUrl, // ← Ajouter cette prop
  isActive,
  onClose,
  openMobileMenus,
  toggleMobileSubmenu,
  level = 1,
}) => {
  const hasChildren = item.children?.length > 0;
  const isSubmenuOpen = openMobileMenus.has(item.id);
  const indentClass = level > 1 ? `ml-${level * 2}` : "";

  // Item sans enfants
  if (!hasChildren) {
    const commonClasses = `mobile-menu-item ${indentClass}`;

    if (isReactRoute(item.url)) {
      // ✅ CORRECTION : Utiliser convertToReactUrl
      const reactPath = convertToReactUrl(item.url);
      return (
        <Link
          to={reactPath}
          className={`${commonClasses} ${
            isActive(reactPath)
              ? "mobile-menu-item-active"
              : "mobile-menu-item-inactive"
          }`}
          onClick={onClose}
        >
          {item.title}
        </Link>
      );
    }

    return (
      <a
        href={item.url}
        className={`${commonClasses} mobile-menu-item-inactive`}
        target={item.target || "_self"}
      >
        {item.title}
      </a>
    );
  }

  // Item avec enfants
  return (
    <div className="mb-1">
      <button
        onClick={() => toggleMobileSubmenu(item.id)}
        className={`mobile-menu-item mobile-menu-item-inactive w-full flex items-center justify-between ${indentClass} ${
          isSubmenuOpen ? "text-pink-300 bg-white/5" : ""
        }`}
      >
        <span>{item.title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-150 ${
            isSubmenuOpen ? "rotate-180 text-pink-300" : ""
          }`}
        />
      </button>

      {isSubmenuOpen && (
        <div className="mt-1 space-y-1 animate-slide-down">
          {item.children.map((child) => (
            <MobileMenuItem
              key={child.id}
              item={child}
              isReactRoute={isReactRoute}
              convertToReactUrl={convertToReactUrl} // ← Passer la fonction
              isActive={isActive}
              onClose={onClose}
              openMobileMenus={openMobileMenus}
              toggleMobileSubmenu={toggleMobileSubmenu}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Navigation;
