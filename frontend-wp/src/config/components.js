// src/config/components.js
// Configuration centralisée complète pour tous les composants

export const HEADER_CONFIG = {
  // Configuration Navigation
  navigation: {
    showSearch: false,
    showCart: false,
    cartCount: 5,
    scrollThreshold: 100,

    // Logos responsive
    logo: {
      desktop: {
        normal: "200",
        scrolled: "140",
      },
      mobile: {
        normal: "h-24", // 96px
        scrolled: "h-20", // 80px
      },
      path: "/assets/images/Logo_Axe_full.svg",
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
    autoplayDelay: 5000,
    containerType: "divi",

    // Layout responsive
    layout: {
      padding: {
        desktop: "pt-24 md:pt-10",
        mobile: "pt-20",
      },
      grid: "grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8",
      minHeight:
        "min-h-[var(--hero-min-height)] md:min-h-[var(--hero-min-height-md)]",
      imageHeight: "min-h-[300px] md:min-h-0",
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
        "transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl",
      shadow: "0 4px 15px rgba(0,0,0,0.3)",
      text: "Boutique",
      href: "/boutique",
    },

    slides: [
      {
        title: "ACHETEZ ET RÉPAREZ VOTRE MATOS MUSICAL",
        description:
          "Guitares, basses, claviers, sono et accessoires. Vendez votre matériel d'occasion, profitez de conseils d'experts et d'un atelier de réparation.",
        image:
          "/assets/images/ComfyUI_00291_-gigapixel-art-scale-4_00x-min_1.webp",
        theme: "neon",
      },
      {
        title: "BIENTÔT 30 ANS À VOTRE SERVICE",
        description:
          "Depuis 1995, notre équipe de passionnés vous accompagne dans vos projets musicaux. Trois décennies d'expertise, de confiance et d'innovation.",
        image: "/assets/images/foodtruck4-min_1.webp",
        theme: "sunset",
      },
    ],
  },

  // Configuration des thèmes
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

// Fonction helper pour get current theme
export const getCurrentTheme = () => {
  const gradient = getComputedStyle(document.documentElement).getPropertyValue(
    "--current-gradient"
  );
  return gradient.includes("var(--gradient-primary)") ? "neon" : "sunset";
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
