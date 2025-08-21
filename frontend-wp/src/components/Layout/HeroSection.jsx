// src/components/Layout/HeroSection.jsx

import { Link } from "react-router-dom";

const HeroSection = ({
  title = "Bienvenue sur Axe Musique",
  subtitle = "Votre magasin de musique en ligne",
  showCTA = true,
}) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background SVG avec variables CSS */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage:
            "url('/assets/images/axe-musique-neon-bg-v2-variables.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          // Variables CSS pour personnaliser les couleurs
          "--axe-bg-0": "#0E0B1F",
          "--axe-bg-55": "#1A1050",
          "--axe-bg-100": "#2A1372",
          "--axe-pink-core": "#FF7BE5",
          "--axe-pink-outer": "#FF3FD1",
          "--axe-cyan-core": "#9BEAFF",
          "--axe-cyan-outer": "#31D1FF",
          "--axe-violet": "#7D49FF",
        }}
      />

      {/* Fallback gradient si SVG ne charge pas */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        style={{
          backgroundImage:
            "url('/assets/images/axe-musique-neon-bg-v2-variables.svg') !== 'none' ? 'none' : 'linear-gradient(135deg, #2A1372, #1A1050, #0E0B1F)'",
        }}
      />

      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Contenu */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>

        {showCTA && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/boutique"
              className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25"
            >
              <span className="relative z-10">Découvrir nos instruments</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <Link
              to="/boutique"
              className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm"
            >
              Explorer le catalogue
            </Link>
          </div>
        )}

        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
