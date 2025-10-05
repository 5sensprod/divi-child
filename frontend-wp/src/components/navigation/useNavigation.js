// src/components/navigation/useNavigation.js
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { API_CONFIG } from "../../utils/constants";
import { useWordPress } from "../../context/WordPressContext";

export const useNavigation = (menuItems = []) => {
  const location = useLocation();
  const { categories } = useWordPress();
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

    const isReactRoute = (url) => {
      if (!url || url === "/" || url === "" || url === "#") return true;
      if (API_CONFIG.useReactCategories) {
        return url.includes("/categorie-produit/") || url.includes("/shop");
      }
      const reactRoutes = ["/contact", "/about", "/mentions-legales"];
      return reactRoutes.some((route) => url.includes(route));
    };

    const convertToReactUrl = (url) => {
      if (!url || url === "/" || url === "" || url === "#") return "/";
      if (
        API_CONFIG.useReactCategories &&
        url.includes("/categorie-produit/")
      ) {
        const match = url.match(/\/categorie-produit\/([^\/]+)/);
        if (match) return `/categorie-produit/${match[1]}`;
      }
      if (url.includes("/shop")) return "/shop";
      return url;
    };

    // 👇 NOUVELLE FONCTION : Construire les sous-catégories depuis WooCommerce
    const buildCategoryChildren = (parentCategory) => {
      if (!categories?.length) return [];

      // Trouver toutes les catégories enfants
      return categories
        .filter((cat) => cat.parent === parentCategory.id)
        .map((cat) => {
          // Construire le chemin complet parent/enfant
          const fullPath = `${parentCategory.slug}/${cat.slug}`;

          return {
            id: `cat-${cat.id}`,
            title: cat.name,
            url: `/categorie-produit/${fullPath}`,
            parent: `cat-${parentCategory.id}`,
            isReactRoute: true,
            reactUrl: `/categorie-produit/${fullPath}`,
            isActive: location.pathname === `/categorie-produit/${fullPath}`,
            children: buildCategoryChildren(cat), // Récursif pour sous-sous-catégories
          };
        });
    };

    // Construction récursive de l'arbre
    const buildMenuTree = (parentId = "0") => {
      return menuItems
        .filter((item) => item.parent === parentId.toString())
        .map((item) => {
          const isReact = isReactRoute(item.url);
          const reactUrl = isReact ? convertToReactUrl(item.url) : item.url;

          let children = buildMenuTree(item.id);

          // 👇 NOUVEAU : Si c'est un lien vers une catégorie parente, ajouter ses enfants
          if (
            API_CONFIG.useReactCategories &&
            item.url.includes("/categorie-produit/")
          ) {
            const categorySlug = item.url.match(
              /\/categorie-produit\/([^\/]+)/
            )?.[1];
            if (categorySlug && categories?.length) {
              const parentCat = categories.find(
                (cat) => cat.slug === categorySlug && cat.parent === 0
              );
              if (parentCat) {
                const categoryChildren = buildCategoryChildren(parentCat);
                children = [...children, ...categoryChildren];
              }
            }
          }

          return {
            ...item,
            isReactRoute: isReact,
            reactUrl,
            isActive: isReact && location.pathname === reactUrl,
            children,
          };
        });
    };

    return buildMenuTree();
  }, [menuItems, categories, location.pathname]);

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
