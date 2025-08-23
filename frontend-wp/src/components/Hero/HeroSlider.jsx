import { useState, useEffect } from "react";

const SLIDES = [
  {
    title: "ACHETEZ ET RÉPAREZ VOTRE MATOS MUSICAL",
    description:
      "Guitares, basses, claviers, sono et accessoires. Vendez votre matériel d'occasion, profitez de conseils d'experts et d'un atelier de réparation.",
    image: "/assets/images/ComfyUI_00291_-gigapixel-art-scale-4_00x-min_1.webp",
    colors: ["#ff3fd1", "#31d1ff"],
    textGradient: ["#ff3fd1", "#31d1ff"],
  },
  {
    title: "BIENTÔT 30 ANS D'EXPÉRIENCE À VOTRE SERVICE",
    description:
      "Depuis 1995, notre équipe de passionnés vous accompagne dans vos projets musicaux. Trois décennies d'expertise, de confiance et d'innovation.",
    image: "/assets/images/foodtruck4-min_1.webp",
    colors: ["#ff6b35", "#ffd23f"],
    textGradient: ["#ff4500", "#ff8c00", "#ffd700"],
  },
];

const HeroSlider = ({
  autoplayDelay = 5000,
  className = "",
  containerType = "divi", // "divi", "content", "narrow" - Retour au défaut large
}) => {
  const [current, setCurrent] = useState(0);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplayDelay]);

  // Apply theme colors
  useEffect(() => {
    const currentSlide = SLIDES[current];
    const { colors, textGradient } = currentSlide;
    const root = document.documentElement;

    // Couleurs pour les boutons et dots
    root.style.setProperty("--gradient-color-1", colors[0]);
    root.style.setProperty("--gradient-color-2", colors[1]);
    root.style.setProperty("--dot-active-color", colors[0]);

    // Dégradé spécifique pour le texte
    if (textGradient && textGradient.length === 2) {
      root.style.setProperty(
        "--text-gradient",
        `linear-gradient(90deg, ${textGradient[0]}, ${textGradient[1]})`
      );
    } else if (textGradient && textGradient.length === 3) {
      root.style.setProperty(
        "--text-gradient",
        `linear-gradient(90deg, ${textGradient[0]} 0%, ${textGradient[1]} 50%, ${textGradient[2]} 100%)`
      );
    }
  }, [current]);

  // Classe de container dynamique
  const getContainerClass = () => {
    switch (containerType) {
      case "content":
        return "container-content";
      case "narrow":
        return "container-narrow";
      default:
        return "container-divi";
    }
  };

  return (
    <section className={`w-full pt-24 md:pt-36 ${className}`}>
      <div className={getContainerClass()}>
        {/* Row avec 2 colonnes - 40% texte / 60% image */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-8 min-h-[500px] md:min-h-[600px]">
          {/* Colonne GAUCHE - Texte + Bouton + Dots */}
          <div className="flex flex-col justify-center text-center md:text-left">
            {/* Titre */}
            <h2
              className="font-bold leading-tight mb-6"
              style={{
                fontSize: "clamp(28px, 4vw, 48px)",
                background: "var(--text-gradient)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                transition: "background 0.5s ease",
              }}
            >
              {SLIDES[current].title}
            </h2>

            {/* Description */}
            <p
              className="text-gray-300 mb-8"
              style={{
                fontSize: "clamp(14px, 1.2vw, 18px)",
                lineHeight: 1.7,
              }}
            >
              {SLIDES[current].description}
            </p>

            {/* Bouton */}
            <button
              onClick={() => alert("Redirection vers boutique")}
              className="mx-auto md:mx-0 inline-block px-8 py-4 text-base md:text-lg font-bold text-white uppercase rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl mb-8"
              style={{
                background:
                  "linear-gradient(90deg, var(--gradient-color-1), var(--gradient-color-2))",
                boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background =
                  "linear-gradient(90deg, var(--gradient-color-2), var(--gradient-color-1))";
              }}
              onMouseLeave={(e) => {
                e.target.style.background =
                  "linear-gradient(90deg, var(--gradient-color-1), var(--gradient-color-2))";
              }}
            >
              Boutique
            </button>

            {/* Dots */}
            <div className="flex justify-center md:justify-start gap-3 m-auto">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`
                    w-3.5 h-3.5 rounded-full cursor-pointer transition-all duration-300
                    ${index === current ? "scale-125" : "scale-100"}
                  `}
                  style={{
                    backgroundColor:
                      index === current
                        ? "var(--dot-active-color)"
                        : "rgba(255, 255, 255, 0.3)",
                  }}
                  aria-label={`Slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Colonne DROITE - Image en contain, positionnée en bas */}
          <div className="relative min-h-[300px] md:min-h-0">
            <img
              src={SLIDES[current].image}
              alt={SLIDES[current].title}
              className="absolute inset-0 w-full h-full object-contain object-bottom transition-opacity duration-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
