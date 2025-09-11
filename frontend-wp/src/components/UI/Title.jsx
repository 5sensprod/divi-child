import React, { useEffect, useMemo, useState } from "react";
import "./Title.css";

const PALETTES = {
  neon: ["#ff3fd1", "#31d1ff", "#7d49ff"],
  sunset: ["#ff6b35", "#ffd23f", "#ff4d6d"],
};

const Title = ({
  children,
  tag = "h2",
  className = "",
  showAnimation = true,
  animationType = "equalizer",
  mode = "auto", // "neon" | "sunset" | "auto"
  intervalMs = 5000, // switch toutes les 5s
  useCssOnly = false, // true => utilise l'animation CSS .theme-auto (pas de JS)
  solidColor = null, // nouvelle prop : couleur unie (ex: "#ffffff" ou "red")
}) => {
  const TagName = tag;

  // gestion JS (désactivée si useCssOnly=true ou mode !== "auto")
  const [isNeon, setIsNeon] = useState(true);
  useEffect(() => {
    if (useCssOnly || mode !== "auto") return;
    const t = setInterval(
      () => setIsNeon((v) => !v),
      Math.max(500, intervalMs)
    );
    return () => clearInterval(t);
  }, [mode, intervalMs, useCssOnly]);

  const activePalette = useMemo(() => {
    if (mode === "neon") return PALETTES.neon;
    if (mode === "sunset") return PALETTES.sunset;
    return isNeon ? PALETTES.neon : PALETTES.sunset;
  }, [mode, isNeon]);

  const titleClasses = `
    ${solidColor ? "text-solid" : "title-gradient-text"} font-bold
    ${tag === "h1" ? "text-5xl md:text-6xl" : ""}
    ${tag === "h2" ? "text-4xl md:text-5xl" : ""}
    ${tag === "h3" ? "text-3xl md:text-4xl" : ""}
    ${tag === "h4" ? "text-2xl md:text-3xl" : ""}
    ${tag === "h5" ? "text-xl md:text-2xl" : ""}
    ${tag === "h6" ? "text-lg md:text-xl" : ""}
  `.trim();

  const [c1, c2, c3] = activePalette;

  // Style dynamique pour le titre
  const titleStyle = solidColor ? { color: solidColor } : undefined;

  // Style pour le conteneur
  const containerStyle =
    useCssOnly && mode === "auto"
      ? undefined
      : { ["--c1"]: c1, ["--c2"]: c2, ["--c3"]: c3 };

  return (
    <div
      className={`title-root ${
        useCssOnly && mode === "auto" ? "theme-auto" : ""
      } ${className}`}
      style={containerStyle}
    >
      {showAnimation && (
        <div className={`title-animation ${animationType}`} aria-hidden="true">
          {animationType === "equalizer" && (
            <div className="soundbar">
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </div>
          )}
        </div>
      )}
      <TagName className={titleClasses} style={titleStyle}>
        {children}
      </TagName>
    </div>
  );
};

export default Title;
