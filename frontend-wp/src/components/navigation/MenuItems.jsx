// src/components/navigation/MenuItems.jsx
import { Link } from "react-router-dom";
import { ChevronDown, Search, ShoppingCart, X, Menu } from "lucide-react";

// Composant de lien unifié (gère React Router et liens externes)
export const MenuLink = ({ item, className, onClick, children }) => {
  if (item.isReactRoute) {
    return (
      <Link to={item.reactUrl} className={className} onClick={onClick}>
        {children || item.title}
      </Link>
    );
  }

  return (
    <a
      href={item.url}
      className={className}
      target={item.target || "_self"}
      onClick={onClick}
    >
      {children || item.title}
    </a>
  );
};

// Item de menu desktop
export const DesktopMenuItem = ({ item, openDropdowns, toggleDropdown }) => {
  const hasChildren = item.children?.length > 0;
  const isDropdownOpen = openDropdowns.has(item.id);

  if (!hasChildren) {
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
    <div className="relative">
      <button
        onClick={() => toggleDropdown(item.id)}
        className={`nav-link nav-link-inactive flex items-center space-x-1 ${
          isDropdownOpen ? "text-pink-300" : ""
        }`}
      >
        <span>{item.title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isDropdownOpen && (
        <DropdownMenu
          items={item.children}
          openDropdowns={openDropdowns}
          toggleDropdown={toggleDropdown}
          onClose={() => toggleDropdown(item.id)}
        />
      )}
    </div>
  );
};

// Menu dropdown
export const DropdownMenu = ({
  items,
  openDropdowns,
  toggleDropdown,
  onClose,
}) => (
  <div className="absolute top-full left-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-lg shadow-xl overflow-hidden z-dropdown animate-slide-down w-64">
    {items.map((item) => (
      <DropdownItem
        key={item.id}
        item={item}
        openDropdowns={openDropdowns}
        toggleDropdown={toggleDropdown}
        onClose={onClose}
      />
    ))}
  </div>
);

// Item de dropdown
export const DropdownItem = ({
  item,
  openDropdowns,
  toggleDropdown,
  onClose,
  level = 2,
}) => {
  const hasChildren = item.children?.length > 0;
  const isSubmenuOpen = openDropdowns.has(item.id);
  const commonClasses =
    "block px-4 py-3 text-sm text-white/90 hover:bg-white/10 hover:text-pink-300 transition-colors border-b border-white/5 last:border-b-0";

  if (!hasChildren) {
    return (
      <MenuLink item={item} className={commonClasses} onClick={onClose}>
        <span className={level > 2 ? "ml-4" : ""}>{item.title}</span>
      </MenuLink>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(item.id)}
        className={`w-full text-left ${commonClasses} flex items-center justify-between ${
          isSubmenuOpen ? "text-pink-300 bg-white/5" : ""
        }`}
      >
        <span className={level > 2 ? "ml-4" : ""}>{item.title}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            isSubmenuOpen ? "rotate-180 text-pink-300" : ""
          }`}
        />
      </button>

      {isSubmenuOpen && (
        <div className="ml-4 border-l border-white/10">
          {item.children.map((child) => (
            <DropdownItem
              key={child.id}
              item={child}
              openDropdowns={openDropdowns}
              toggleDropdown={toggleDropdown}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Item de menu mobile
export const MobileMenuItem = ({
  item,
  openMenus,
  toggleSubmenu,
  onClose,
  level = 1,
}) => {
  const hasChildren = item.children?.length > 0;
  const isSubmenuOpen = openMenus.has(item.id);
  const indentClass = level > 1 ? `ml-${level * 2}` : "";

  if (!hasChildren) {
    return (
      <MenuLink
        item={item}
        className={`mobile-menu-item ${indentClass} ${
          item.isActive
            ? "mobile-menu-item-active"
            : "mobile-menu-item-inactive"
        }`}
        onClick={onClose}
      />
    );
  }

  return (
    <div className="mb-1">
      <button
        onClick={() => toggleSubmenu(item.id)}
        className={`mobile-menu-item mobile-menu-item-inactive w-full flex items-center justify-between ${indentClass} ${
          isSubmenuOpen ? "text-pink-300 bg-white/5" : ""
        }`}
      >
        <span>{item.title}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-150 ${
            isSubmenuOpen ? "rotate-180 text-pink-300" : ""
          }`}
        />
      </button>

      {isSubmenuOpen && (
        <div className="mt-1 space-y-1 animate-slide-down">
          {item.children.map((child) => (
            <MobileMenuItem
              key={child.id}
              item={child}
              openMenus={openMenus}
              toggleSubmenu={toggleSubmenu}
              onClose={onClose}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Boutons d'action
export const ActionButton = ({ icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-white/90 hover:text-pink-300 transition-colors"
    aria-label={label}
  >
    <Icon size={20} />
  </button>
);

export const CartButton = ({ count }) => (
  <button
    className="relative p-2 text-white/90 hover:text-pink-300 transition-colors"
    aria-label="Panier"
  >
    <ShoppingCart size={20} />
    {count > 0 && (
      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </button>
);

// Bouton menu mobile
export const MobileMenuButton = ({ isOpen, onClick, isScrolled }) => (
  <button
    onClick={onClick}
    className={`lg:hidden text-white/90 hover:text-pink-300 hover:bg-white/10 rounded-lg transition-all active:scale-95 ${
      isScrolled ? "p-2" : "p-3"
    } ${isOpen ? "text-pink-300" : ""}`}
    aria-label="Ouvrir le menu"
  >
    {isOpen ? (
      <X size={isScrolled ? 22 : 24} />
    ) : (
      <Menu size={isScrolled ? 26 : 28} />
    )}
  </button>
);
