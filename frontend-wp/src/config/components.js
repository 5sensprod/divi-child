// src/config/components.js - CORRECTION: Thème Havana au bon niveau
// Configuration centralisée complète pour tous les composants

export const HEADER_CONFIG = {
  // Configuration Navigation
  navigation: {
    showSearch: true,
    showCart: false,
    cartCount: 5,
    scrollThreshold: 100,

    soldes: {
      label: "SOLDES",
      url: "/bons-plans",
    },

    // Logos responsive
    logo: {
      desktop: { normal: 180, scrolled: 130 }, // au lieu de 220 / 140
      mobile: { normal: 150, scrolled: 100 },
      alt: "Logo Axe Musique",
    },

    // Navigation styles
    styles: {
      background: {
        normal: "bg-transparent",
        scrolled: "bg-gray-900/95 backdrop-blur-md shadow-lg",
      },
      padding: {
        normal: "py-4",
        scrolled: "py-2",
      },
      height: {
        normal: "min-h-[var(--nav-height)]",
        scrolled: "min-h-[var(--nav-height-scrolled)]",
      },
    },

    // Menu mobile
    mobileMenu: {
      background: "bg-gray-900",
      logoWidth: "120",
      maxHeight: "max-h-[calc(100vh-80px)]",
    },
  },

  // Configuration Hero Slider
  slider: {
    autoplayDelay: 8000,
    containerType: "divi",

    // Layout responsive - Simplifié avec une seule classe responsive
    layout: {
      padding: "pt-20 md:pt-20 lg:pt-40 xl:pt-40",
      grid: "grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8",
      minHeight:
        "min-h-[var(--hero-min-height)] md:min-h-[var(--hero-min-height-md)]",
      imageHeight: "h-full min-h-[300px] md:min-h-[320px]",
    },

    // Typography responsive
    typography: {
      title: {
        classes:
          "font-bold leading-tight mb-6 text-hero transition-all duration-500",
        responsive: "text-3xl md:text-4xl lg:text-5xl xl:text-6xl",
      },
      description: {
        classes: "text-gray-300 mb-8 text-hero-desc",
        responsive: "text-lg md:text-xl",
      },
    },

    // Animations
    animations: {
      slideTransition: "transition-opacity duration-700",
      buttonHover: "transition-all duration-300 hover:scale-105",
      dotTransition: "transition-all duration-300",
    },

    // Dots configuration
    dots: {
      size: "w-3.5 h-3.5",
      gap: "gap-3",
      container: "mx-auto inline-flex gap-3 self-center md:self-start",
      activeScale: "scale-125",
      inactiveScale: "scale-100",
      inactiveColor: "rgba(255, 255, 255, 0.3)",
    },

    // Button configuration
    button: {
      classes:
        "mx-auto md:mx-0 mb-8 px-8 py-4 text-base md:text-lg font-bold text-white uppercase rounded-full",
      animations:
        "transition-all duration-300 hover:scale-95 shadow-lg hover:shadow-xl",
      shadow: "none",
      text: "Boutique",
      href: "/#ProduitsVedettes",
    },

    slides: [
      {
        title: "SOLDES D'ÉTÉ 2026 — JUSQU'À -30%",
        description:
          "Profitez de nos soldes d'été sur une sélection d'instruments et d'accessoires. Guitares, claviers, effets et bien plus à prix réduits. Offre valable jusqu'au 28 juillet 2026, dans la limite des stocks disponibles.",
        image: "/assets/images/SoldeAxe_2026.png",
        theme: "soldes",
      },
      {
        title: "ACHETEZ, RÉPAREZ, RÉGLEZ VOTRE MATÉRIEL",
        description:
          "Vente d'instruments neufs et d'occasion, réparations expertes et réglages de précision. Notre atelier redonne vie à votre matériel avec le savoir-faire de vrais passionnés.",
        image: "/assets/images/bassiste_.png",
        theme: "neon",
      },
      {
        title: "DEPUIS 1998, VOTRE PARTENAIRE MUSICAL",
        description:
          "Bientôt 30 ans que nous servons les musiciens avec passion et expertise. Une équipe dévouée qui comprend vos besoins et vous accompagne dans tous vos projets musicaux.",
        image: "/assets/images/Hero_truck768-min.webp",
        theme: "sunset",
      },
      {
        title: "PARTOUT OÙ LA MUSIQUE VOUS MÈNE",
        description:
          "Conservatoire, scène prestigieuse ou studio d'enregistrement... Quel que soit votre univers musical, nous vous équipons pour donner le meilleur de vous-même.",
        image: "/assets/images/Hero_forest_-min.webp",
        theme: "oceanNight",
      },
      {
        title: "TOUS LES STYLES, TOUTES LES PASSIONS",
        description:
          "Du classique au beatbox, du rock au jazz manouche, de l'électro aux musiques du monde. Notre diversité d'instruments et d'accessoires épouse tous les genres musicaux.",
        image: "/assets/images/Hero_havana-min.webp",
        theme: "havana",
      },
    ],
  },

  // Configuration des thèmes - CORRECTION: tous au même niveau
  themes: {
    neon: {
      gradient: "var(--gradient-primary)",
      textGradient: "var(--gradient-primary)",
      color: "var(--primary)",
      dotColor: "var(--primary)",
      hoverGradient: "linear-gradient(90deg, var(--secondary), var(--primary))",

      // Variables pour le background SVG - EXACTEMENT comme le SVG original
      background: {
        "bg-0": "#0E0B1F",
        "bg-55": "#1A1050",
        "bg-100": "#2A1372",
        "pink-core": "#FF7BE5",
        "pink-outer": "#FF3FD1",
        "cyan-core": "#9BEAFF",
        "cyan-outer": "#31D1FF",
        violet: "#7D49FF",
      },
    },

    sunset: {
      gradient: "var(--gradient-warm)",
      textGradient: "var(--gradient-sunset)",
      color: "#ff6b35",
      dotColor: "#ff6b35",
      hoverGradient: "linear-gradient(90deg, #ffd23f, #ff6b35)",

      // Variables pour le background SVG - Sunset adapté du SVG
      background: {
        "bg-0": "#1a0b0b",
        "bg-55": "#4a1730",
        "bg-100": "#6f1d3a",
        "pink-core": "#ffb199",
        "pink-outer": "#ff6a3d",
        "cyan-core": "#ffe08a",
        "cyan-outer": "#ffb703",
        violet: "#ff4d6d",
      },
    },

    oceanNight: {
      gradient: "var(--gradient-ocean)",
      textGradient: "var(--gradient-ocean-night)",
      color: "#70B2E0",
      dotColor: "#70B2E0",
      hoverGradient: "linear-gradient(90deg, #4DD0E1, #70B2E0)",

      // Variables pour le background - Océan Nocturne (exactement comme notre CSS pur)
      background: {
        "bg-0": "#0A0E1A",
        "bg-55": "#132040",
        "bg-100": "#1E3A5F",
        "pink-core": "#4FC3F7", // Bleu clair spot gauche
        "pink-outer": "#29B6F6", // Bleu moyen spot gauche
        "cyan-core": "#81D4FA", // Bleu ciel spot droite
        "cyan-outer": "#4DD0E1", // Bleu turquoise spot droite
        violet: "#3F51B5", // Indigo spot bottom
      },
    },

    // CORRECTION: Thème Havana au même niveau que les autres
    havana: {
      gradient: "var(--gradient-havana)",
      textGradient: "var(--gradient-havana-night)",
      color: "#FF7F50",
      dotColor: "#FFD700",
      hoverGradient: "linear-gradient(90deg, #CD5C5C, #FF7F50)",

      background: {
        "bg-0": "#1A0F0F", // Brun très foncé
        "bg-55": "#2F1B14", // Brun chocolat
        "bg-100": "#3D2817", // Terre de Sienne
        "pink-core": "#FF7F50", // Coral (spot gauche)
        "pink-outer": "#FF6347", // Tomato (spot gauche)
        "cyan-core": "#FFD700", // Gold (spot droite)
        "cyan-outer": "#FFA500", // Orange (spot droite)
        violet: "#A0522D", // SaddleBrown (spot bottom)
      },
    },
    soldes: {
      gradient: "var(--gradient-soldes)",
      textGradient: "var(--gradient-soldes-night)",
      color: "#FF2D6F",
      dotColor: "#FFC300",
      hoverGradient: "linear-gradient(90deg, #FFC300, #FF2D6F)",

      background: {
        "bg-0": "#12060E", // Nuit chaude profonde
        "bg-55": "#3A1030", // Magenta sombre
        "bg-100": "#5A1A2E", // Bordeaux/coucher de soleil
        "pink-core": "#FF6FA5", // Rose vif (spot gauche)
        "pink-outer": "#FF2D6F", // Magenta (spot gauche)
        "cyan-core": "#FFD54A", // Or (spot droite)
        "cyan-outer": "#FF9E1B", // Orange (spot droite)
        violet: "#C2185B", // Framboise (spot bottom)
      },
    },
  },

  // Breakpoints responsive
  breakpoints: {
    mobile: "640px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1280px",
  },

  // Z-index système
  zIndex: {
    background: 0,
    content: 1,
    navigation: 1000,
    dropdown: 1030,
    overlay: 1020,
    mobileMenu: 1050,
  },

  // Fallbacks par défaut
  defaults: {
    siteTitle: "Axe Musique",
    siteDescription: "Votre magasin de musique en ligne",
  },
};

// Utilitaires helper
export const getResponsiveClasses = (config, key) => {
  return config[key] || "";
};

export const getThemeStyle = (theme, property) => {
  return (
    HEADER_CONFIG.themes[theme]?.[property] ||
    HEADER_CONFIG.themes.neon[property]
  );
};

// NOUVELLE FONCTION: Pour définir le thème actuel
export const setCurrentTheme = (themeName) => {
  const theme = HEADER_CONFIG.themes[themeName];
  if (!theme) {
    console.warn(`Thème "${themeName}" non trouvé`);
    return;
  }

  const root = document.documentElement;

  // Définir la variable CSS pour identification
  root.style.setProperty("--current-theme", themeName);

  // Mettre à jour le gradient actuel
  root.style.setProperty("--current-gradient", theme.gradient);

  // Appliquer les variables du background SVG
  applyBackgroundTheme(themeName);

  console.log(`Thème "${themeName}" appliqué`);
};

// AMÉLIORATION: getCurrentTheme() plus robuste
export const getCurrentTheme = () => {
  // Méthode 1: Variable CSS directe (recommandée)
  const currentTheme = getComputedStyle(document.documentElement)
    .getPropertyValue("--current-theme")
    .trim();

  if (currentTheme && HEADER_CONFIG.themes[currentTheme]) {
    return currentTheme;
  }

  // Méthode 2: Détecter via les classes du body
  const bodyClasses = document.body.classList;
  if (bodyClasses.contains("theme-oceanNight")) return "oceanNight";
  if (bodyClasses.contains("theme-havana")) return "havana";
  if (bodyClasses.contains("theme-sunset")) return "sunset";
  if (bodyClasses.contains("theme-neon")) return "neon";

  // Méthode 3: Détecter via l'URL ou un attribut data
  const themeFromData = document.documentElement.getAttribute("data-theme");
  if (themeFromData && HEADER_CONFIG.themes[themeFromData]) {
    return themeFromData;
  }

  // Fallback par défaut
  return "neon";
};
// Fonction helper pour appliquer les variables CSS du background SVG
export const applyBackgroundTheme = (themeName) => {
  const theme = HEADER_CONFIG.themes[themeName] || HEADER_CONFIG.themes.neon;
  const root = document.documentElement;

  // Appliquer toutes les variables CSS pour le SVG (noms exacts)
  Object.entries(theme.background).forEach(([key, value]) => {
    const cssVarName = `--axe-${key}`;
    root.style.setProperty(cssVarName, value);
  });
};

export const getLogoSizePx = ({
  isMobile = false,
  isScrolled = false,
  widthOverride,
} = {}) => {
  const { logo } = HEADER_CONFIG.navigation;

  // Si le composant reçoit un width explicite (nombre ou chaîne numérique), on le priorise
  const w = Number(widthOverride);
  if (Number.isFinite(w) && w > 0) return w;

  const sizes = isMobile ? logo.mobile : logo.desktop;
  const val = isScrolled ? sizes.scrolled : sizes.normal;
  return Number(val); // sécurité
};
