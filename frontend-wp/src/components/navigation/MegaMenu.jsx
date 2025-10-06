// src/components/navigation/MegaMenu.jsx
import { useState, useRef, useEffect } from "react";
import { MenuLink } from "./MenuItems";

const MegaMenu = ({ item, isOpen, onToggle, onClose }) => {
  const menuRef = useRef(null);
  const [columns, setColumns] = useState([]);

  // Organiser les enfants en colonnes (max 4 colonnes)
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

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        onMouseEnter={onToggle}
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

  if (!hasChildren) {
    return (
      <MenuLink
        item={item}
        className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors rounded-md"
        onClick={onClose}
      >
        {item.title}
      </MenuLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors rounded-md"
      >
        <span>{item.title}</span>
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
          {item.children.map((child) => (
            <MenuLink
              key={child.id}
              item={child}
              className="block px-3 py-2 text-xs text-white/80 hover:bg-white/5 hover:text-pink-300 transition-colors rounded-md"
              onClick={onClose}
            >
              {child.title}
            </MenuLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
