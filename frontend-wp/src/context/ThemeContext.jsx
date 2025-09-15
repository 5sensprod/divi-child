// src/context/ThemeContext.jsx - VERSION OPTIMISÉE CENTRALISÉE
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

// Configuration centralisée - Source de vérité unique
const THEME_CONFIG = {
  neon: {
    name: "neon",
    displayName: "Néon",
    colors: {
      primary: "#ff3fd1",
      secondary: "#31d1ff",
      accent: "#7d49ff",
    },
    background: {
      bg0: "#0e0b1f",
      bg55: "#1a1050",
      bg100: "#2a1372",
      spot1Core: "#ff7be5",
      spot1Outer: "#ff3fd1",
      spot2Core: "#9beaff",
      spot2Outer: "#31d1ff",
      spot3: "#7d49ff",
    },
  },

  sunset: {
    name: "sunset",
    displayName: "Coucher de soleil",
    colors: {
      primary: "#ff6b35",
      secondary: "#ffd23f",
      accent: "#ff4d6d",
    },
    background: {
      bg0: "#1a0b0b",
      bg55: "#4a1730",
      bg100: "#6f1d3a",
      spot1Core: "#ffb199",
      spot1Outer: "#ff6a3d",
      spot2Core: "#ffe08a",
      spot2Outer: "#ffb703",
      spot3: "#ff4d6d",
    },
  },

  oceanNight: {
    name: "oceanNight",
    displayName: "Océan nocturne",
    colors: {
      primary: "#70b2e0",
      secondary: "#4dd0e1",
      accent: "#3f51b5",
    },
    background: {
      bg0: "#0a0e1a",
      bg55: "#132040",
      bg100: "#1e3a5f",
      spot1Core: "#4fc3f7",
      spot1Outer: "#29b6f6",
      spot2Core: "#81d4fa",
      spot2Outer: "#4dd0e1",
      spot3: "#3f51b5",
    },
  },

  havana: {
    name: "havana",
    displayName: "Havana",
    colors: {
      primary: "#ff7f50",
      secondary: "#ffd700",
      accent: "#a0522d",
    },
    background: {
      bg0: "#1a0f0f",
      bg55: "#2f1b14",
      bg100: "#3d2817",
      spot1Core: "#ff7f50",
      spot1Outer: "#ff6347",
      spot2Core: "#ffd700",
      spot2Outer: "#ffa500",
      spot3: "#a0522d",
    },
  },

  boutique: {
    name: "boutique",
    displayName: "Boutique",
    colors: {
      primary: "#3b82f6",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
    },
    background: {
      bg0: "#f8fafc",
      bg55: "#f1f5f9",
      bg100: "#e2e8f0",
      spot1Core: "#ffffff",
      spot1Outer: "#f0f5ff",
      spot2Core: "#f8f9ff",
      spot2Outer: "#e6ecf5",
      spot3: "#f5f7fa",
    },
  },
};

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children, initialTheme = "neon" }) => {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousTheme, setPreviousTheme] = useState(initialTheme);

  // FONCTION CENTRALISÉE : Application complète du thème
  const applyTheme = useCallback((themeName, withTransition = true) => {
    const config = THEME_CONFIG[themeName];
    if (!config) {
      console.warn(`Thème "${themeName}" non trouvé`);
      return;
    }

    const root = document.documentElement;

    // 1. Gestion de la transition
    if (withTransition) {
      root.classList.add("theme-transitioning");
    }

    // 2. Application des couleurs principales via CSS @property
    root.style.setProperty("--theme-primary", config.colors.primary);
    root.style.setProperty("--theme-secondary", config.colors.secondary);
    root.style.setProperty("--theme-accent", config.colors.accent);

    // 3. Application des couleurs de background
    Object.entries(config.background).forEach(([key, value]) => {
      const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      if (key === "bg0") root.style.setProperty("--bg-color-0", value);
      else if (key === "bg55") root.style.setProperty("--bg-color-55", value);
      else if (key === "bg100") root.style.setProperty("--bg-color-100", value);
      else if (key === "spot1Core")
        root.style.setProperty("--spot1-core", value);
      else if (key === "spot1Outer")
        root.style.setProperty("--spot1-outer", value);
      else if (key === "spot2Core")
        root.style.setProperty("--spot2-core", value);
      else if (key === "spot2Outer")
        root.style.setProperty("--spot2-outer", value);
      else if (key === "spot3") root.style.setProperty("--spot3-color", value);
    });

    // 4. Gestion des classes CSS
    // Retirer l'ancien thème
    document.body.className = document.body.className.replace(/theme-\w+/g, "");
    // Ajouter le nouveau thème
    const themeClass = `theme-${themeName
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()}`;
    document.body.classList.add(themeClass);

    // 5. Attributs pour sélecteurs CSS
    root.setAttribute("data-theme", themeName);

    // 6. Fin de transition
    if (withTransition) {
      setTimeout(() => {
        root.classList.remove("theme-transitioning");
      }, 1200);
    }

    console.log(`🎨 Thème "${themeName}" appliqué de manière centralisée`);
  }, []);

  // FONCTION PUBLIQUE : Changement de thème avec transition
  const changeTheme = useCallback(
    (newTheme) => {
      if (newTheme === currentTheme || !THEME_CONFIG[newTheme]) return;

      setPreviousTheme(currentTheme);
      setIsTransitioning(true);

      // Application immédiate
      setCurrentTheme(newTheme);
      applyTheme(newTheme, true);

      // Fin de transition
      setTimeout(() => {
        setIsTransitioning(false);
      }, 1200);
    },
    [currentTheme, applyTheme]
  );

  // Initialisation au montage
  useEffect(() => {
    applyTheme(initialTheme, false);
    document.documentElement.classList.add("theme-system-enabled");

    return () => {
      document.documentElement.classList.remove("theme-system-enabled");
      document.documentElement.removeAttribute("data-theme");
    };
  }, [initialTheme, applyTheme]);

  // API publique du contexte
  const contextValue = useMemo(
    () => ({
      // État
      theme: currentTheme,
      previousTheme,
      isTransitioning,

      // Actions
      setTheme: changeTheme,
      changeTheme, // Alias

      // Utilitaires
      getThemeConfig: (themeName = currentTheme) => THEME_CONFIG[themeName],
      getThemeColors: (themeName = currentTheme) =>
        THEME_CONFIG[themeName]?.colors,
      getThemeBackground: (themeName = currentTheme) =>
        THEME_CONFIG[themeName]?.background,
      isValidTheme: (themeName) => !!THEME_CONFIG[themeName],
      availableThemes: Object.keys(THEME_CONFIG),

      // Classes CSS utilitaires
      transitionClass: isTransitioning ? "theme-transitioning" : "",
      themeClass: `theme-${currentTheme
        .replace(/([A-Z])/g, "-$1")
        .toLowerCase()}`,

      // Données des thèmes pour affichage
      themeList: Object.values(THEME_CONFIG).map((config) => ({
        name: config.name,
        displayName: config.displayName,
        colors: config.colors,
      })),
    }),
    [currentTheme, previousTheme, isTransitioning, changeTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook principal
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return context;
};

// Hook spécialisé pour les transitions
export const useThemeTransition = () => {
  const { theme, previousTheme, isTransitioning, transitionClass, themeClass } =
    useTheme();

  return {
    currentTheme: theme,
    previousTheme,
    isTransitioning,
    transitionClass,
    themeClass,
    // Classes CSS prêtes à l'emploi
    containerClasses: `${themeClass} ${transitionClass}`.trim(),
  };
};

// Hook pour obtenir les valeurs CSS d'un thème
export const useThemeValues = (themeName = null) => {
  const { theme, getThemeColors, getThemeBackground } = useTheme();
  const targetTheme = themeName || theme;

  return useMemo(() => {
    const colors = getThemeColors(targetTheme);
    const background = getThemeBackground(targetTheme);

    if (!colors || !background) return {};

    return {
      colors,
      background,
      // Valeurs extraites pour faciliter l'usage
      primary: colors.primary,
      secondary: colors.secondary,
      accent: colors.accent,
      gradient: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
      textGradient: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary}, ${colors.accent})`,
    };
  }, [targetTheme, getThemeColors, getThemeBackground]);
};

// Hook pour créer un sélecteur de thème
export const useThemeSelector = () => {
  const { theme, changeTheme, themeList, isTransitioning } = useTheme();

  return {
    currentTheme: theme,
    themes: themeList,
    selectTheme: changeTheme,
    isChanging: isTransitioning,
  };
};
