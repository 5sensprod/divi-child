import { useState, useEffect } from "react";

const SLIDES = [
  {
    title: "ACHETEZ ET RÉPAREZ VOTRE MATOS MUSICAL",
    description:
      "Guitares, basses, claviers, sono et accessoires. Vendez votre matériel d'occasion, profitez de conseils d'experts et d'un atelier de réparation.",
    image: "/assets/images/ComfyUI_00291_-gigapixel-art-scale-4_00x-min.png",
    colors: ["#ff3fd1", "#31d1ff"],
  },
  {
    title: "BIENTÔT 30 ANS D'EXPÉRIENCE À VOTRE SERVICE",
    description:
      "Depuis 1995, notre équipe de passionnés vous accompagne dans vos projets musicaux. Trois décennies d'expertise, de confiance et d'innovation.",
    image: "/assets/images/foodtruck4-min.png",
    colors: ["#ff6b35", "#ffd23f"],
  },
];
const HeroSlider = ({ autoplayDelay = 5000, className = "" }) => {
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
    const { color1, color2 } = SLIDES[current].colors;
    const root = document.documentElement;
    root.style.setProperty("--gradient-color-1", color1);
    root.style.setProperty("--gradient-color-2", color2);
    root.style.setProperty("--dot-active-color", color1);
  }, [current]);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: "650px",
        backgroundImage:
          "url('/assets/images/axe-musique-neon-bg-v2-variables.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        "--axe-bg-0": "#0E0B1F",
        "--axe-bg-55": "#1A1050",
        "--axe-bg-100": "#2A1372",
        "--axe-pink-core": "#FF7BE5",
        "--axe-pink-outer": "#FF3FD1",
        "--axe-cyan-core": "#9BEAFF",
        "--axe-cyan-outer": "#31D1FF",
        "--axe-violet": "#7D49FF",
        "--gradient-color-1": "#ff3fd1",
        "--gradient-color-2": "#31d1ff",
        "--dot-active-color": "#ff3fd1",
      }}
    >
      {/* Slides */}
      {SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`
            absolute top-0 left-0 w-full h-full grid transition-all duration-700 ease-in-out
            md:grid-cols-[1fr_1.5fr] grid-rows-[auto_1fr] md:grid-rows-1
            ${
              index === current
                ? "opacity-100 translate-x-0 pointer-events-auto"
                : "opacity-0 translate-x-12 pointer-events-none"
            }
          `}
        >
          {/* Content */}
          <div className="flex flex-col justify-center p-4 md:p-8">
            <h2
              className="font-bold leading-tight mb-6"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                background:
                  "linear-gradient(90deg, var(--gradient-color-1), var(--gradient-color-2))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                transition: "background 0.5s ease",
              }}
            >
              {slide.title}
            </h2>

            <p
              className="text-gray-300 mb-6"
              style={{
                fontSize: "clamp(16px, 1.5vw, 20px)",
                lineHeight: 1.6,
              }}
            >
              {slide.description}
            </p>

            <button
              onClick={() => alert("Redirection vers boutique")}
              className="self-start inline-block mt-6 px-8 py-4 text-lg font-bold text-white uppercase rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
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
          </div>

          {/* Image */}
          <div className="relative overflow-hidden min-h-64 md:min-h-0">
            <div
              className={`
                absolute inset-0 bg-contain bg-center bg-bottom bg-no-repeat transition-transform duration-300
                ${index === current ? "scale-105" : "scale-100"}
              `}
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div
        className="absolute bottom-8 flex gap-3 z-10"
        style={{
          left: "25%",
          transform: "translateX(-50%)",
        }}
      >
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

      {/* Mobile: Center dots */}
      <style jsx>{`
        @media (max-width: 768px) {
          .absolute.bottom-8 {
            left: 50% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroSlider;
