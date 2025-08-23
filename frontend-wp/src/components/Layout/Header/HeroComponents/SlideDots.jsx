// src/components/Layout/Header/HeroComponents/SlideDots.jsx
import { getThemeStyle } from "../../../../config/components";

const SlideDots = ({ slides, currentSlide, onSlideChange, config }) => (
  <div className={config.container}>
    {slides.map((slide, index) => {
      const isActive = index === currentSlide;

      return (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className={`${config.size} rounded-full cursor-pointer ${
            config.dotTransition
          } ${isActive ? config.activeScale : config.inactiveScale}`}
          style={{
            backgroundColor: isActive
              ? getThemeStyle(slide.theme, "dotColor")
              : config.inactiveColor,
          }}
          aria-label={`Slide ${index + 1}`}
        />
      );
    })}
  </div>
);
export default SlideDots;
