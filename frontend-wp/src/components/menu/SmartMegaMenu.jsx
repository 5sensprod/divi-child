import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, ShoppingCart, ChevronDown } from "lucide-react";

// Hook Portal (inchangé)
const useMegaMenuPortal = () => {
  const [portalContainer, setPortalContainer] = useState(null);

  useEffect(() => {
    let container = document.getElementById("mega-menu-portal");
    if (!container) {
      container = document.createElement("div");
      container.id = "mega-menu-portal";
      Object.assign(container.style, {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        pointerEvents: "none",
        zIndex: "10000",
        overflow: "visible",
      });
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      if (container && container.children.length === 0) {
        try {
          document.body.removeChild(container);
        } catch (e) {
          // Ignore si déjà supprimé
        }
      }
    };
  }, []);

  return portalContainer;
};

const scrollUtils = {
  // Bloquer le scroll de la page
  disable: () => {
    // Sauvegarder la position actuelle
    const scrollY = window.scrollY;

    // Appliquer les styles pour bloquer le scroll
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "hidden";

    // Stocker la position pour la restaurer plus tard
    document.body.setAttribute("data-scroll-lock", scrollY.toString());
  },

  // Restaurer le scroll de la page
  enable: () => {
    const scrollY = document.body.getAttribute("data-scroll-lock");

    // Supprimer les styles de blocage
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    document.body.style.overflowY = "";

    // Restaurer la position de scroll
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY));
      document.body.removeAttribute("data-scroll-lock");
    }
  },
};

// Méga menu avec gestion améliorée du hover
const SmartMegaMenu = ({
  isVisible,
  triggerRef,
  type,
  data,
  onClose,
  convertToReactUrl,
  onMouseEnter, // Nouveau prop
  onMouseLeave, // Nouveau prop
}) => {
  const portalContainer = useMegaMenuPortal();
  const menuRef = useRef(null);
  const [menuStyles, setMenuStyles] = useState({});

  // Calcul de position (inchangé)
  useEffect(() => {
    if (isVisible && triggerRef.current && portalContainer) {
      const calculatePosition = () => {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight,
          scrollY: window.pageYOffset || document.documentElement.scrollTop,
        };

        const baseTop = triggerRect.bottom + viewport.scrollY;
        const triggerCenterX = triggerRect.left + triggerRect.width / 2;

        let menuWidth;
        if (type === "container_mega_menu") {
          if (window.innerWidth >= 1280) {
            menuWidth = Math.min(1200, viewport.width - 40);
          } else if (window.innerWidth >= 1024) {
            menuWidth = Math.min(1000, viewport.width - 40);
          } else if (window.innerWidth >= 768) {
            menuWidth = Math.min(800, viewport.width - 40);
          } else {
            menuWidth = viewport.width - 20;
          }
        } else if (type === "category_mega_menu") {
          if (window.innerWidth >= 1024) {
            menuWidth = Math.min(900, viewport.width - 40);
          } else if (window.innerWidth >= 768) {
            menuWidth = Math.min(700, viewport.width - 40);
          } else {
            menuWidth = viewport.width - 20;
          }
        } else {
          menuWidth = Math.min(320, viewport.width - 40);
        }

        let positionX = triggerCenterX - menuWidth / 2;
        const margin = 20;
        if (positionX < margin) {
          positionX = margin;
        } else if (positionX + menuWidth > viewport.width - margin) {
          positionX = viewport.width - menuWidth - margin;
        }

        const maxHeight = Math.min(600, viewport.height * 0.8);

        setMenuStyles({
          position: "absolute",
          top: `${baseTop}px`,
          left: `${positionX}px`,
          width: `${menuWidth}px`,
          maxHeight: `${maxHeight}px`,
          maxWidth: `${menuWidth}px`,
          overflowY: "auto",
          overflowX: "hidden",
          pointerEvents: "auto",
          zIndex: 10001,
        });
      };

      setTimeout(calculatePosition, 10);

      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isVisible, triggerRef, portalContainer, type]);

  if (!portalContainer || !isVisible) return null;

  // Correction de la mise en page du méga menu - remplacez votre renderContent()

  const renderContent = () => {
    const baseClasses =
      "bg-white shadow-2xl border border-gray-200 rounded-lg overflow-hidden animate-slide-down";

    switch (type) {
      case "container_mega_menu":
        return (
          <div
            className={baseClasses}
            style={{
              height: "fit-content",
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "80vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* Grille responsive avec classes Tailwind pures */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {data?.child_categories_data?.map((childCategory) => (
                <div key={childCategory.id} className="space-y-4 min-w-0">
                  {/* Titre de la catégorie */}
                  <div className="border-b border-gray-200 pb-3">
                    <Link
                      to={convertToReactUrl(childCategory.url) || "#"}
                      className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors block"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={childCategory.title}
                      onClick={onClose}
                    >
                      {childCategory.title}
                      {childCategory.product_count && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({childCategory.product_count})
                        </span>
                      )}
                    </Link>
                  </div>

                  {/* Sous-catégories */}
                  <div className="space-y-2">
                    {childCategory.sub_categories?.slice(0, 6).map((subCat) => {
                      let finalUrl;
                      if (subCat.hierarchical_url) {
                        finalUrl = subCat.hierarchical_url;
                      } else {
                        const parentSlug =
                          childCategory.category_slug ||
                          childCategory.woocommerce_category?.slug;
                        if (parentSlug) {
                          finalUrl = `/categorie-produit/${parentSlug}/${subCat.slug}`;
                        } else {
                          finalUrl = `/categorie-produit/${subCat.slug}`;
                        }
                      }

                      return (
                        <Link
                          key={subCat.id}
                          to={finalUrl}
                          className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={subCat.name}
                          onClick={onClose}
                        >
                          {subCat.name}
                          <span className="text-xs text-gray-400 ml-1">
                            ({subCat.count})
                          </span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Message par défaut si pas de sous-catégories */}
                  {!childCategory.sub_categories?.length && (
                    <p className="text-sm text-gray-500 italic">
                      Découvrez notre sélection de{" "}
                      {childCategory.title.toLowerCase()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "category_mega_menu":
        return (
          <div
            className={baseClasses}
            style={{
              height: "fit-content",
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "80vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* Grille 3 colonnes responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              {/* Colonne 1: Sous-catégories */}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">
                  Sous-catégories
                </h3>
                <div className="space-y-2">
                  {data?.sub_categories?.map((subCat) => {
                    let finalUrl;
                    if (subCat.hierarchical_url) {
                      finalUrl = subCat.hierarchical_url;
                    } else {
                      const parentSlug =
                        data.category_slug || data.woocommerce_category?.slug;
                      if (parentSlug) {
                        finalUrl = `/categorie-produit/${parentSlug}/${subCat.slug}`;
                      } else {
                        finalUrl = `/categorie-produit/${subCat.slug}`;
                      }
                    }

                    return (
                      <Link
                        key={subCat.id}
                        to={finalUrl}
                        className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-1"
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={subCat.name}
                        onClick={onClose}
                      >
                        {subCat.name}
                        <span className="text-xs text-gray-400 ml-1">
                          ({subCat.count})
                        </span>
                      </Link>
                    );
                  })}

                  {!data?.sub_categories?.length && (
                    <p className="text-sm text-gray-500 italic">
                      Aucune sous-catégorie disponible
                    </p>
                  )}
                </div>
              </div>

              {/* Colonne 2: Navigation rapide */}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">
                  Navigation
                </h3>
                <div className="space-y-3">
                  <Link
                    to={convertToReactUrl(data?.url) || "#"}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 px-4 rounded-lg font-semibold transition-colors"
                    onClick={onClose}
                  >
                    Voir tous les produits
                  </Link>

                  <Link
                    to={`${convertToReactUrl(data?.url)}?orderby=popularity`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 border border-gray-200 rounded"
                    onClick={onClose}
                  >
                    ↗ Produits populaires
                  </Link>
                  <Link
                    to={`${convertToReactUrl(data?.url)}?orderby=date`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 border border-gray-200 rounded"
                    onClick={onClose}
                  >
                    ✨ Nouveautés
                  </Link>
                  <Link
                    to={`${convertToReactUrl(data?.url)}?on_sale=true`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors py-2 px-3 border border-gray-200 rounded"
                    onClick={onClose}
                  >
                    🏷️ Promotions
                  </Link>
                </div>
              </div>

              {/* Colonne 3: Info catégorie */}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3 mb-4">
                  {data?.title}
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-3">
                    Explorez notre gamme complète de{" "}
                    {data?.title?.toLowerCase()}
                  </p>
                  {data?.woocommerce_category?.count && (
                    <p className="text-xs text-gray-500">
                      {data.woocommerce_category.count} produits disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "simple_dropdown":
        return (
          <div
            className="bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden animate-slide-down"
            style={{
              width: "16rem",
              maxWidth: "calc(100vw - 2rem)",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            {data?.children?.map((child) => {
              const isReactRoute = (url) => {
                if (url === "/" || url === "" || url === "#") return true;
                return (
                  url.includes("/categorie-produit/") ||
                  url.includes("/shop") ||
                  url.includes("/contact") ||
                  url.includes("/about")
                );
              };

              const commonClasses =
                "block px-4 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors border-b border-white/5 last:border-b-0";

              if (isReactRoute(child.url)) {
                return (
                  <Link
                    key={child.id}
                    to={convertToReactUrl(child.url)}
                    className={commonClasses}
                    onClick={onClose}
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={child.title}
                  >
                    {child.title}
                  </Link>
                );
              }

              return (
                <a
                  key={child.id}
                  href={child.url}
                  className={commonClasses}
                  target={child.target || "_self"}
                  onClick={onClose}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={child.title}
                >
                  {child.title}
                </a>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return createPortal(
    <div
      style={menuStyles}
      ref={menuRef}
      onMouseEnter={onMouseEnter} // ✅ AJOUT des événements hover sur le menu
      onMouseLeave={onMouseLeave} // ✅ AJOUT des événements hover sur le menu
    >
      {renderContent()}
    </div>,
    portalContainer
  );
};

// Export du composant pour remplacer dans votre Navigation.jsx
export default SmartMegaMenu;
