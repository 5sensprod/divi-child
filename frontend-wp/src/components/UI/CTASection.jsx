// src/components/UI/CTASection.jsx
import React from "react";
import { Phone, Mail, MapPin, Clock, Check } from "lucide-react";
import LeafletMap from "./LeafletMap";

const CTASection = ({
  phone = "0326657495",
  email = "contact@axemusique.shop",
  showMap = true,
  mapTheme = "light", // "light" | "dark" | "grayscale"
  storeInfo = {
    name: "Axe Musique",
    address: "4 rue Lochet, 51000 Châlons En Champagne",
    coordinates: [48.955809129233145, 4.360563031008535],
  },
  hours = {
    monday: "15h – 19h",
    tuesdayToSaturday: "10h – 12h, 14h – 19h",
  },
  highlights = [
    "Essais en magasin",
    "Conseils par des musiciens",
    "Réglage & reprise atelier",
  ],
}) => {
  // Choix tuile Leaflet (couleurs de carte)
  const tileSets = {
    light: {
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    dark: {
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    grayscale: {
      url: "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    },
  };

  const { url: tileUrl, attribution } = tileSets[mapTheme] || tileSets.light;

  // Fonction pour rendre le nom avec les polices personnalisées
  const renderStoreName = (name) => {
    const parts = name.split(" ");
    if (
      parts.length === 2 &&
      parts[0].toLowerCase() === "axe" &&
      parts[1].toLowerCase() === "musique"
    ) {
      return (
        <>
          <span style={{ fontFamily: "AnticFont, serif", fontSize: "1.5em" }}>
            AXE
          </span>{" "}
          <span style={{ fontFamily: "Bauhaus, sans-serif" }}>MUSIQUE</span>
        </>
      );
    }
    return name;
  };

  return (
    <>
      <div className="container-divi">
        {/* Carte unifiée : infos + map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne infos */}
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 md:p-8">
            {/* Logo + nom */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src="/assets/images/Logo_Axe_neon_crop-min.webp"
                alt="Axe Musique"
                className="w-20 h-20 object-contain md:w-24 md:h-24 lg:w-28 lg:h-28"
              />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  {renderStoreName(storeInfo.name)}
                </h3>
                <p className="text-base md:text-lg text-white/70 flex items-center gap-1.5">
                  <MapPin className="w-5 h-5" />
                  {storeInfo.address}
                </p>
              </div>
            </div>

            {/* Accroches courtes */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2 text-base md:text-lg text-white/85"
                >
                  <Check className="w-5 h-5 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Horaires */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-base md:text-lg font-medium text-white/90 bg-white/10 border border-white/10 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span>Lundi&nbsp;: {hours.monday}</span>
              </div>
              <div className="mt-3 text-base md:text-lg text-white/80">
                Mardi – Samedi&nbsp;: {hours.tuesdayToSaturday}
              </div>
            </div>

            {/* Boutons contact */}
            <div className="flex flex-col gap-3">
              {/* Tél */}
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="w-full inline-flex items-center justify-start gap-3 px-4 py-4 
                           rounded-xl bg-white text-gray-900 text-lg md:text-xl font-semibold 
                           hover:opacity-90 transition shadow"
              >
                <Phone className="w-6 h-6 shrink-0" />
                <span>{phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${email}`}
                className="w-full inline-flex items-center justify-start gap-3 px-4 py-4 
                           rounded-xl border border-white/20 text-lg md:text-xl text-white 
                           hover:border-white/40 transition shadow"
              >
                <Mail className="w-6 h-6 shrink-0" />
                <span className="break-all">{email}</span>
              </a>
            </div>

            <p className="mt-4 text-sm md:text-base text-white/70">
              Une question ? Réponse rapide par téléphone ou email.
            </p>
          </div>

          {/* Colonne carte */}
          {showMap && (
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-3 md:p-4">
              <div className="relative h-[300px] md:h-[360px] rounded-xl overflow-hidden">
                <LeafletMap
                  center={storeInfo.coordinates}
                  zoom={15}
                  className="w-full h-full"
                  tileUrl={tileUrl}
                  attribution={attribution}
                  markers={[
                    { position: storeInfo.coordinates, popup: storeInfo.name },
                  ]}
                />
              </div>
              <div className="mt-3 text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${storeInfo.coordinates[0]},${storeInfo.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/80 hover:text-white underline-offset-4 hover:underline"
                >
                  Ouvrir dans Google Maps →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CTASection;
