// src/components/Layout/Header/HeroComponents/HeroImage.jsx
const HeroImage = ({ slide, config }) => (
  <div className={`relative ${config.layout.imageHeight}`}>
    <img
      src={slide.image}
      alt={slide.title}
      className={`absolute inset-0 w-full h-full object-contain object-bottom ${config.animations.slideTransition}`}
      loading="lazy"
    />
  </div>
);

export default HeroImage;
