const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <p>
          © 2025{" "}
          <span style={{ fontFamily: "AnticFont, serif", fontSize: "1.5em" }}>
            AXE
          </span>{" "}
          <span style={{ fontFamily: "Bauhaus, sans-serif" }}>MUSIQUE</span>.
          Tous droits réservés.
        </p>
        <p className="text-gray-400 mt-2">By 5SENSPROD</p>
      </div>
    </footer>
  );
};

export default Footer;
