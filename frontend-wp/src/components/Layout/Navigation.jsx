// src/components/Layout/Navigation.jsx
// Version ultra-optimisée pour la performance

import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import {
  Disclosure,
  Menu as HeadlessMenu,
  Transition,
  DisclosureButton,
  DisclosurePanel,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { MenuSkeleton } from "../UI/LoadingSkeleton";

const Navigation = ({
  menuItems = [],
  siteTitle = "Axe Musique",
  loading = false,
  showSearch = true,
  showCart = true,
  cartCount = 0,
}) => {
  const location = useLocation();

  // Organiser selon la hiérarchie WordPress avec mémoisation
  const organizedMenu = useMemo(() => {
    if (!menuItems || menuItems.length === 0) return [];

    const topLevel = menuItems.filter((item) => item.parent === "0");
    const getChildren = (parentId) => {
      return menuItems.filter((item) => item.parent === parentId.toString());
    };

    return topLevel.map((parent) => {
      const directChildren = getChildren(parent.id);
      const childrenWithSubChildren = directChildren.map((child) => ({
        ...child,
        children: getChildren(child.id),
      }));

      return {
        ...parent,
        children: childrenWithSubChildren,
      };
    });
  }, [menuItems]);

  const getRouterPath = useCallback((wpUrl) => {
    if (wpUrl === "#") return "#";
    if (wpUrl === "/") return "/";
    if (wpUrl.includes("categorie-produit/")) {
      const slug = wpUrl.split("categorie-produit/")[1].replace("/", "");
      return `/categorie/${slug}`;
    }
    return wpUrl;
  }, []);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  return (
    <nav className="relative z-[1000] w-full">
      <div className="container-divi">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 z-[1010]">
            <img
              src="/assets/images/Logo_Axe_full.svg"
              alt="Axe Musique"
              width="200"
              className="h-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Menu + Actions */}
          <div className="flex items-center space-x-6">
            {/* Menu desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {loading || !menuItems || menuItems.length === 0 ? (
                <MenuSkeleton />
              ) : (
                organizedMenu.map((item) => (
                  <DesktopMenuItem
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    getRouterPath={getRouterPath}
                  />
                ))
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3 z-[1010]">
              {showSearch && (
                <button className="p-2 text-white/90 hover:text-pink-300 transition-colors">
                  <Search size={20} />
                </button>
              )}

              {showCart && (
                <button className="relative p-2 text-white/90 hover:text-pink-300 transition-colors">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Menu mobile ultra-rapide */}
              <MobileMenuPerformant
                menuItems={organizedMenu}
                loading={loading}
                getRouterPath={getRouterPath}
                isActive={isActive}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Composant desktop optimisé
const DesktopMenuItem = ({ item, isActive, getRouterPath }) => {
  const hasChildren = item.children && item.children.length > 0;
  const path = getRouterPath(item.url);

  if (!hasChildren) {
    return (
      <Link
        to={path}
        className={`px-3 py-2 text-sm font-light uppercase tracking-wide transition-colors font-['Coda'] ${
          isActive(path) ? "text-pink-300" : "text-white/90 hover:text-pink-300"
        }`}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <HeadlessMenu as="div" className="relative">
      {({ open }) => (
        <>
          <MenuButton className="flex items-center space-x-1 px-3 py-2 text-sm font-light uppercase tracking-wide transition-colors font-['Coda'] text-white/90 hover:text-pink-300 data-[open]:text-pink-300">
            <span>{item.title}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : ""
              }`}
            />
          </MenuButton>

          {/* Menu simplifié sans Transition pour plus de performance */}
          <MenuItems className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 border border-white/10 rounded-lg shadow-xl overflow-hidden z-[1030] focus:outline-none">
            {item.children.map((child) => (
              <MenuItem key={child.id}>
                <Link
                  to={getRouterPath(child.url)}
                  className="block px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-b-0 text-white/90 data-[focus]:bg-white/10 data-[focus]:text-pink-300"
                >
                  {child.title}
                </Link>
              </MenuItem>
            ))}
          </MenuItems>
        </>
      )}
    </HeadlessMenu>
  );
};

// Menu mobile ultra-performant
const MobileMenuPerformant = ({
  menuItems,
  loading,
  getRouterPath,
  isActive,
}) => {
  return (
    <Disclosure as="div" className="lg:hidden">
      <DisclosureButton className="p-3 text-white/90 hover:text-pink-300 hover:bg-white/10 rounded-lg transition-all duration-100 active:scale-95 data-[open]:text-pink-300">
        {({ open }) => (open ? <X size={24} /> : <Menu size={28} />)}
      </DisclosureButton>

      {/* Menu sans transitions pour performance maximale */}
      <DisclosurePanel className="fixed top-0 left-0 right-0 z-[1050] bg-gray-900 will-change-transform">
        {({ close }) => (
          <>
            {/* Overlay simple - pas de blur, pas d'animation */}
            <div className="fixed inset-0 bg-black/80 -z-10" onClick={close} />

            {/* Header simplifié */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/20 bg-gray-900">
              <img
                src="/assets/images/Logo_Axe_full.svg"
                alt="Axe Musique"
                width="120"
                className="h-auto"
              />
              <button
                onClick={close}
                className="p-2 text-white/90 hover:text-pink-300 hover:bg-white/10 rounded-lg transition-colors duration-100 active:scale-95"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenu optimisé */}
            <div className="px-4 py-4 max-h-[calc(100vh-80px)] overflow-y-auto bg-gray-900">
              {loading || !menuItems || menuItems.length === 0 ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-700/50 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <MobileMenuItemPerformant
                      key={item.id}
                      item={item}
                      getRouterPath={getRouterPath}
                      isActive={isActive}
                      onClose={close}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

// Élément de menu mobile ultra-optimisé
const MobileMenuItemPerformant = ({
  item,
  getRouterPath,
  isActive,
  onClose,
}) => {
  const hasChildren = item.children && item.children.length > 0;

  if (!hasChildren) {
    return (
      <Link
        to={getRouterPath(item.url)}
        className={`block px-4 py-3 rounded-lg transition-colors duration-100 font-['Coda'] uppercase text-sm tracking-wide font-light active:scale-[0.98] ${
          isActive(getRouterPath(item.url))
            ? "text-pink-300 bg-pink-500/20"
            : "text-white/90 hover:bg-white/10 hover:text-pink-300"
        }`}
        onClick={onClose}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <Disclosure as="div" className="mb-1">
      <DisclosureButton className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors duration-100 font-['Coda'] uppercase text-sm tracking-wide font-light data-[open]:text-pink-300 data-[open]:bg-white/5 active:scale-[0.98]">
        {({ open }) => (
          <>
            <span>{item.title}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-150 ${
                open ? "rotate-180 text-pink-300" : ""
              }`}
            />
          </>
        )}
      </DisclosureButton>

      {/* Sous-menu sans transition pour performance */}
      <DisclosurePanel className="mt-1 ml-4 space-y-1">
        {item.children.map((child) => (
          <Link
            key={child.id}
            to={getRouterPath(child.url)}
            className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-100 active:scale-[0.98] ${
              isActive(getRouterPath(child.url))
                ? "text-pink-300 bg-pink-500/10 border-l-2 border-pink-300"
                : "text-white/70 hover:bg-white/10 hover:text-pink-300"
            }`}
            onClick={onClose}
          >
            {child.title}
          </Link>
        ))}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default Navigation;
