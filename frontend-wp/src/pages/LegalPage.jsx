// src/pages/LegalPage.jsx
import React, { useEffect } from "react";
import Background from "../components/UI/Background";
import Title from "../components/UI/Title";

const LegalPage = () => {
  // Scroll vers le haut au chargement de la page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div>
      {/* Hero Section - similaire à CategoryPage */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <Background variant="auto" opacity={0.95} animated={true} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center pt-8">
            <Title
              tag="h1"
              className="mb-4"
              animationType="equalizer"
              gradient="ocean"
              mode="neon"
            >
              Mentions Légales
            </Title>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Informations légales et juridiques
            </p>
          </div>
        </div>
      </section>

      {/* Contenu - similaire à CategoryPage */}
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Informations sur l'entreprise */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Informations sur l'entreprise
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong className="text-gray-900">Raison sociale :</strong> AXE
                MUSIQUE – SARL GALICHET
              </p>
              <p>
                <strong className="text-gray-900">Adresse :</strong>
                <br />
                4 RUE LOCHET
                <br />
                51000 CHÂLONS EN CHAMPAGNE
              </p>
              <p>
                <strong className="text-gray-900">Téléphone :</strong>{" "}
                <a
                  href="tel:0326657495"
                  className="text-pink-600 hover:text-pink-700"
                >
                  03 26 65 74 95
                </a>
              </p>
              <p>
                <strong className="text-gray-900">Email :</strong>{" "}
                <a
                  href="mailto:contact@axemusique.shop"
                  className="text-pink-600 hover:text-pink-700"
                >
                  contact@axemusique.shop
                </a>
              </p>
              <p>
                <strong className="text-gray-900">RCS :</strong> 418 647 574
                Châlons en Champagne
              </p>
              <p>
                <strong className="text-gray-900">
                  TVA Intracommunautaire :
                </strong>{" "}
                FR23 418647574
              </p>
            </div>
          </section>

          {/* Responsable de publication */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Responsable de publication
            </h2>
            <p className="text-gray-700">M. GALICHET</p>
          </section>

          {/* Hébergement */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Hébergement
            </h2>
            <div className="text-gray-700">
              <p className="font-semibold text-gray-900">OVH</p>
              <p>2 rue Kellermann</p>
              <p>59100 Roubaix</p>
            </div>
          </section>

          {/* Conception du site */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Conception et développement du site
            </h2>
            <div className="text-gray-700">
              <p className="font-semibold text-gray-900">5SENSPROD</p>
              <p>2 rue des Poissonniers</p>
              <p>51000 Châlons en Champagne</p>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Propriété intellectuelle
            </h2>
            <p className="text-gray-700 leading-relaxed">
              L'ensemble de ce site relève de la législation française et
              internationale sur le droit d'auteur et la propriété
              intellectuelle. Tous les droits de reproduction sont réservés, y
              compris pour les documents téléchargeables et les représentations
              iconographiques et photographiques.
            </p>
          </section>

          {/* Protection des données */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Protection des données personnelles
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Conformément à la loi « Informatique et Libertés » du 6 janvier
              1978 modifiée et au Règlement Général sur la Protection des
              Données (RGPD), vous disposez d'un droit d'accès, de
              rectification, de suppression et d'opposition aux données
              personnelles vous concernant.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour exercer ces droits, vous pouvez nous contacter à l'adresse
              suivante :{" "}
              <a
                href="mailto:contact@axemusique.shop"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                contact@axemusique.shop
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
