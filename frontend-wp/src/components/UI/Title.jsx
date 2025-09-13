// Title.jsx - Avec palette Havana
import React, { useEffect, useMemo, useState } from "react";
import "./Title.css";

const PALETTES = {
  neon: ["#ff3fd1", "#31d1ff", "#7d49ff"],
  sunset: ["#ff6b35", "#ffd23f", "#ff4d6d"],
  oceanNight: ["#70B2E0", "#4DD0E1", "#3F51B5"],
  havana: ["#FF7F50", "#FFD700", "#A0522D"], // NOUVEAU - Palette Havana
};

const Title = ({
  children,
  tag = "h2",
  className = "",
  showAnimation = true,
  animationType = "equalizer",
  mode = "auto", // "neon" | "sunset" | "oceanNight" | "havana" | "auto"
  intervalMs = 5000, // switch toutes les 5s
  useCssOnly = false, // true => utilise l'animation CSS .theme-auto (pas de JS)
  solidColor = null, // couleur unie (ex: "#ffffff" ou "red")
  cycleThemes = ["neon", "sunset", "oceanNight", "havana"], // MODIFIÉ - 4 thèmes par défaut
}) => {
  const TagName = tag;

  // gestion JS avec cycle de 4 thèmes
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

  useEffect(() => {
    if (useCssOnly || mode !== "auto") return;

    const t = setInterval(() => {
      setCurrentThemeIndex((prevIndex) => (prevIndex + 1) % cycleThemes.length);
    }, Math.max(500, intervalMs));

    return () => clearInterval(t);
  }, [mode, intervalMs, useCssOnly, cycleThemes.length]);

  const activePalette = useMemo(() => {
    if (mode === "neon") return PALETTES.neon;
    if (mode === "sunset") return PALETTES.sunset;
    if (mode === "oceanNight") return PALETTES.oceanNight;
    if (mode === "havana") return PALETTES.havana; // NOUVEAU

    // Mode auto - cycle entre les thèmes spécifiés
    const currentTheme = cycleThemes[currentThemeIndex];
    return PALETTES[currentTheme] || PALETTES.neon;
  }, [mode, currentThemeIndex, cycleThemes]);

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
