import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getThemeStyle, applyBackgroundTheme } from "../config/components";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ initial = "neon", children }) => {
  const [theme, setTheme] = useState(initial);
  const [previousTheme, setPreviousTheme] = useState(initial);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fonction pour changer le thème avec transition
  const changeTheme = useCallback(
    (newTheme) => {
      if (newTheme === theme) return;

      setPreviousTheme(theme);
      setIsTransitioning(true);

      // Petit délai pour permettre aux composants de se préparer
      requestAnimationFrame(() => {
        setTheme(newTheme);

        // Fin de la transition après un délai
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1200);
      });
    },
    [theme]
  );

  // Synchronisation des CSS vars avec debounce pour les performances
  useEffect(() => {
    const updateCSSVars = () => {
      const root = document.documentElement;
      if (isTransitioning) {
        setTimeout(() => {
          root.style.setProperty(
            "--current-gradient",
            getThemeStyle(theme, "gradient")
          );
          root.style.setProperty(
            "--current-text-gradient",
            getThemeStyle(theme, "textGradient")
          );
          root.style.setProperty(
            "--current-color",
            getThemeStyle(theme, "color")
          );
        }, 1000); // Délai de 1s sur les 2s de transition
      } else {
        // Application immédiate si pas de transition
        root.style.setProperty(
          "--current-gradient",
          getThemeStyle(theme, "gradient")
        );
        root.style.setProperty(
          "--current-text-gradient",
          getThemeStyle(theme, "textGradient")
        );
        root.style.setProperty(
          "--current-color",
          getThemeStyle(theme, "color")
        );
      }

      // Variables de thème principales
      root.style.setProperty(
        "--current-gradient",
        getThemeStyle(theme, "gradient")
      );
      root.style.setProperty(
        "--current-text-gradient",
        getThemeStyle(theme, "textGradient")
      );
      root.style.setProperty("--current-color", getThemeStyle(theme, "color"));

      // Variables pour les transitions
      root.style.setProperty(
        "--theme-transition-duration",
        isTransitioning ? "1.2s" : "0.3s"
      );

      // Application du thème de background si la fonction existe
      applyBackgroundTheme?.(theme);

      // Attribute data pour les sélecteurs CSS
      root.setAttribute("data-theme", theme);
      if (isTransitioning) {
        root.setAttribute("data-transitioning", "true");
      } else {
        root.removeAttribute("data-transitioning");
      }
    };

    // Debounce pour éviter trop d'appels
    const timeoutId = setTimeout(updateCSSVars, 16); // ~60fps
    return () => clearTimeout(timeoutId);
  }, [theme, isTransitioning]);

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      document.documentElement.removeAttribute("data-theme");
      document.documentElement.removeAttribute("data-transitioning");
    };
  }, []);

  const value = useMemo(
    () => ({
      theme,
      previousTheme,
      isTransitioning,
      setTheme: changeTheme,
      // Alias pour compatibilité
      changeTheme,
    }),
    [theme, previousTheme, isTransitioning, changeTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

// Hook personnalisé pour les transitions de thème
export const useThemeTransition = () => {
  const { theme, previousTheme, isTransitioning } = useTheme();

  return {
    currentTheme: theme,
    previousTheme,
    isTransitioning,
    // Classes CSS utilitaires
    transitionClass: isTransitioning ? "theme-transitioning" : "",
    themeClass: `theme-${theme}`,
  };
};
