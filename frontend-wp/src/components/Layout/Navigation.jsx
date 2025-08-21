// src/components/Layout/Navigation.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { MenuSkeleton, MobileMenuSkeleton } from "../UI/LoadingSkeleton";

const Navigation = ({
  menuItems = [],
  siteTitle = "Axe Musique",
  loading = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Fermer dropdown en cliquant dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Organiser selon la hiérarchie WordPress
  const organizeWordPressMenu = () => {
    if (!menuItems || menuItems.length === 0) return [];

    const topLevel = menuItems.filter((item) => item.parent === "0");

    const getChildren = (parentId) => {
      return menuItems.filter((item) => item.parent === parentId.toString());
    };

    const organizedMenu = topLevel.map((parent) => {
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

    return organizedMenu;
  };

  const organizedMenu = organizeWordPressMenu();

  const getRouterPath = (wpUrl) => {
    if (wpUrl === "#") return "#";
    if (wpUrl === "/") return "/";

    if (wpUrl.includes("categorie-produit/")) {
      const slug = wpUrl.split("categorie-produit/")[1].replace("/", "");
      return `/categorie/${slug}`;
    }

    return wpUrl;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative z-50" ref={dropdownRef}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img
                src="/assets/images/Logo_Axe_full.svg"
                alt="Axe Musique Logo"
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "block";
                }}
              />
              <div
                className="hidden h-12 w-12 bg-gradient-to-br from-pink-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                style={{ display: "none" }}
              >
                A
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {loading || !menuItems || menuItems.length === 0 ? (
              <MenuSkeleton />
            ) : (
              organizedMenu.map((parentItem) => {
                const hasChildren =
                  parentItem.children && parentItem.children.length > 0;
                const path = getRouterPath(parentItem.url);

                return (
                  <div key={parentItem.id} className="relative">
                    {hasChildren ? (
                      // Parent avec enfants
                      <div>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === parentItem.id
                                ? null
                                : parentItem.id
                            )
                          }
                          className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-all duration-300 ${
                            openDropdown === parentItem.id
                              ? "text-pink-300"
                              : "text-white/90 hover:text-pink-300"
                          }`}
                        >
                          <span>{parentItem.title}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${
                              openDropdown === parentItem.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Mega dropdown */}
                        {openDropdown === parentItem.id && (
                          <div className="absolute top-full left-0 mt-2 w-72 bg-black/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                            {parentItem.children.map((childItem) => {
                              const childPath = getRouterPath(childItem.url);
                              const hasSubChildren =
                                childItem.children &&
                                childItem.children.length > 0;

                              return (
                                <div key={childItem.id}>
                                  {hasSubChildren ? (
                                    // Enfant avec sous-enfants
                                    <div>
                                      <div className="px-4 py-2 text-sm font-semibold text-pink-300 bg-white/5 border-b border-white/10">
                                        {childItem.title}
                                      </div>
                                      {childItem.children.map((subChild) => {
                                        const subChildPath = getRouterPath(
                                          subChild.url
                                        );
                                        return (
                                          <Link
                                            key={subChild.id}
                                            to={subChildPath}
                                            className="block px-6 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-pink-300 transition-all duration-300"
                                            onClick={() =>
                                              setOpenDropdown(null)
                                            }
                                          >
                                            {subChild.title}
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  ) : (
                                    // Enfant simple
                                    <Link
                                      to={childPath}
                                      className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-all duration-300"
                                      onClick={() => setOpenDropdown(null)}
                                    >
                                      {childItem.title}
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      // Parent simple
                      <Link
                        to={path}
                        className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
                          isActive(path)
                            ? "text-pink-300"
                            : "text-white/90 hover:text-pink-300"
                        }`}
                      >
                        {parentItem.title}
                        <span
                          className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-400 to-cyan-400 transition-all duration-300 ${
                            isActive(path) ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        />
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-3 hover:bg-white/10 rounded-full transition-all duration-300 text-white/90 hover:text-pink-300 hover:scale-110">
              <Search size={20} />
            </button>
            <button className="relative p-3 hover:bg-white/10 rounded-full transition-all duration-300 text-white/90 hover:text-pink-300 hover:scale-110">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-cyan-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                0
              </span>
            </button>
            <button
              className="md:hidden p-3 hover:bg-white/10 rounded-full transition-all duration-300 text-white/90 hover:text-pink-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <>
            {loading || !menuItems || menuItems.length === 0 ? (
              <MobileMenuSkeleton />
            ) : (
              <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10">
                <div className="container mx-auto px-4 py-6 max-h-96 overflow-y-auto">
                  {organizedMenu.map((parentItem) => {
                    const hasChildren =
                      parentItem.children && parentItem.children.length > 0;

                    return (
                      <div key={parentItem.id} className="mb-2">
                        {hasChildren ? (
                          <div>
                            <button
                              onClick={() =>
                                setOpenDropdown(
                                  openDropdown === `mobile-${parentItem.id}`
                                    ? null
                                    : `mobile-${parentItem.id}`
                                )
                              }
                              className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-pink-300 transition-all duration-300"
                            >
                              <span>{parentItem.title}</span>
                              <ChevronDown
                                size={16}
                                className={`transition-transform duration-300 ${
                                  openDropdown === `mobile-${parentItem.id}`
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </button>

                            {openDropdown === `mobile-${parentItem.id}` && (
                              <div className="mt-2 ml-4 space-y-1">
                                {parentItem.children.map((childItem) => {
                                  const childPath = getRouterPath(
                                    childItem.url
                                  );
                                  return (
                                    <Link
                                      key={childItem.id}
                                      to={childPath}
                                      className="block px-4 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-pink-300 transition-all duration-300"
                                      onClick={() => setIsMenuOpen(false)}
                                    >
                                      {childItem.title}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={getRouterPath(parentItem.url)}
                            className="block px-4 py-3 rounded-lg text-white/90 hover:bg-white/10 hover:text-pink-300 transition-all duration-300"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {parentItem.title}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
