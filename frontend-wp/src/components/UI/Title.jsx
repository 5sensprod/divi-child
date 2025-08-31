import React from "react";
import "./Title.css";

const Title = ({
  children,
  tag = "h2",
  className = "",
  showAnimation = true,
  animationType = "equalizer", // Par défaut equalizer pour tous
  gradient = "default",
}) => {
  // Définir les différents gradients disponibles
  const gradients = {
    default: "from-pink-600 via-purple-600 to-cyan-600",
    pink: "from-pink-500 to-pink-700",
    purple: "from-purple-500 to-purple-700",
    cyan: "from-cyan-500 to-cyan-700",
    sunset: "from-orange-500 via-pink-500 to-purple-600",
    ocean: "from-blue-500 via-cyan-500 to-teal-600",
  };

  // Créer le composant avec la balise dynamique
  const TagName = tag;

  // Classes CSS de base pour le titre (sans les styles de gradient qui sont dans le CSS)
  const titleClasses = `
    title-gradient-text font-bold
    ${tag === "h1" ? "text-5xl md:text-6xl" : ""}
    ${tag === "h2" ? "text-4xl md:text-5xl" : ""}
    ${tag === "h3" ? "text-3xl md:text-4xl" : ""}
    ${tag === "h4" ? "text-2xl md:text-3xl" : ""}
    ${tag === "h5" ? "text-xl md:text-2xl" : ""}
    ${tag === "h6" ? "text-lg md:text-xl" : ""}
  `.trim();

  return (
    <div className={`title-container ${className}`}>
      {showAnimation && (
        <div className={`title-animation ${animationType}`}>
          {animationType === "equalizer" && (
            <div className="soundbar">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
          )}
          {animationType === "pulse" && (
            <div className="pulse-animation">
              <div className="pulse-circle"></div>
            </div>
          )}
          {animationType === "wave" && (
            <div className="wave-animation">
              <div className="wave"></div>
              <div className="wave"></div>
              <div className="wave"></div>
            </div>
          )}
        </div>
      )}

      <TagName className={titleClasses}>{children}</TagName>
    </div>
  );
};

export default Title;
