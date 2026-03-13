import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <p>
            © {new Date().getFullYear()}{" "}
            <span style={{ fontFamily: "AnticFont, serif", fontSize: "1.5em" }}>
              AXE
            </span>{" "}
            <span style={{ fontFamily: "Bauhaus, sans-serif" }}>MUSIQUE</span>.
            Tous droits réservés.
          </p>
          <p className="text-gray-400 mt-2">By 5SENSPROD</p>
        </div>

        {/* Liens footer */}
        <div className="text-center mt-4">
          <Link
            to="/mentions-legales"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
