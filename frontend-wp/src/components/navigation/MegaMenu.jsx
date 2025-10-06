// src/components/navigation/MegaMenu.jsx
import { useState, useRef, useEffect } from "react";
import { MenuLink } from "./MenuItems";
import { capitalize } from "../../utils/format";

const MegaMenu = ({ item, isOpen, onToggle, onClose }) => {
  const menuRef = useRef(null);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (!item.children?.length) return;

    const maxColumns = 4;
    const itemsPerColumn = Math.ceil(item.children.length / maxColumns);
    const cols = [];

    for (let i = 0; i < item.children.length; i += itemsPerColumn) {
      cols.push(item.children.slice(i, i + itemsPerColumn));
    }

    setColumns(cols);
  }, [item.children]);

  if (!item.children?.length) {
    return (
      <MenuLink
        item={item}
        className={`nav-link ${
          item.isActive ? "nav-link-active" : "nav-link-inactive"
        }`}
      />
    );
  }

  const handleMouseEnter = () => {
    if (!isOpen) onToggle();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        onMouseEnter={handleMouseEnter}
        className={`nav-link nav-link-inactive flex items-center space-x-1 ${
          isOpen ? "text-pink-300" : ""
        }`}
      >
        <span>{item.title}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl overflow-hidden z-dropdown animate-slide-down"
          onMouseLeave={onClose}
          style={{ minWidth: `${columns.length * 200}px`, maxWidth: "800px" }}
        >
          {/* Lien "Voir tout" si le parent est une catégorie */}
          {(item.reactUrl?.includes("/categorie-produit/") ||
            item.url?.includes("/categorie-produit/")) && (
            <div className="border-b border-white/10 p-4">
              <MenuLink
                item={item}
                className="block w-full text-center px-4 py-2 text-sm text-pink-300 hover:bg-white/10 hover:text-pink-400 transition-colors rounded-md font-medium"
                onClick={onClose}
              >
                ↗ Voir tout {item.title}
              </MenuLink>
            </div>
          )}

          <div
            className={`grid grid-cols-${Math.min(
              columns.length,
              4
            )} gap-1 p-4`}
          >
            {columns.map((col, colIndex) => (
              <div key={colIndex} className="space-y-1">
                {col.map((child) => (
                  <MegaMenuItem key={child.id} item={child} onClose={onClose} />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const MegaMenuItem = ({ item, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = item.children?.length > 0;
  const hasImage = item.image?.src;
  // Vérifier si c'est une catégorie via l'URL
  const isCategory =
    item.reactUrl?.includes("/categorie-produit/") ||
    item.url?.includes("/categorie-produit/");

  if (!hasChildren) {
    return (
      <MenuLink
        item={item}
        className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors rounded-md"
        onClick={onClose}
      >
        {capitalize(item.title)}
      </MenuLink>
    );
  }
  return (
    <div>
      {/* Bouton pour déplier les sous-catégories */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors rounded-md"
      >
        <div className="flex items-center gap-2">
          {hasImage && (
            <img
              src={item.image.src}
              alt={item.title}
              className="w-10 h-10 object-cover rounded-md border border-white/10 transition-colors flex-shrink-0"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
          <span>{item.title}</span>
        </div>
        <svg
          className={`w-3 h-3 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-2">
          {/* Lien "Voir tout" seulement si c'est une catégorie */}
          {isCategory && (
            <MenuLink
              item={item}
              className="block px-3 py-2 text-xs text-pink-300 hover:bg-white/5 hover:text-pink-400 transition-colors rounded-md font-medium"
              onClick={onClose}
            >
              ↗ Voir tout
            </MenuLink>
          )}

          {/* Liste des sous-catégories */}
          {item.children.map((child) => (
            <MenuLink
              key={child.id}
              item={child}
              className="block px-3 py-2 text-xs text-white/80 hover:bg-white/5 hover:text-pink-300 transition-colors rounded-md"
              onClick={onClose}
            >
              {capitalize(child.title)}
            </MenuLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
