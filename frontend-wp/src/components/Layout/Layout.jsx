import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const location = useLocation();

  // Afficher le hero seulement sur la page d'accueil
  const showHero = location.pathname === "/";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header showHero={showHero} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
