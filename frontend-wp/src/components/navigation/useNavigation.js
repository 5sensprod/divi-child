// src/components/navigation/useNavigation.js
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { API_CONFIG } from "../../utils/constants";

// `useWordPress()` n'est plus consommé ici : le menu ne lit plus les catégories
// WooCommerce (voir le bloc sur l'injection retirée, plus bas). Cet import
// supprimé est la preuve concrète que la navigation ne dépend plus du
// catalogue — elle ne rend plus que ce que `menu.json` contient.

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

    // ─── L'injection des sous-catégories WooCommerce a été RETIRÉE ─────────
    //
    // `buildCategoryChildren` greffait ici, au moment du rendu, les
    // sous-catégories lues chez WooCommerce sous toute entrée pointant vers une
    // catégorie racine. Le menu affiché n'était donc pas celui qui avait été
    // publié : sept entrées apparaissaient sous « Guitares classiques » sans
    // figurer dans `menu.json`.
    //
    // Retiré le 10 août 2026, volontairement, pour que le fichier publié par
    // PocketApp soit la SEULE source du menu. Trois conséquences voulues :
    // plus aucun appel à WordPress ni WooCommerce pour afficher le menu, les
    // sous-entrées redeviennent maîtrisables depuis PocketApp (ordre,
    // visibilité, libellé), et le menu affiché redevient exactement le menu
    // publié — donc diagnosticable en lisant le seul fichier.
    //
    // Le prix, assumé : le menu ne suit plus le catalogue tout seul. Une
    // nouvelle sous-catégorie n'apparaîtra que si on l'ajoute dans PocketApp et
    // qu'on republie. C'est l'échange demandé — l'indépendance contre
    // l'automatisme.
    //
    // Contexte complet : bloc « Le menu affiché n'est pas seulement le menu
    // publié » de docs/DECISIONS.md, dans le dépôt PocketApp.

    // Construction récursive de l'arbre
    const buildMenuTree = (parentId = "0") => {
      return menuItems
        .filter((item) => item.parent === parentId.toString())
        .map((item) => {
          const isReact = isReactRoute(item.url);
          const reactUrl = isReact ? convertToReactUrl(item.url) : item.url;

          // Les enfants viennent du menu publié, et de nulle part ailleurs.
          const children = buildMenuTree(item.id);

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
