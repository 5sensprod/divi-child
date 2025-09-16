// src/components/navigation/MobileMenu.jsx
import { useState } from "react";
import { X } from "lucide-react";
import { MobileMenuItem } from "./MenuItems";
import AxeLogo from "../logo/AxeLogo";
import { MenuSkeleton } from "../UI/LoadingSkeleton";

const MobileMenu = ({
  menuItems,
  loading,
  onClose,
  siteTitle,
  config,
  currentTheme,
}) => {
  const [openMobileMenus, setOpenMobileMenus] = useState(new Set());

  const toggleMobileSubmenu = (itemId) => {
    setOpenMobileMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <div className="fixed inset-0 z-mobile-menu animate-fade-in">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />

      {/* Menu Content */}
      <div
        className={`fixed top-0 left-0 right-0 ${config.background} animate-slide-down`}
      >
        {/* Header avec logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
          <AxeLogo
            width="120"
            theme={currentTheme}
            isScrolled={false}
            isMobile={true}
            alt={siteTitle}
          />
          <button
            onClick={onClose}
            className="p-2 text-white/90 hover:text-pink-300 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className={`px-4 py-4 ${config.maxHeight} overflow-y-auto`}>
          {loading ? (
            <MenuSkeleton />
          ) : (
            <div className="space-y-1">
              {menuItems.map((item) => (
                <MobileMenuItem
                  key={item.id}
                  item={item}
                  openMenus={openMobileMenus}
                  toggleSubmenu={toggleMobileSubmenu}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
