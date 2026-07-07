import React from "react";
import { Link } from "react-router-dom";

const FacebookIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22 12.06C22 6.48 17.52 2 11.94 2S2 6.48 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
  </svg>
);

const CardIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 10h18" />
    <path d="M7 15h4" />
  </svg>
);

const TicketIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7Z" />
    <path d="M9 8h6" />
    <path d="M9 12h6" />
    <path d="M9 16h4" />
  </svg>
);

const InstallmentsIcon = ({ className = "" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
    <path d="M7 5v14" />
    <path d="M17 5v14" />
  </svg>
);

const FooterColumn = ({ title, children, className = "" }) => (
  <div
    className={`border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:border-white/10 lg:pl-8 lg:pt-0 ${className}`}
  >
    <h3 className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
      {title}
    </h3>
    {children}
  </div>
);

const Footer = () => {
  const year = new Date().getFullYear();

  const services = [
    "Essais en magasin",
    "Conseils par des musiciens",
    "Réglage & reprise atelier",
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.1),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_32%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative container mx-auto px-4 py-10 lg:py-12">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1.15fr_1fr_1fr] lg:gap-0">
          <div className="pb-1">
            <p className="text-sm leading-7 text-slate-300">
              © {year}{" "}
              <span
                className="text-3xl leading-none tracking-wider text-white"
                style={{ fontFamily: "AnticFont, serif" }}
              >
                AXE
              </span>{" "}
              <span
                className="text-lg tracking-wide text-white"
                style={{ fontFamily: "Bauhaus, sans-serif" }}
              >
                MUSIQUE
              </span>
              . Tous droits réservés.
            </p>

            <p className="mt-3 text-sm text-slate-500">By 5SENSPROD</p>

            <Link
              to="/mentions-legales"
              className="mt-6 inline-block text-sm text-slate-400 transition hover:text-white"
            >
              Mentions légales
            </Link>
          </div>

          <FooterColumn title="Contact">
            <div className="space-y-3 text-sm leading-6 text-slate-300">
              <a
                href="tel:+33326657495"
                className="block transition hover:text-white"
              >
                03 26 65 74 95
              </a>

              <a
                href="mailto:contact@axemusique.shop"
                className="block transition hover:text-white"
              >
                contact@axemusique.shop
              </a>

              <p>
                4 rue Lochet
                <br />
                51000 Châlons-en-Champagne
              </p>
            </div>
          </FooterColumn>

          <FooterColumn title="Horaires">
            <div className="space-y-3 text-sm leading-6 text-slate-300">
              <p>Lundi : 15h30 – 19h</p>
              <p>Mardi – samedi : 10h – 12h / 14h – 19h</p>
            </div>
          </FooterColumn>

          <FooterColumn title="Services">
            <ul className="space-y-3 text-sm leading-6 text-slate-300">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>

            <a
              href="https://www.facebook.com/AxeMusique51"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Axe Musique"
              className="mt-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <FacebookIcon className="h-5 w-5" />
              Facebook
            </a>
          </FooterColumn>

          <FooterColumn title="Paiement">
            <ul className="space-y-4 text-sm leading-6 text-slate-300">
              <li className="flex items-center gap-3">
                <CardIcon className="h-5 w-5 shrink-0 text-orange-300" />
                <span>Carte bancaire</span>
              </li>

              <li className="flex items-center gap-3">
                <TicketIcon className="h-5 w-5 shrink-0 text-orange-300" />
                <span>Pass Culture</span>
              </li>

              <li className="flex items-center gap-3">
                <InstallmentsIcon className="h-5 w-5 shrink-0 text-orange-300" />
                <span>Paiement en 3 ou 4 fois</span>
              </li>
            </ul>
          </FooterColumn>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
