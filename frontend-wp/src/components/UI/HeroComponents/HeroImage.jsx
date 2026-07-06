// src/components/Layout/Header/HeroComponents/HeroImage.jsx
import SplitFlapBoard from "../../UI/SplitFlapBoard";

const HeroImage = ({ slide, config }) => (
  <div className={`relative ${config.layout.imageHeight}`}>
    <img
      src={slide.image}
      alt={slide.title}
      className={`absolute inset-0 w-full h-full object-contain object-bottom ${config.animations.slideTransition}`}
      loading="lazy"
    />

    {/* Panneau split-flap superposé en haut à droite (slide soldes uniquement) */}
    {slide.theme === "soldes" && (
      <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <SplitFlapBoard />
      </div>
    )}
  </div>
);

export default HeroImage;
