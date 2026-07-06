// src/components/Layout/Navigation.jsx
// Version optimisée avec séparation des responsabilités

import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { MenuSkeleton } from "../UI/LoadingSkeleton";
import { HEADER_CONFIG } from "../../config/components";
import AxeLogo from "../logo/AxeLogo";
import MobileMenu from "../navigation/MobileMenu";
import { useNavigation } from "../navigation/useNavigation";
import {
  DesktopMenuItem,
  ActionButton,
  CartButton,
  MobileMenuButton,
} from "../navigation/MenuItems";
import MegaMenu from "./MegaMenu";
import HeaderWishlistButton from "../navigation/HeaderWishlistButton";

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
  const {
    isScrolled,
    mobileMenuOpen,
    openDropdowns,
    organizedMenu,
    toggleDropdown,
    openSingleDropdown,
    closeMobileMenu,
    toggleMobileMenu,
  } = useNavigation(menuItems);

  const { navigation } = HEADER_CONFIG;

  // Classes dynamiques optimisées
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
      <nav className={navClasses} translate="no">
        <div className="container-divi">
          <div
            className={`grid items-center gap-2 xl:gap-4 ${heightClasses} grid-cols-3 lg:grid-cols-[auto_1fr_auto]`}
          >
            {/* GAUCHE - Burger (mobile) + Logo desktop */}
            <div className="flex items-center justify-start">
              <MobileMenuButton
                isOpen={mobileMenuOpen}
                onClick={toggleMobileMenu}
                isScrolled={isScrolled}
              />

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

            {/* CENTRE - Logo mobile / Menu desktop */}
            <div className="justify-self-center lg:justify-self-stretch flex items-center">
              {/* Logo mobile */}
              <Link to="/" className="lg:hidden block" aria-label="Accueil">
                <AxeLogo
                  theme={currentTheme}
                  isScrolled={isScrolled}
                  isMobile={true}
                  className="transition-all duration-500 hover:scale-105"
                />
              </Link>

              {/* Menu desktop */}
              <div className="hidden lg:flex items-center justify-center flex-1 space-x-1 xl:space-x-3 2xl:space-x-4 nav-dropdown-container">
                {loading ? (
                  <MenuSkeleton />
                ) : (
                  <>
                    <a
                      href={navigation.soldes.url}
                      className="nav-link text-xs xl:text-sm 2xl:text-base font-medium text-pink-400 hover:text-pink-300 whitespace-nowrap border border-white/70 rounded-full px-3 py-1.5 transition-colors hover:border-white"
                    >
                      {navigation.soldes.label}
                    </a>

                    {organizedMenu.map((item) => (
                      <MegaMenu
                        key={item.id}
                        item={item}
                        isOpen={openDropdowns.has(item.id)}
                        onToggle={() => openSingleDropdown(item.id)}
                        onClose={() => toggleDropdown(item.id)}
                      />
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* DROITE - Actions */}
            <div className="flex items-center justify-end space-x-3">
              {showSearch && (
                <ActionButton
                  icon={Search}
                  label="Recherche"
                  onClick={onSearchClick}
                />
              )}

              <span
                data-wishlist-header-icon
                className="inline-flex items-center justify-center"
              >
                <HeaderWishlistButton />
              </span>

              {showCart && <CartButton count={cartCount} />}
            </div>
          </div>
        </div>
      </nav>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <MobileMenu
          menuItems={organizedMenu}
          loading={loading}
          onClose={closeMobileMenu}
          siteTitle={siteTitle}
          config={navigation.mobileMenu}
          currentTheme={currentTheme}
        />
      )}
    </>
  );
};

export default Navigation;
