// src/components/UI/Modal.jsx
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "default", // "sm", "default", "lg", "xl", "full", "fullscreen"
  position = "top", // "center", "top"
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = "",
  backdropClassName = "",
  contentClassName = "",
}) => {
  const modalRef = useRef(null);

  // Gestion de l'échappement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Empêcher le scroll du body
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Fermeture sur clic backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Classes de taille
  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
    fullscreen: "w-full h-full", // Ajout spécifique pour fullscreen
  };

  // Classes de position
  const positionClasses = {
    center: "items-center justify-center min-h-screen",
    top: "items-start justify-center pt-4 sm:pt-16",
  };

  // Mode fullscreen spécial
  if (size === "fullscreen") {
    return (
      <div
        className={`fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm ${backdropClassName}`}
        onClick={handleBackdropClick}
      >
        <div
          ref={modalRef}
          className={`w-full h-full bg-white flex flex-col overflow-hidden ${className}`}
        >
          {/* Header avec titre et bouton fermer */}
          {(title || showCloseButton) && (
            <div
              className={`flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 ${contentClassName}`}
            >
              {title && (
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              )}
            </div>
          )}

          {/* Contenu - prend tout l'espace disponible */}
          <div className={`flex-1 overflow-auto ${contentClassName}`}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Mode modal standard
  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex ${positionClasses[position]} ${backdropClassName}`}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className={`
          relative bg-white shadow-2xl 
          ${sizeClasses[size]} 
          rounded-lg
          ${position === "top" ? "max-h-[90vh]" : "max-h-[95vh]"}
          w-full mx-4
          flex flex-col
          ${className}
        `}
      >
        {/* Header avec titre et bouton fermer */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0 ${contentClassName}`}
          >
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X size={20} className="text-gray-500" />
              </button>
            )}
          </div>
        )}

        {/* Contenu - avec scroll pour toutes les tailles */}
        <div
          className={`
            flex-1 overflow-auto
            ${title || showCloseButton ? "p-4" : "p-4"}
            ${contentClassName}
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
