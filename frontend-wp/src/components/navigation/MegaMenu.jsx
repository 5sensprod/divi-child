// src/components/navigation/MegaMenu.jsx
import { useState, useRef } from "react";
import { MenuLink } from "./MenuItems";
import { capitalize } from "../../utils/format";

const MegaMenu = ({ item, isOpen, onToggle, onClose }) => {
  const menuRef = useRef(null);
  const [activeChild, setActiveChild] = useState(null);

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

  const handleMenuMouseLeave = () => {
    setActiveChild(null);
    onClose();
  };

  const childrenWithKids = item.children.filter((c) => c.children?.length > 0);
  const childrenWithoutKids = item.children.filter((c) => !c.children?.length);
  const displayedChild = activeChild ?? childrenWithKids[0] ?? null;

  const isCategory = (i) =>
    i.reactUrl?.includes("/categorie-produit/") ||
    i.url?.includes("/categorie-produit/");

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
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl z-dropdown animate-slide-down flex overflow-hidden"
          onMouseLeave={handleMenuMouseLeave}
          style={{ minWidth: "600px", maxWidth: "900px" }}
        >
          {/* COLONNE GAUCHE */}
          <div className="w-56 flex-shrink-0 border-r border-white/10 py-3">
            {isCategory(item) && (
              <div className="px-3 pb-2 mb-2 border-b border-white/10">
                <MenuLink
                  item={item}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-pink-300 hover:bg-white/10 hover:text-pink-400 transition-colors rounded-md font-medium"
                  onClick={onClose}
                >
                  ↗ Voir tout {item.title}
                </MenuLink>
              </div>
            )}

            {childrenWithKids.map((child) => (
              <button
                key={child.id}
                onMouseEnter={() => setActiveChild(child)}
                onClick={() => setActiveChild(child)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors rounded-md mx-1 ${
                  displayedChild?.id === child.id
                    ? "bg-white/15 text-pink-300"
                    : "text-white/90 hover:bg-white/10 hover:text-pink-300"
                }`}
                style={{ width: "calc(100% - 8px)" }}
              >
                <div className="flex items-center gap-2">
                  {child.image?.src && (
                    <img
                      src={child.image.src}
                      alt={child.title}
                      className="w-6 h-6 object-cover rounded flex-shrink-0"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                  <span>{capitalize(child.title)}</span>
                </div>
                <svg
                  className="w-3 h-3 text-white/40 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ))}

            {childrenWithoutKids.length > 0 && (
              <>
                {childrenWithKids.length > 0 && (
                  <div className="mx-3 my-2 border-t border-white/10" />
                )}
                {childrenWithoutKids.map((child) => (
                  <MenuLink
                    key={child.id}
                    item={child}
                    className="block px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors rounded-md mx-1"
                    onClick={onClose}
                  >
                    {capitalize(child.title)}
                  </MenuLink>
                ))}
              </>
            )}
          </div>

          {/* PANNEAU DROIT */}
          {displayedChild && displayedChild.children?.length > 0 && (
            <div className="flex-1 py-3 px-4 min-w-0">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                <h3 className="text-sm font-semibold text-pink-300">
                  {capitalize(displayedChild.title)}
                </h3>
                {isCategory(displayedChild) && (
                  <MenuLink
                    item={displayedChild}
                    className="text-xs text-pink-300/70 hover:text-pink-300 transition-colors"
                    onClick={onClose}
                  >
                    Voir tout →
                  </MenuLink>
                )}
              </div>

              {(() => {
                const count = displayedChild.children.length;
                const cols = count <= 6 ? 2 : count <= 15 ? 3 : 4;
                return (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${cols}, 1fr)`,
                      gridAutoFlow: "column",
                      gridTemplateRows: `repeat(${Math.ceil(count / cols)}, auto)`,
                      gap: "1px",
                    }}
                  >
                    {displayedChild.children.map((sub) => (
                      <MenuLink
                        key={sub.id}
                        item={sub}
                        className="block px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-pink-300 transition-colors rounded-md"
                        onClick={onClose}
                      >
                        {capitalize(sub.title)}
                      </MenuLink>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MegaMenu;
