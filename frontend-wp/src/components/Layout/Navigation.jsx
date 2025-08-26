// src/components/Layout/Navigation.jsx
// Version corrigée avec redirection vers pages WordPress

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { MenuSkeleton } from "../UI/LoadingSkeleton";
import { HEADER_CONFIG } from "../../config/components";
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
      // Si on clique en dehors du menu de navigation
      if (!event.target.closest(".nav-dropdown-container")) {
        setOpenDropdowns(new Set());
      }
    };

    // Ajouter l'écouteur seulement si des dropdowns sont ouverts
    if (openDropdowns.size > 0) {
      document.addEventListener("click", handleOutsideClick);
      return () => document.removeEventListener("click", handleOutsideClick);
    }
  }, [openDropdowns]);

  // Build menu structure - Version récursive pour tous les niveaux
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

  // Déterminer si c'est une route React ou WordPress
  const isReactRoute = (url) => {
    return url === "/" || url === "" || url === "#";
  };

  const isActive = (path) => location.pathname === path;
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleDropdown = (itemId) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Classes dynamiques depuis la config
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
      <div className={`w-full transition-all duration-300 ${heightClasses}`} />

      <nav className={navClasses}>
        <div className="container-divi">
          {/* NAV BAR: grid 3 colonnes */}
          <div
            className={`grid items-center gap-4 ${heightClasses} grid-cols-3 lg:grid-cols-[auto_1fr_auto]`}
          >
            {/* GAUCHE – Burger (mobile) + Logo desktop */}
            <div className="flex items-center justify-start">
              {/* Burger MOBILE */}
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

              {/* Logo DESKTOP */}
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

            {/* CENTRE – Logo mobile (centré) / Menu desktop */}
            <div className="justify-self-center lg:justify-self-stretch flex items-center">
              {/* Logo MOBILE centré */}
              <Link to="/" className="lg:hidden block" aria-label="Accueil">
                <AxeLogo
                  theme={currentTheme}
                  isScrolled={isScrolled}
                  isMobile={true}
                  className="transition-all duration-500 hover:scale-105"
                />
              </Link>

              {/* Menu DESKTOP */}
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
                      openDropdowns={openDropdowns}
                      toggleDropdown={toggleDropdown}
                    />
                  ))
                )}
              </div>
            </div>

            {/* DROITE – Actions */}
            <div className="flex items-center justify-end space-x-3">
              {showSearch && <ActionButton icon={Search} label="Recherche" />}
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
          isActive={isActive}
          onClose={closeMobileMenu}
          siteTitle={siteTitle}
          config={navigation.mobileMenu}
          currentTheme={currentTheme}
        />
      )}
    </>
  );
};

// Action Button component
const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
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

// Desktop menu item component - VERSION RÉCURSIVE
const DesktopMenuItem = ({
  item,
  isActive,
  isReactRoute,
  openDropdowns,
  toggleDropdown,
  level = 1, // Niveau de profondeur
}) => {
  const hasChildren = item.children?.length > 0;
  const isDropdownOpen = openDropdowns.has(item.id);

  // Item sans enfants
  if (!hasChildren) {
    if (isReactRoute(item.url)) {
      const path = item.url === "#" ? "/" : item.url;
      return (
        <Link
          to={path}
          className={`nav-link ${
            isActive(path) ? "nav-link-active" : "nav-link-inactive"
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

  // Item avec enfants - gérer différents niveaux
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

// Composant pour les items enfants du dropdown - VERSION RÉCURSIVE
const DropdownChildItem = ({
  item,
  isReactRoute,
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
      const path = item.url === "#" ? "/" : item.url;
      return (
        <Link to={path} className={commonClasses} onClick={onClose}>
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

  // Item avec enfants - créer un sous-menu
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

// Menu mobile corrigé
const MobileMenu = ({
  menuItems,
  loading,
  isReactRoute,
  isActive,
  onClose,
  siteTitle,
  config,
  currentTheme,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const toggleSubmenu = (itemId) =>
    setOpenSubmenu(openSubmenu === itemId ? null : itemId);

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
                  isActive={isActive}
                  onClose={onClose}
                  openSubmenu={openSubmenu}
                  toggleSubmenu={toggleSubmenu}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile menu item component - VERSION RÉCURSIVE
const MobileMenuItem = ({
  item,
  isReactRoute,
  isActive,
  onClose,
  openSubmenu,
  toggleSubmenu,
  level = 1,
}) => {
  const hasChildren = item.children?.length > 0;
  const isSubmenuOpen = openSubmenu === item.id;
  const indentClass = level > 1 ? `ml-${level * 2}` : "";

  // Item sans enfants
  if (!hasChildren) {
    const commonClasses = `mobile-menu-item ${indentClass}`;

    if (isReactRoute(item.url)) {
      const path = item.url === "#" ? "/" : item.url;
      return (
        <Link
          to={path}
          className={`${commonClasses} ${
            isActive(path)
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
        onClick={() => toggleSubmenu(item.id)}
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
              isActive={isActive}
              onClose={onClose}
              openSubmenu={openSubmenu}
              toggleSubmenu={toggleSubmenu}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Navigation;
