// src/components/menu/SmartMegaMenu.jsx - Version complète avec Portal React
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { ChevronRight, Package, Tag, Grid3X3 } from "lucide-react";

const SmartMegaMenu = ({
  isVisible,
  triggerRef,
  menuPosition, // Position calculée par le parent
  type,
  data,
  onClose,
  convertToReactUrl,
  onMouseEnter,
  onMouseLeave,
  isScrolled, // État de scroll pour ajustements visuels
  allCategories = [], // Toutes les catégories disponibles
}) => {
  const [portalContainer, setPortalContainer] = useState(null);
  const [menuDimensions, setMenuDimensions] = useState({ width: 0, height: 0 });
  const menuRef = useRef(null);

  // Créer le container du portal au montage
  useEffect(() => {
    let container = document.getElementById("mega-menu-portal");
    if (!container) {
      container = document.createElement("div");
      container.id = "mega-menu-portal";
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Nettoyer seulement si le container est vide
      if (
        container &&
        container.children.length === 0 &&
        container.parentNode
      ) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  // Calculer les dimensions du menu pour éviter les débordements
  useEffect(() => {
    if (menuRef.current && isVisible) {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuDimensions({ width: rect.width, height: rect.height });
    }
  }, [isVisible, type, data]);

  // Ne pas rendre si pas visible ou pas de position
  if (!isVisible || !menuPosition || !portalContainer) {
    return null;
  }

  // Calculer la position avec protection contre les débordements
  const calculatePosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    let left = menuPosition.left;
    let top = menuPosition.top;

    // Protection débordement horizontal
    if (left + menuDimensions.width > viewportWidth - 20) {
      left = Math.max(20, viewportWidth - menuDimensions.width - 20);
    }

    // Protection débordement vertical
    if (top + menuDimensions.height > viewportHeight + scrollY - 20) {
      // Afficher au-dessus du déclencheur si pas assez de place en dessous
      top = menuPosition.top - menuDimensions.height - 10;

      // Si toujours pas assez de place, forcer dans la viewport
      if (top < scrollY + 20) {
        top = scrollY + 20;
      }
    }

    return { left, top };
  };

  const { left, top } = calculatePosition();

  // Style de positionnement
  const menuStyle = {
    position: "fixed",
    left: `${left}px`,
    top: `${top}px`,
    minWidth: `${Math.max(menuPosition.width, 250)}px`,
    maxWidth: "min(90vw, 1200px)",
    zIndex: 10001,
    pointerEvents: "auto",
  };

  // Classes CSS adaptatives selon l'état de scroll et le type
  const getContainerClasses = () => {
    const baseClasses =
      "bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 animate-slide-down overflow-hidden";

    const heightClass = isScrolled ? "max-h-[400px]" : "max-h-[500px]";

    const typeClasses = {
      container_mega_menu: "w-full",
      category_mega_menu: "w-full",
      container_simple: "min-w-[250px]",
      simple_dropdown: "min-w-[220px]",
    };

    return `${baseClasses} ${heightClass} ${
      typeClasses[type] || "min-w-[250px]"
    }`;
  };

  // Rendu du contenu selon le type de menu
  const renderContent = () => {
    switch (type) {
      case "container_mega_menu":
        return (
          <ContainerMegaMenu
            data={data}
            onClose={onClose}
            convertToReactUrl={convertToReactUrl}
          />
        );
      case "category_mega_menu":
        return (
          <CategoryMegaMenu
            data={data}
            onClose={onClose}
            convertToReactUrl={convertToReactUrl}
          />
        );
      case "container_simple":
        return (
          <SimpleContainer
            data={data}
            onClose={onClose}
            convertToReactUrl={convertToReactUrl}
          />
        );
      case "simple_dropdown":
        return (
          <SimpleDropdown
            data={data}
            onClose={onClose}
            convertToReactUrl={convertToReactUrl}
          />
        );
      default:
        return (
          <div className="p-4 text-white/70">
            Type de menu non reconnu: {type}
          </div>
        );
    }
  };

  return createPortal(
    <div
      ref={menuRef}
      style={menuStyle}
      className={getContainerClasses()}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {renderContent()}
    </div>,
    portalContainer
  );
};

// Composant pour le méga menu container avec catégories
const ContainerMegaMenu = ({ data, onClose, convertToReactUrl }) => {
  // Utiliser child_categories_data qui contient les vraies données
  const children =
    data.child_categories_data || data.children || data.items || [];

  // DEBUG temporaire pour voir la structure des sous-catégories
  if (children.length > 0) {
    console.log("🔍 Premier enfant avec ses sous-catégories:", {
      title: children[0].title,
      sub_categories: children[0].sub_categories,
      children: children[0].children,
      subcategories: children[0].subcategories,
      allKeys: Object.keys(children[0]),
    });
  }

  if (!children || children.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-white/70 mb-2">
          <Grid3X3 size={32} className="mx-auto mb-2 opacity-50" />
          Aucune catégorie disponible
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {children.map((category, index) => (
          <CategoryBlock
            key={category.id || index}
            category={category}
            onClose={onClose}
            convertToReactUrl={convertToReactUrl}
          />
        ))}
      </div>
    </div>
  );
};

// Bloc de catégorie pour le méga menu
const CategoryBlock = ({ category, onClose, convertToReactUrl }) => {
  // Vérifier toutes les structures possibles selon vos données WooCommerce
  const children =
    category.sub_categories ||
    category.children ||
    category.subcategories ||
    [];
  const hasChildren = children && children.length > 0;
  const displayLimit = 8;
  const hasMore = hasChildren && children.length > displayLimit;

  return (
    <div className="space-y-3">
      {/* Titre de la catégorie */}
      <div className="flex items-center space-x-2">
        <Tag size={14} className="text-pink-300" />
        <h3 className="font-semibold text-pink-300 text-sm uppercase tracking-wide hover:text-pink-200 transition-colors">
          {convertToReactUrl && category.url ? (
            <Link to={convertToReactUrl(category.url)} onClick={onClose}>
              {category.title || category.name}
            </Link>
          ) : (
            <a href={category.url || "#"} onClick={onClose}>
              {category.title || category.name}
            </a>
          )}
        </h3>
      </div>

      {/* Liste des sous-catégories */}
      {hasChildren && (
        <ul className="space-y-2">
          {children.slice(0, displayLimit).map((subcat, index) => (
            <li key={subcat.id || index}>
              <div className="flex items-center space-x-2 group">
                <ChevronRight
                  size={12}
                  className="text-white/30 group-hover:text-pink-300 transition-colors"
                />
                {/* Utiliser hierarchical_url en priorité, sinon construire l'URL */}
                {convertToReactUrl ? (
                  <Link
                    to={
                      subcat.hierarchical_url
                        ? convertToReactUrl(subcat.hierarchical_url)
                        : convertToReactUrl(subcat.url || "#")
                    }
                    className="text-white/80 hover:text-pink-300 transition-colors text-sm block py-1 flex-1"
                    onClick={onClose}
                  >
                    {subcat.name || subcat.title}
                    {subcat.count && (
                      <span className="text-white/40 text-xs ml-1">
                        ({subcat.count})
                      </span>
                    )}
                  </Link>
                ) : (
                  <a
                    href={subcat.hierarchical_url || subcat.url || "#"}
                    className="text-white/80 hover:text-pink-300 transition-colors text-sm block py-1 flex-1"
                    onClick={onClose}
                  >
                    {subcat.name || subcat.title}
                    {subcat.count && (
                      <span className="text-white/40 text-xs ml-1">
                        ({subcat.count})
                      </span>
                    )}
                  </a>
                )}
              </div>
            </li>
          ))}

          {/* Lien "Voir tout" si plus d'éléments */}
          {hasMore && (
            <li className="pt-2 mt-2 border-t border-white/10">
              {convertToReactUrl && category.url ? (
                <Link
                  to={convertToReactUrl(category.url)}
                  className="text-pink-400 hover:text-pink-300 transition-colors text-xs uppercase tracking-wide flex items-center space-x-1"
                  onClick={onClose}
                >
                  <Package size={12} />
                  <span>Voir tout ({children.length})</span>
                </Link>
              ) : (
                <a
                  href={category.url || "#"}
                  className="text-pink-400 hover:text-pink-300 transition-colors text-xs uppercase tracking-wide flex items-center space-x-1"
                  onClick={onClose}
                >
                  <Package size={12} />
                  <span>Voir tout ({children.length})</span>
                </a>
              )}
            </li>
          )}
        </ul>
      )}

      {/* Message si pas de sous-catégories */}
      {!hasChildren && (
        <p className="text-white/50 text-xs italic">Aucune sous-catégorie</p>
      )}
    </div>
  );
};

// Composant pour le méga menu catégorie avec sous-catégories
const CategoryMegaMenu = ({ data, onClose, convertToReactUrl }) => {
  const hasSubcategories = data.subcategories && data.subcategories.length > 0;

  if (!hasSubcategories) {
    return (
      <div className="p-4">
        <div className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded transition-colors">
          <Tag size={16} className="text-pink-300" />
          {convertToReactUrl && data.url ? (
            <Link
              to={convertToReactUrl(data.url)}
              className="text-white/80 hover:text-pink-300 transition-colors flex-1"
              onClick={onClose}
            >
              {data.title}
            </Link>
          ) : (
            <a
              href={data.url || "#"}
              className="text-white/80 hover:text-pink-300 transition-colors flex-1"
              onClick={onClose}
            >
              {data.title}
            </a>
          )}
        </div>
      </div>
    );
  }

  const displayLimit = 15;
  const hasMore = data.subcategories.length > displayLimit;

  return (
    <div className="p-4 overflow-y-auto">
      {/* Titre principal */}
      <div className="mb-4 pb-3 border-b border-white/10">
        <h3 className="text-pink-300 font-semibold flex items-center space-x-2">
          <Grid3X3 size={16} />
          <span>{data.title}</span>
          {data.count && (
            <span className="text-white/40 text-sm">
              ({data.count} produits)
            </span>
          )}
        </h3>
      </div>

      {/* Grille des sous-catégories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.subcategories.slice(0, displayLimit).map((subcat) => (
          <div
            key={subcat.id}
            className="flex items-center space-x-2 p-2 hover:bg-white/5 rounded transition-colors"
          >
            <ChevronRight size={14} className="text-white/40" />
            {convertToReactUrl && subcat.url ? (
              <Link
                to={convertToReactUrl(subcat.url)}
                className="text-white/80 hover:text-pink-300 transition-colors flex-1 text-sm"
                onClick={onClose}
              >
                {subcat.name}
                {subcat.count && (
                  <span className="text-white/40 text-xs ml-1">
                    ({subcat.count})
                  </span>
                )}
              </Link>
            ) : (
              <a
                href={subcat.url || "#"}
                className="text-white/80 hover:text-pink-300 transition-colors flex-1 text-sm"
                onClick={onClose}
              >
                {subcat.name}
                {subcat.count && (
                  <span className="text-white/40 text-xs ml-1">
                    ({subcat.count})
                  </span>
                )}
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Lien "Voir tout" */}
      {hasMore && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {convertToReactUrl && data.url ? (
            <Link
              to={convertToReactUrl(data.url)}
              className="text-pink-400 hover:text-pink-300 transition-colors text-sm flex items-center space-x-2"
              onClick={onClose}
            >
              <Package size={16} />
              <span>
                Voir toutes les sous-catégories ({data.subcategories.length})
              </span>
            </Link>
          ) : (
            <a
              href={data.url || "#"}
              className="text-pink-400 hover:text-pink-300 transition-colors text-sm flex items-center space-x-2"
              onClick={onClose}
            >
              <Package size={16} />
              <span>
                Voir toutes les sous-catégories ({data.subcategories.length})
              </span>
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// Composant pour le container simple
const SimpleContainer = ({ data, onClose, convertToReactUrl }) => {
  // Utiliser la structure de données appropriée
  const children =
    data.child_categories_data || data.children || data.items || [];

  if (!children || children.length === 0) {
    return (
      <div className="p-4 text-white/70 text-center">
        Aucun élément disponible
      </div>
    );
  }

  return (
    <div className="py-2 min-w-[250px] max-h-80 overflow-y-auto">
      {children.map((child, index) => (
        <div
          key={child.id || index}
          className="hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center space-x-2 px-4 py-2">
            <ChevronRight size={14} className="text-white/40" />
            {convertToReactUrl && child.url ? (
              <Link
                to={convertToReactUrl(child.url)}
                className="text-white/80 hover:text-pink-300 transition-colors flex-1"
                onClick={onClose}
              >
                {child.title || child.name}
              </Link>
            ) : (
              <a
                href={child.url || "#"}
                className="text-white/80 hover:text-pink-300 transition-colors flex-1"
                onClick={onClose}
              >
                {child.title || child.name}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Composant pour le dropdown simple avec hiérarchie
const SimpleDropdown = ({ data, onClose, convertToReactUrl }) => {
  if (!data.children || data.children.length === 0) {
    return (
      <div className="p-4 text-white/70 text-center">
        Aucun élément disponible
      </div>
    );
  }

  return (
    <div className="py-2 min-w-[220px] max-h-96 overflow-y-auto">
      {data.children.map((child) => (
        <DropdownItem
          key={child.id}
          item={child}
          level={0}
          onClose={onClose}
          convertToReactUrl={convertToReactUrl}
        />
      ))}
    </div>
  );
};

// Item individuel du dropdown avec support de la hiérarchie
const DropdownItem = ({ item, level = 0, onClose, convertToReactUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const paddingClass = level > 0 ? `pl-${4 + level * 4}` : "pl-4";

  return (
    <div>
      {/* Item principal */}
      <div className={`hover:bg-white/5 transition-colors ${paddingClass}`}>
        <div className="flex items-center py-2 pr-4">
          {hasChildren ? (
            <>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mr-2 p-1 hover:bg-white/10 rounded transition-colors"
              >
                <ChevronRight
                  size={12}
                  className={`text-white/60 transition-transform ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
              <span className="text-white/80 hover:text-pink-300 transition-colors cursor-pointer flex-1">
                {item.title}
              </span>
            </>
          ) : (
            <>
              <ChevronRight size={12} className="text-white/40 mr-2" />
              {convertToReactUrl && item.url ? (
                <Link
                  to={convertToReactUrl(item.url)}
                  className="text-white/80 hover:text-pink-300 transition-colors flex-1"
                  onClick={onClose}
                >
                  {item.title}
                </Link>
              ) : (
                <a
                  href={item.url || "#"}
                  className="text-white/80 hover:text-pink-300 transition-colors flex-1"
                  onClick={onClose}
                >
                  {item.title}
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Enfants (si expanded) */}
      {hasChildren && isExpanded && (
        <div className="animate-slide-down">
          {item.children.map((child) => (
            <DropdownItem
              key={child.id}
              item={child}
              level={level + 1}
              onClose={onClose}
              convertToReactUrl={convertToReactUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartMegaMenu;
