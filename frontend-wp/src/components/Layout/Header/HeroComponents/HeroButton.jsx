// src/components/Layout/Header/HeroComponents/HeroButton.jsx
import { getCurrentTheme, getThemeStyle } from "../../../../config/components";

const HeroButton = ({ config }) => (
  <button
    onClick={() => (window.location.href = config.href)}
    className={`${config.classes} ${config.animations}`}
    style={{
      background: "var(--current-gradient)",
      boxShadow: config.shadow,
    }}
    onMouseEnter={(e) => {
      const currentTheme = getCurrentTheme();
      e.target.style.background = getThemeStyle(currentTheme, "hoverGradient");
    }}
    onMouseLeave={(e) => {
      e.target.style.background = "var(--current-gradient)";
    }}
  >
    {config.text}
  </button>
);
export default HeroButton;
