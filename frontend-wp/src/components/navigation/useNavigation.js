// src/components/navigation/useNavigation.js
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { API_CONFIG } from "../../utils/constants";

export const useNavigation = (menuItems = []) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState(new Set());

  // Gestion du scroll avec optimisation
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const shouldBeScrolled = window.scrollY > 60;
          if (shouldBeScrolled !== isScrolled) setIsScrolled(shouldBeScrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  // Fermer le menu mobile sur redimensionnement
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Fermer les dropdowns sur clic extérieur
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

  // Construction de l'arbre du menu avec logique de routing
  const organizedMenu = useMemo(() => {
    if (!menuItems?.length) return [];

    // Fonction pour déterminer si une URL est gérée par React
    const isReactRoute = (url) => {
      if (!url || url === "/" || url === "" || url === "#") return true;

      if (API_CONFIG.useReactCategories) {
        return url.includes("/categorie-produit/") || url.includes("/shop");
      }

      const reactRoutes = ["/contact", "/about", "/mentions-legales"];
      return reactRoutes.some((route) => url.includes(route));
    };

    // Fonction pour convertir une URL WordPress en route React
    const convertToReactUrl = (url) => {
      if (!url || url === "/" || url === "" || url === "#") return "/";

      if (
        API_CONFIG.useReactCategories &&
        url.includes("/categorie-produit/")
      ) {
        const match = url.match(/\/categorie-produit\/([^\/]+)/);
        if (match) {
          return `/categorie-produit/${match[1]}`;
        }
      }

      if (url.includes("/shop")) return "/shop";
      return url;
    };

    // Construction récursive de l'arbre
    const buildMenuTree = (parentId = "0") => {
      return menuItems
        .filter((item) => item.parent === parentId.toString())
        .map((item) => {
          const isReact = isReactRoute(item.url);
          const reactUrl = isReact ? convertToReactUrl(item.url) : item.url;

          return {
            ...item,
            isReactRoute: isReact,
            reactUrl,
            isActive: isReact && location.pathname === reactUrl,
            children: buildMenuTree(item.id),
          };
        });
    };

    return buildMenuTree();
  }, [menuItems, location.pathname]);

  // Actions
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

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return {
    // State
    isScrolled,
    mobileMenuOpen,
    openDropdowns,
    organizedMenu,

    // Actions
    toggleDropdown,
    closeMobileMenu,
    toggleMobileMenu,
  };
};
