// src/components/Layout/HeroSection.jsx
import { Link } from "react-router-dom";
import HeroSlider from "../Hero/HeroSlider";

const HeroSection = ({
  title = "Bienvenue sur Axe Musique",
  subtitle = "Votre magasin de musique en ligne",
  showCTA = true,
  useSlider = true,
  className = "",
}) => {
  // Si on utilise le slider, on retourne le composant slider
  if (useSlider) {
    return <HeroSlider className={className} />;
  }

  // Sinon, on retourne le hero classique
  return (
    <section
      className={`relative min-h-[70vh] flex items-center justify-center ${className}`}
    >
      {/* Contenu avec z-index corrigé */}
      <div className="relative z-[1] w-full container-divi">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
              {title}
            </span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>

          {showCTA && <CTAButtons />}
        </div>

        {/* Indicateur de scroll */}
        <ScrollIndicator />
      </div>
    </section>
  );
};

// Composant pour les boutons CTA
const CTAButtons = () => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
    <Link
      to="/boutique"
      className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/25 z-[2]"
    >
      <span className="relative z-10">Découvrir nos instruments</span>
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>

    <Link
      to="/boutique"
      className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm z-[2]"
    >
      Explorer le catalogue
    </Link>
  </div>
);

// Composant pour l'indicateur de scroll
const ScrollIndicator = () => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-[2]">
    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
      <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
    </div>
  </div>
);

export default HeroSection;
