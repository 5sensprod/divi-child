// src/components/UI/AxeLogo.jsx
// Version avec même logique responsive que Navigation

import { useEffect } from "react";

const AxeLogo = ({
  width = "200",
  height = "auto",
  className = "",
  theme = "neon",
  onClick,
  alt = "Logo Axe Musique",
  isScrolled = false, // Nouveau prop pour défilement
  isMobile = false, // Nouveau prop pour mobile
}) => {
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "neon") {
      root.style.setProperty("--logo-primary", "#FF3FD1");
      root.style.setProperty("--logo-secondary", "#31D1FF");
      root.style.setProperty("--logo-accent", "#7D49FF");
    } else if (theme === "sunset") {
      root.style.setProperty("--logo-primary", "#ff6b35");
      root.style.setProperty("--logo-secondary", "#ffd23f");
      root.style.setProperty("--logo-accent", "#ff4d6d");
    }
  }, [theme]);

  // Système exact comme votre navigation
  const getLogoSize = () => {
    if (isMobile) {
      // Logique mobile comme dans votre config
      return isScrolled ? "100" : "180"; // h-20 = 80px, h-24 = 96px
    } else {
      // Logique desktop comme dans votre config
      return isScrolled ? "140" : width || "200";
    }
  };

  const logoSize = parseInt(getLogoSize());
  const scale = logoSize / 200; // Échelle basée sur 200px de référence

  // VOS proportions parfaites, mais adaptées à la taille calculée
  const axeFontSize = Math.round(logoSize * 0.285);
  const musiqueFontSize = Math.round(logoSize * 0.16);

  return (
    <div
      className={`logo-container ${className} relative inline-block`}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <svg
        width={logoSize}
        height={height}
        viewBox="0 0 423 281"
        className="logo-svg transition-all duration-500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: "var(--logo-primary)" }} />
            <stop
              offset="100%"
              style={{ stopColor: "var(--logo-secondary)" }}
            />
          </linearGradient>
        </defs>

        {/* Forme réelle du badge - EXACTEMENT comme avant */}
        <g transform="matrix(0.989355,0,0,1.04873,-39.0155,-125.719)">
          <g transform="matrix(1.78644,0,0,1.6853,-320.147,2.81323)">
            <g transform="matrix(0.906335,0,0,0.903945,184.699,-38.0939)">
              <path
                d="M160.439,138.936L161.448,137.124L163.501,133.438L255.115,124.455L244.648,149.836L255.169,208.156L273.813,202.388L263.227,224.809L266.126,263.994L277.33,287.442L253.944,282.005L189.421,276.747L177.576,294.681L166.166,276.597L20.774,283.393L34.657,265.201L42.278,221.953L37.271,204.557L56.055,209.234L73.399,149.226L64.439,124.551L157.613,133.443L160.439,138.936ZM160.158,155.993L152.475,141.059L76.361,133.795L81.861,148.942L61.63,218.938L48.873,215.761L50.529,221.514L42.241,268.542L37.676,274.524L170.466,268.318L177.73,279.832L185.335,268.318L255.186,274.01L262.838,275.789L258.212,266.108L255.043,223.282L258.716,215.504L248.866,218.551L236.307,148.942L242.554,133.795L168.475,141.059L160.158,155.993Z"
                fill="white"
                fillRule="evenodd"
                stroke="var(--logo-primary)"
                strokeWidth="2"
                className="transition-all duration-500"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* Texte avec VOS proportions parfaites mais système responsive */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute text-white transition-all duration-500 logo-text-axe"
          style={{
            fontSize: `${axeFontSize}px`,
            left: "51%",
            top: "32%",
            transform: "translate(-50%, -50%)",
            lineHeight: "1",
            letterSpacing: `${scale * 0.05}em`,
          }}
        >
          AXE
        </div>

        <div
          className="absolute text-white transition-all duration-500 logo-text-musique"
          style={{
            fontSize: `${musiqueFontSize}px`,
            left: "51%",
            top: "70%",
            transform: "translate(-50%, -50%)",
            lineHeight: "1",
            letterSpacing: `${scale * 0.1}em`,
          }}
        >
          MUSIQUE
        </div>
      </div>
    </div>
  );
};

export default AxeLogo;
