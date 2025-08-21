// src/components/Layout/Navigation.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";
import { MenuSkeleton } from "../UI/LoadingSkeleton";

const Navigation = ({
  menuItems = [],
  siteTitle = "Axe Musique",
  loading = false,
  showSearch = true,
  showCart = true,
  cartCount = 0,
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
    <nav className="relative z-50 w-full" ref={dropdownRef}>
      <div className="container-divi">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/assets/images/Logo_Axe_full.svg"
              alt="Axe Musique"
              width="200"
              className="h-auto transition-transform duration-300 hover:scale-105"
            />
          </Link>

          {/* Menu desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {loading || !menuItems || menuItems.length === 0 ? (
              <MenuSkeleton />
            ) : (
              organizedMenu.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const path = getRouterPath(item.url);

                return (
                  <div key={item.id} className="relative">
                    {hasChildren ? (
                      <div>
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === item.id ? null : item.id
                            )
                          }
                          className={`flex items-center space-x-1 px-3 py-2 text-sm font-light uppercase tracking-wide transition-all font-['Coda'] ${
                            openDropdown === item.id
                              ? "text-pink-300"
                              : "text-white/90 hover:text-pink-300"
                          }`}
                        >
                          <span>{item.title}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform ${
                              openDropdown === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {openDropdown === item.id && (
                          <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl overflow-hidden z-50">
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                to={getRouterPath(child.url)}
                                className="block px-4 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-all"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {child.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={path}
                        className={`px-3 py-2 text-sm font-light uppercase tracking-wide transition-all font-['Coda'] ${
                          isActive(path)
                            ? "text-pink-300"
                            : "text-white/90 hover:text-pink-300"
                        }`}
                      >
                        {item.title}
                      </Link>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Facultatif */}
            {showSearch && (
              <button className="p-2 text-white/90 hover:text-pink-300 transition-colors">
                <Search size={20} />
              </button>
            )}

            {/* Cart - Facultatif */}
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

            {/* Menu mobile - Toujours affiché */}
            <button
              className="lg:hidden p-2 text-white/90 hover:text-pink-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10 py-4">
            {loading || !menuItems || menuItems.length === 0 ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              organizedMenu.map((item) => (
                <div key={item.id} className="py-2">
                  <Link
                    to={getRouterPath(item.url)}
                    className="block px-4 py-2 text-white/90 hover:text-pink-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
