// src/components/Layout/Header/HeroComponents/HeroContent.jsx
import HeroButton from "./HeroButton";
import SlideDots from "./SlideDots";
import SoldesCarousel from "../../Product/SoldesCarousel";

const HeroContent = ({
  slide,
  slides,
  currentSlide,
  onSlideChange,
  config,
}) => {
  // Slide soldes : carrousel de produits soldés + bouton "Voir les soldes"
  if (slide.theme === "soldes") {
    return (
      <div className="flex flex-col justify-center w-full">
        <SoldesCarousel
          perPage={8}
          autoplayDelay={4000}
          ctaText="Voir les soldes"
          ctaHref="#ProduitsPromo"
        />
      </div>
    );
  }

  // Slides normales : titre + description + bouton
  return (
    <div className="flex flex-col justify-center">
      <div className="max-w-prose mx-auto md:mx-0 w-full text-center md:text-left">
        <h1
          className={`${config.typography.title.classes} ${config.typography.title.responsive}`}
          style={{
            background: "var(--current-text-gradient)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {slide.title}
        </h1>

        <p
          className={`${config.typography.description.classes} ${config.typography.description.responsive}`}
        >
          {slide.description}
        </p>

        <div className="flex flex-col gap-6 self-center md:self-start">
          <HeroButton config={config.button} />
          {/* <SlideDots
            slides={slides}
            currentSlide={currentSlide}
            onSlideChange={onSlideChange}
            config={config.dots}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default HeroContent;
