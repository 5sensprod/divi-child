// src/components/Layout/Navigation.jsx
// Version mise à jour avec gestion des catégories React

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { MenuSkeleton } from "../UI/LoadingSkeleton";
import { HEADER_CONFIG } from "../../config/components";
import { API_CONFIG } from "../../utils/constants"; // Import de votre config
import AxeLogo from "../UI/AxeLogo";

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
  const [openDropdowns, setOpenDropdowns] = useState(new Set());

  const { navigation } = HEADER_CONFIG;

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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".nav-dropdown-container")) {
        setOpenDropdowns(new Set());
      }
    };

    if (openDropdowns.size > 0) {
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [openDropdowns]);

  // Build menu structure
  const organizedMenu = useMemo(() => {
    if (!menuItems?.length) return [];

    const buildMenuTree = (parentId = "0") => {
      return menuItems
        .filter((item) => item.parent === parentId.toString())
        .map((item) => ({
          ...item,
          children: buildMenuTree(item.id),
        }));
    };

    return buildMenuTree();
  }, [menuItems]);

  // ✨ NOUVELLE LOGIQUE : Déterminer si c'est une route React
  const isReactRoute = (url) => {
    // Routes toujours React
    if (url === "/" || url === "" || url === "#") return true;

    // Si les catégories React sont activées
    if (API_CONFIG.useReactCategories) {
      // Vérifier si c'est une URL de catégorie WooCommerce (CORRIGÉ avec vos vraies URLs)
      if (url.includes("/categorie-produit/") || url.includes("/shop")) {
        return true;
      }
    }

    // Autres routes spécifiques React
    const reactRoutes = ["/contact", "/about", "/mentions-legales"];
    return reactRoutes.some((route) => url.includes(route));
  };

  // ✨ NOUVELLE FONCTION : Convertir URL WordPress vers React
  const convertToReactUrl = (url) => {
    // Page d'accueil
    if (url === "/" || url === "" || url === "#") return "/";

    // Si les catégories React sont activées
    if (API_CONFIG.useReactCategories) {
      // Convertir les URLs WordPress complètes en URLs React
      if (url.includes("/categorie-produit/")) {
        // Extraire le slug de catégorie depuis l'URL WordPress
        // https://axemusique.shop/categorie-produit/guitares-electriques/ -> /product-category/guitares-electriques
        const match = url.match(/\/categorie-produit\/([^\/]+)/);
        if (match) {
          return `/categorie-produit/${match[1]}`;
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

  const toggleDropdown = (itemId) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);

      const findItem = (items, id) => {
        for (const item of items) {
          if (item.id === id) return item;
          if (item.children?.length > 0) {
            const found = findItem(item.children, id);
            if (found) return found;
          }
        }
        return null;
      };

      const clickedItem = findItem(organizedMenu, itemId);
      if (!clickedItem) return newSet;

      if (clickedItem.parent === "0") {
        const level1Items = organizedMenu.map((item) => item.id);
        level1Items.forEach((id) => {
          if (id !== itemId) newSet.delete(id);
        });
      }

      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }

      return newSet;
    });
  };

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
      {/* Spacer pour menu fixe */}

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

              <div className="hidden lg:flex items-center justify-center flex-1 space-x-4 nav-dropdown-container">
                {loading ? (
                  <MenuSkeleton />
                ) : (
                  organizedMenu.map((item) => (
                    <DesktopMenuItem
                      key={item.id}
                      item={item}
                      isActive={isActive}
                      isReactRoute={isReactRoute}
                      convertToReactUrl={convertToReactUrl}
                      openDropdowns={openDropdowns}
                      toggleDropdown={toggleDropdown}
                    />
                  ))
                )}
              </div>
            </div>

            {/* DROITE — Actions */}
            <div className="flex items-center justify-end space-x-3">
              {showSearch && (
                <ActionButton
                  icon={Search}
                  label="Recherche"
                  onClick={onSearchClick}
                />
              )}
              {showCart && <CartButton count={cartCount} />}
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Overlay */}
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

// Action Button component
const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick} // ← AJOUTER CETTE LIGNE
    className="p-2 text-white/90 hover:text-pink-300 transition-colors"
    aria-label={label}
  >
    <Icon size={20} />
  </button>
);

// Cart Button component
const CartButton = ({ count }) => (
  <button
    className="relative p-2 text-white/90 hover:text-pink-300 transition-colors"
    aria-label="Panier"
  >
    <ShoppingCart size={20} />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </button>
);

// ✨ CORRECTION : DesktopMenuItem modifié
const DesktopMenuItem = ({
  item,
  isActive,
  isReactRoute,
  convertToReactUrl, // ← Cette prop existe déjà
  openDropdowns,
  toggleDropdown,
  level = 1,
}) => {
  const hasChildren = item.children?.length > 0;
  const isDropdownOpen = openDropdowns.has(item.id);

  // Item sans enfants
  if (!hasChildren) {
    if (isReactRoute(item.url)) {
      // ✅ CORRECTION : Utiliser convertToReactUrl au lieu de l'URL originale
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

  // Item avec enfants - reste identique
  return (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(item.id)}
        className={`nav-link nav-link-inactive flex items-center space-x-1 ${
          isDropdownOpen ? "text-pink-300" : ""
        }`}
      >
        <span>{item.title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <div
          className={`absolute top-full left-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden z-dropdown animate-slide-down ${
            level === 1 ? "w-64" : "w-56"
          }`}
        >
          {item.children.map((child) => (
            <DropdownChildItem
              key={child.id}
              item={child}
              isReactRoute={isReactRoute}
              convertToReactUrl={convertToReactUrl} // ← Passer la fonction
              isActive={isActive}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              onClose={() => toggleDropdown(null)}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
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
