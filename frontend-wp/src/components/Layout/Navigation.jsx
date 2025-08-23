// src/components/Layout/Navigation.jsx
// Version avec configuration centralisée depuis components.js

import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { MenuSkeleton } from "../UI/LoadingSkeleton";
import { HEADER_CONFIG } from "../../config/components";

const Navigation = ({
  menuItems = [],
  siteTitle = HEADER_CONFIG.defaults.siteTitle,
  loading = false,
  showSearch = HEADER_CONFIG.navigation.showSearch,
  showCart = HEADER_CONFIG.navigation.showCart,
  cartCount = HEADER_CONFIG.navigation.cartCount,
  scrollThreshold = HEADER_CONFIG.navigation.scrollThreshold,
}) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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

  // Build menu structure
  const organizedMenu = useMemo(() => {
    if (!menuItems?.length) return [];
    const topLevel = menuItems.filter((item) => item.parent === "0");
    const getChildren = (parentId) =>
      menuItems.filter((item) => item.parent === parentId.toString());
    return topLevel.map((parent) => ({
      ...parent,
      children: getChildren(parent.id),
    }));
  }, [menuItems]);

  const getRouterPath = (wpUrl) => {
    if (wpUrl === "#" || wpUrl === "/") return wpUrl;
    if (wpUrl.includes("categorie-produit/")) {
      const slug = wpUrl.split("categorie-produit/")[1].replace("/", "");
      return `/categorie/${slug}`;
    }
    return wpUrl;
  };

  const isActive = (path) => location.pathname === path;
  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleDropdown = (itemId) =>
    setActiveDropdown(activeDropdown === itemId ? null : itemId);

  // Classes dynamiques depuis la config
  const navClasses = `fixed top-0 left-0 right-0 w-full z-navigation transition-all duration-300 ${
    isScrolled
      ? `${navigation.styles.background.scrolled} ${navigation.styles.padding.scrolled}`
      : `${navigation.styles.background.normal} ${navigation.styles.padding.normal}`
  }`;

  const heightClasses = isScrolled
    ? navigation.styles.height.scrolled
    : navigation.styles.height.normal;

  const logoSize = isScrolled
    ? navigation.logo.desktop.scrolled
    : navigation.logo.desktop.normal;

  const mobileLogoClasses = isScrolled
    ? navigation.logo.mobile.scrolled
    : navigation.logo.mobile.normal;

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
            {/* GAUCHE — Burger (mobile) + Logo desktop */}
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
                <img
                  src={navigation.logo.path}
                  alt={navigation.logo.alt}
                  width={logoSize}
                  className={`h-auto transition-all duration-300 hover:scale-105 ${
                    isScrolled ? "scale-90" : "scale-100"
                  }`}
                  style={{ transformOrigin: "left center" }}
                />
              </Link>
            </div>

            {/* CENTRE — Logo mobile (centré) / Menu desktop */}
            <div className="justify-self-center lg:justify-self-stretch flex items-center">
              {/* Logo MOBILE centré */}
              <Link to="/" className="lg:hidden block" aria-label="Accueil">
                <img
                  src={navigation.logo.path}
                  alt={navigation.logo.alt}
                  className={`transition-all duration-300 hover:scale-105 ${mobileLogoClasses}`}
                />
              </Link>

              {/* Menu DESKTOP */}
              <div className="hidden lg:flex items-center justify-center flex-1 space-x-4">
                {loading ? (
                  <MenuSkeleton />
                ) : (
                  organizedMenu.map((item) => (
                    <DesktopMenuItem
                      key={item.id}
                      item={item}
                      isActive={isActive}
                      getRouterPath={getRouterPath}
                      activeDropdown={activeDropdown}
                      toggleDropdown={toggleDropdown}
                    />
                  ))
                )}
              </div>
            </div>

            {/* DROITE — Actions */}
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
          getRouterPath={getRouterPath}
          isActive={isActive}
          onClose={closeMobileMenu}
          siteTitle={siteTitle}
          config={navigation.mobileMenu}
          logoConfig={navigation.logo}
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

// Desktop menu item component
const DesktopMenuItem = ({
  item,
  isActive,
  getRouterPath,
  activeDropdown,
  toggleDropdown,
}) => {
  const hasChildren = item.children?.length > 0;
  const path = getRouterPath(item.url);
  const isDropdownOpen = activeDropdown === item.id;

  if (!hasChildren) {
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
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden z-dropdown animate-slide-down">
          {item.children.map((child) => (
            <Link
              key={child.id}
              to={getRouterPath(child.url)}
              className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors border-b border-white/5 last:border-b-0"
              onClick={() => toggleDropdown(null)}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// Mobile menu component
const MobileMenu = ({
  menuItems,
  loading,
  getRouterPath,
  isActive,
  onClose,
  siteTitle,
  config,
  logoConfig,
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
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <img
            src={logoConfig.path}
            alt={siteTitle}
            width={config.logoWidth}
            className="h-auto"
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
                  getRouterPath={getRouterPath}
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

// Mobile menu item component
const MobileMenuItem = ({
  item,
  getRouterPath,
  isActive,
  onClose,
  openSubmenu,
  toggleSubmenu,
}) => {
  const hasChildren = item.children?.length > 0;
  const path = getRouterPath(item.url);
  const isSubmenuOpen = openSubmenu === item.id;

  if (!hasChildren) {
    return (
      <Link
        to={path}
        className={`mobile-menu-item ${
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
    <div className="mb-1">
      <button
        onClick={() => toggleSubmenu(item.id)}
        className={`mobile-menu-item mobile-menu-item-inactive w-full flex items-center justify-between ${
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
        <div className="mt-1 ml-4 space-y-1 animate-slide-down">
          {item.children.map((child) => (
            <Link
              key={child.id}
              to={getRouterPath(child.url)}
              className={`block px-4 py-2 rounded-lg text-sm transition-colors active:scale-[0.98] ${
                isActive(getRouterPath(child.url))
                  ? "text-pink-300 bg-pink-500/10 border-l-2 border-pink-300"
                  : "text-white/70 hover:bg-white/10 hover:text-pink-300"
              }`}
              onClick={onClose}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Navigation;
