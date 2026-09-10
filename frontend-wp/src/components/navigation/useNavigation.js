// src/components/navigation/useNavigation.js
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { fetchOnlineCategories } from "../../services/axeCatalog";

export const useNavigation = (menuItems = []) => {
  const location = useLocation();
  const [catalogCategories, setCatalogCategories] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState(new Set());

  // Le menu publié garde la main sur ses entrées et leur ordre. Notre
  // catalogue complète automatiquement chaque catégorie avec les enfants qui
  // n'ont pas été ajoutés manuellement dans PocketApp.
  useEffect(() => {
    let cancelled = false;

    fetchOnlineCategories()
      .then((data) => {
        if (!cancelled) setCatalogCategories(data.categories || []);
      })
      .catch((error) => {
        console.warn("Sous-catégories du menu indisponibles :", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
      return url.includes("/categorie-produit/") || url.includes("/shop");
    };

    const convertToReactUrl = (url) => {
      if (!url || url === "/" || url === "" || url === "#") return "/";
      if (url.includes("/categorie-produit/")) {
        // Le CHEMIN COMPLET est conservé, y compris une hiérarchie
        // `parent/enfant`.
        //
        // Cette fonction ne gardait auparavant que le premier segment. C'était
        // sans conséquence tant que les sous-catégories étaient injectées
        // depuis WooCommerce avec leur `reactUrl` déjà calculée : elles ne
        // passaient pas par ici. Depuis que le menu publié est seul maître
        // (voir plus bas), une entrée `guitares-folk/folk-electro` serait
        // tronquée en `guitares-folk` et mènerait à la catégorie PARENTE, sans
        // erreur.
        //
        // `CategoryPage` résout sur le dernier segment (`CategoryPage.jsx:80-102`)
        // : un chemin complet fonctionne, et il conserve la clé de filtres et
        // le surlignage du menu, tous deux calés sur `location.pathname`.
        const match = url.match(/\/categorie-produit\/(.+?)\/?$/);
        if (match) return `/categorie-produit/${match[1]}`;
      }
      if (url.includes("/shop")) return "/shop";
      return url;
    };

    const categorySlugFromUrl = (url) => {
      const match = `${url || ""}`.match(
        /\/categorie-produit\/(?:.*\/)?([^/]+)\/?$/,
      );
      return match?.[1] || null;
    };

    const buildCatalogChildren = (parentCategory, parentMenuId) =>
      catalogCategories
        .filter(
          (category) => String(category.parent) === String(parentCategory.id),
        )
        .map((category) => {
          const reactUrl = `/categorie-produit/${category.slug}`;
          const id = `axe-cat-${category.id}`;

          return {
            id,
            title: category.name,
            url: reactUrl,
            parent: parentMenuId,
            isReactRoute: true,
            reactUrl,
            isActive: location.pathname === reactUrl,
            children: buildCatalogChildren(category, id),
          };
        });

    // Construction récursive de l'arbre
    const buildMenuTree = (parentId = "0", parentShowsCatalogChildren = true) => {
      return menuItems
        .filter((item) => item.parent === parentId.toString())
        .map((item) => {
          const isReact = isReactRoute(item.url);
          const reactUrl = isReact ? convertToReactUrl(item.url) : item.url;
          const showsCatalogChildren =
            parentShowsCatalogChildren && item.showCatalogChildren !== false;

          let children = buildMenuTree(item.id, showsCatalogChildren);
          const categorySlug = categorySlugFromUrl(item.url);
          const category = categorySlug
            ? catalogCategories.find(
                (candidate) => candidate.slug === categorySlug,
              )
            : null;

          if (category && showsCatalogChildren) {
            const publishedSlugs = new Set(
              children.map((child) => categorySlugFromUrl(child.url)),
            );
            const missingChildren = buildCatalogChildren(category, item.id)
              .filter(
                (child) => !publishedSlugs.has(categorySlugFromUrl(child.url)),
              );

            children = [...children, ...missingChildren];
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
  }, [menuItems, catalogCategories, location.pathname]);

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

  const openSingleDropdown = (itemId) => {
    setOpenDropdowns(new Set([itemId]));
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
    openSingleDropdown,
    closeMobileMenu,
    toggleMobileMenu,
  };
};
