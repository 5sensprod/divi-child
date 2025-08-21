import { useWordPress } from "../../context/WordPressContext";
import Navigation from "./Navigation";
import HeroSection from "./HeroSection";

const Header = ({ showHero = false }) => {
  const { siteData, menus, loading } = useWordPress();

  return (
    <header className="relative">
      {/* Background SVG pour tout le header */}
      {showHero && (
        <div
          className="absolute inset-0 z-0"
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
      )}

      {/* Navigation avec background conditionnel */}
      <div
        className={`relative z-10 ${
          showHero
            ? "" // Transparent sur Hero
            : "bg-gray-900 shadow-lg" // Background normal sur autres pages
        } sticky top-0`}
      >
        <Navigation
          menuItems={menus?.items || []}
          siteTitle={siteData?.site_title || "Axe Musique"}
          loading={loading.menus}
          showSearch={false}
          showCart={false}
          cartCount={5}
        />
      </div>

      {/* Section Hero */}
      {showHero && (
        <div className="relative z-10">
          <HeroSection
            title={`Bienvenue sur ${siteData?.site_title || "Axe Musique"}`}
            subtitle={
              siteData?.site_description || "Votre magasin de musique en ligne"
            }
          />
        </div>
      )}
    </header>
  );
};

export default Header;
