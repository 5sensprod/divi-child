/**
 * AXE SVG Background Generator - Version optimisée
 * Génère dynamiquement des SVG avec les couleurs des variables CSS
 */

(function () {
  "use strict";

  function generateAxeSVG() {
    // Récupérer les valeurs des variables CSS
    const computedStyle = getComputedStyle(document.documentElement);

    const bg0 =
      computedStyle.getPropertyValue("--axe-bg-0").trim() || "#0E0B1F";
    const bg55 =
      computedStyle.getPropertyValue("--axe-bg-55").trim() || "#1A1050";
    const bg100 =
      computedStyle.getPropertyValue("--axe-bg-100").trim() || "#2A1372";
    const pinkCore =
      computedStyle.getPropertyValue("--axe-pink-core").trim() || "#FF7BE5";
    const pinkOuter =
      computedStyle.getPropertyValue("--axe-pink-outer").trim() || "#FF3FD1";
    const cyanCore =
      computedStyle.getPropertyValue("--axe-cyan-core").trim() || "#9BEAFF";
    const cyanOuter =
      computedStyle.getPropertyValue("--axe-cyan-outer").trim() || "#31D1FF";
    const violet =
      computedStyle.getPropertyValue("--axe-violet").trim() || "#7D49FF";

    // Générer le SVG avec les couleurs actuelles
    const svgContent = `
      <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 2880 1440' preserveAspectRatio='xMidYMid slice'>
        <defs>
          <linearGradient id='bg' x1='0' y1='1' x2='1' y2='0'>
            <stop offset='0%' style='stop-color: ${bg0}'/>
            <stop offset='55%' style='stop-color: ${bg55}'/>
            <stop offset='100%' style='stop-color: ${bg100}'/>
          </linearGradient>
          <radialGradient id='diffusePink' cx='18%' cy='14%' r='55%'>
            <stop offset='0%' stop-color='#FFFFFF' stop-opacity='0.95'/>
            <stop offset='8%' style='stop-color: ${pinkCore}' stop-opacity='0.85'/>
            <stop offset='25%' style='stop-color: ${pinkOuter}' stop-opacity='0.55'/>
            <stop offset='60%' style='stop-color: ${pinkOuter}' stop-opacity='0.18'/>
            <stop offset='100%' style='stop-color: ${pinkOuter}' stop-opacity='0'/>
          </radialGradient>
          <radialGradient id='diffuseCyan' cx='82%' cy='12%' r='58%'>
            <stop offset='0%' stop-color='#FFFFFF' stop-opacity='0.95'/>
            <stop offset='8%' style='stop-color: ${cyanCore}' stop-opacity='0.85'/>
            <stop offset='26%' style='stop-color: ${cyanOuter}' stop-opacity='0.55'/>
            <stop offset='62%' style='stop-color: ${cyanOuter}' stop-opacity='0.18'/>
            <stop offset='100%' style='stop-color: ${cyanOuter}' stop-opacity='0'/>
          </radialGradient>
          <radialGradient id='bottomViolet' cx='70%' cy='90%' r='60%'>
            <stop offset='0%' style='stop-color: ${violet}' stop-opacity='0.70'/>
            <stop offset='55%' style='stop-color: ${violet}' stop-opacity='0.22'/>
            <stop offset='100%' style='stop-color: ${violet}' stop-opacity='0'/>
          </radialGradient>
          <radialGradient id='vignette' cx='50%' cy='50%' r='70%'>
            <stop offset='60%' stop-color='#000' stop-opacity='0'/>
            <stop offset='100%' stop-color='#000' stop-opacity='.30'/>
          </radialGradient>
          <filter id='smoke' x='-20%' y='-20%' width='140%' height='140%' color-interpolation-filters='sRGB'>
            <feTurbulence type='fractalNoise' baseFrequency='0.008 0.013' numOctaves='3' seed='17' result='noise' id='turb'/>
            <animate xlink:href='#turb' attributeName='baseFrequency' values='0.008 0.013; 0.006 0.010; 0.008 0.013' dur='22s' repeatCount='indefinite'/>
            <feGaussianBlur in='noise' stdDeviation='18' result='blur'/>
            <feColorMatrix in='blur' type='matrix' values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.28 0' result='smokeField'/>
          </filter>
          <style>.screen { mix-blend-mode: screen; } .softLight { mix-blend-mode: soft-light; }</style>
        </defs>
        <rect width='100%' height='100%' fill='url(#bg)'/>
        <g class='screen'>
          <rect width='50%' height='100%' fill='url(#diffusePink)'/>
          <rect width='100%' height='100%' fill='url(#diffuseCyan)'/>
          <ellipse cx='2050' cy='1100' rx='1100' ry='720' fill='url(#bottomViolet)'/>
        </g>
        <rect width='100%' height='100%' filter='url(#smoke)' class='softLight' opacity='.9'/>
        <rect width='100%' height='100%' fill='url(#vignette)' opacity='.6'/>
      </svg>
    `;

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
  }

  // Fonction pour mettre à jour le background
  function updateAxeBackground() {
    const sections = document.querySelectorAll(".axe-background-section");
    const newSvgUrl = generateAxeSVG();

    sections.forEach((section) => {
      // Méthode via CSS custom property + style dynamique
      const style =
        document.querySelector("#axe-dynamic-style") ||
        document.createElement("style");
      style.textContent = `
        .axe-background-section::before {
          background-image: url("${newSvgUrl}") !important;
        }
      `;

      if (!style.id) {
        style.id = "axe-dynamic-style";
        document.head.appendChild(style);
      }
    });

    console.log("🎨 Background SVG mis à jour");
  }

  // Thèmes prédéfinis avec mapping pour le slider
  const axeThemes = {
    original: {
      "bg-0": "#0E0B1F",
      "bg-55": "#1A1050",
      "bg-100": "#2A1372",
      "pink-core": "#FF7BE5",
      "pink-outer": "#FF3FD1",
      "cyan-core": "#9BEAFF",
      "cyan-outer": "#31D1FF",
      violet: "#7D49FF",
    },

    sunset: {
      "bg-0": "#1a0b0b",
      "bg-55": "#4a1730",
      "bg-100": "#6f1d3a",
      "pink-core": "#ffb199",
      "pink-outer": "#ff6a3d",
      "cyan-core": "#ffe08a",
      "cyan-outer": "#ffb703",
      violet: "#ff4d6d",
    },
  };

  // Fonction publique pour changer les couleurs
  window.setAxeColors = function (colors) {
    Object.keys(colors).forEach((key) => {
      document.documentElement.style.setProperty(`--axe-${key}`, colors[key]);
    });

    // Mettre à jour le background après un petit délai
    setTimeout(updateAxeBackground, 50);
  };

  // Fonction publique pour appliquer un thème
  window.setAxeTheme = function (themeName) {
    if (axeThemes[themeName]) {
      setAxeColors(axeThemes[themeName]);
      console.log(`🎨 Thème "${themeName}" appliqué !`);
    } else {
      console.error(
        `Thème "${themeName}" non trouvé. Thèmes disponibles: ${Object.keys(
          axeThemes
        ).join(", ")}`
      );
    }
  };

  // Intégration avec le slider existant
  function integratWithSlider() {
    const slider = document.querySelector(".axe-slider");
    if (!slider) return;

    console.log("🔗 Intégration avec le slider AXE");

    // Mapping des slides vers les thèmes
    const slideToTheme = {
      0: "original", // Slide 1 = original/neon
      1: "sunset", // Slide 2 = sunset
    };

    // Observer les changements de slides
    const slides = slider.querySelectorAll(".slide");
    const dots = slider.querySelectorAll(".dot");

    // Fonction appelée quand une slide change
    function onSlideChange() {
      const activeSlide = Array.from(slides).findIndex((slide) =>
        slide.classList.contains("is-active")
      );

      const themeName = slideToTheme[activeSlide] || "original";
      console.log(`🎭 Slide ${activeSlide} -> Thème ${themeName}`);

      setAxeTheme(themeName);
    }

    // Écouter les clics sur les dots
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        setTimeout(onSlideChange, 100); // Petit délai pour que la slide soit active
      });
    });

    // Observer les changements de classe sur les slides (pour l'autoplay)
    const observer = new MutationObserver(onSlideChange);
    slides.forEach((slide) => {
      observer.observe(slide, {
        attributes: true,
        attributeFilter: ["class"],
      });
    });

    // Initialiser avec la slide active
    onSlideChange();
  }

  // Initialisation
  document.addEventListener("DOMContentLoaded", function () {
    updateAxeBackground();
    integratWithSlider();

    console.log("🎨 AXE SVG Background chargé !");
    console.log(
      'Commandes disponibles: setAxeTheme("sunset"), setAxeTheme("original")'
    );
  });

  // Aussi initialiser si Divi charge du contenu dynamiquement
  window.addEventListener("load", function () {
    setTimeout(() => {
      updateAxeBackground();
      integratWithSlider();
    }, 200);
  });
})();
