/** @type {import('tailwindcss').Config} */
export default {
  // 🎯 PURGE OPTIMISÉ - Scanne TOUT le contenu
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Ajoutez d'autres paths si vous avez des composants ailleurs
  ],

  // 🚀 MODE DE PURGE AGRESSIF
  safelist: [
    // Classes dynamiques que Tailwind ne peut pas détecter
    "bg-gray-900/95",
    "backdrop-blur-md",
    "text-pink-300",
    "hover:text-pink-300",
    "active:scale-95",
    "animate-fade-in",
    "animate-slide-down",
    // Ajoutez ici les classes générées dynamiquement
  ],

  theme: {
    extend: {
      // 🎨 OPTIMISATION DES ANIMATIONS - Gardez seulement celles utilisées
      animation: {
        "fade-in": "fadeIn 0.15s ease-out",
        "slide-down": "slideDown 0.15s ease-out",
        "mobile-menu": "mobileMenu 0.2s ease-out",
        // Supprimées : spin, pulse, bounce si non utilisées
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        mobileMenu: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },

      // 🎯 COULEURS OPTIMISÉES - Seulement celles utilisées
      colors: {
        // Ajoutez seulement vos couleurs custom si nécessaires
        "brand-pink": "#FF3FD1",
        "brand-cyan": "#31D1FF",
        "brand-violet": "#7D49FF",
      },

      // 📐 ESPACEMENTS OPTIMISÉS - Supprimez ce qui n'est pas utilisé
      spacing: {
        // Ajoutez seulement si vous avez des espacements custom
      },

      // 🔤 TYPOGRAPHIE - Gardez minimal
      fontFamily: {
        antic: ["AnticFont", "Impact", "Arial", "sans-serif"],
        bauhaus: ["Bauhaus", "Arial", "sans-serif"],
      },
    },
  },

  // 🚫 DÉSACTIVATION DES MODULES NON UTILISÉS
  corePlugins: {
    // Désactivez ce que vous n'utilisez pas
    // animation: false,  // Si pas d'animations
    // backdropBlur: false,  // Si pas de backdrop blur
    // backgroundAttachment: false,  // Si pas utilisé
    // backgroundClip: false,  // Si pas utilisé
    // backgroundImage: false,  // Si pas d'images de fond CSS
    // backgroundOrigin: false,  // Si pas utilisé
    // backgroundPosition: false,  // Si pas utilisé
    // backgroundRepeat: false,  // Si pas utilisé
    // backgroundSize: false,  // Si pas utilisé
    // blur: false,  // Si pas de blur
    // brightness: false,  // Si pas de filtres
    // contrast: false,  // Si pas de filtres
    // dropShadow: false,  // Si pas de drop-shadow
    // grayscale: false,  // Si pas de filtres
    // hueRotate: false,  // Si pas de filtres
    // invert: false,  // Si pas de filtres
    // saturate: false,  // Si pas de filtres
    // sepia: false,  // Si pas de filtres
    // backdropBrightness: false,  // Si pas de backdrop
    // backdropContrast: false,  // Si pas de backdrop
    // backdropGrayscale: false,  // Si pas de backdrop
    // backdropHueRotate: false,  // Si pas de backdrop
    // backdropInvert: false,  // Si pas de backdrop
    // backdropOpacity: false,  // Si pas de backdrop
    // backdropSaturate: false,  // Si pas de backdrop
    // backdropSepia: false,  // Si pas de backdrop
  },

  plugins: [],

  // 🚀 OPTIMISATIONS DE COMPILATION
  future: {
    hoverOnlyWhenSupported: true, // Hover seulement sur devices compatibles
    respectDefaultRingColorOpacity: true,
    disableColorOpacityUtilitiesByDefault: true,
    relativeContentPathsByDefault: true,
  },
};
