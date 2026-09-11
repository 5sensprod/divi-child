// frontend-wp/src/components/Product/AxePrice.jsx
// ═══════════════════════════════════════════════════════════════════════════
// LE PRIX D'UN PRODUIT DU CATALOGUE AXE — prix barré, promo et Stock B
// ═══════════════════════════════════════════════════════════════════════════
// Un seul composant pour les quatre écrans qui affichent un prix — fiche
// produit, carte de grille, résultat de recherche, aperçu de l'accueil — pour
// qu'aucun ne réinvente la règle.
//
// Depuis le 11 septembre 2026, `catalog.php` rend sur chaque produit :
//
//   price_ttc   le prix d'ORIGINE, toujours.
//   promo       null, ou { price_ttc, ends_on } — le prix réduit EN COURS.
//   stock_b     null, ou { quantity, price_ttc } — des unités Stock B, et leur
//               prix (null s'il n'est pas une baisse).
//
// ─── LE SITE NE DÉCIDE RIEN ───────────────────────────────────────────────
// La période de promo est jugée par le SERVEUR, au jour de Paris
// (`server/lib/promo.php` du dépôt PocketApp) : une promo finie arrive déjà à
// `null`. Aucune date n'est comparée ici, aucun prix n'est recalculé — le
// navigateur du visiteur n'a ni la bonne horloge ni la règle.
//
// Rendu :
//   • en promo          ~~prix d'origine~~  prix promo
//   • Stock B avec prix [Stock B]  ~~prix d'origine~~  prix B
//   • Stock B sans prix [Stock B]

import { formatPrice } from "../../utils/format";

const TAILLES = {
  sm: {
    prix: "text-base font-bold",
    barre: "text-xs",
    ligneB: "text-sm font-semibold",
    tag: "px-2 py-0.5 text-xs",
  },
  md: {
    prix: "text-xl font-bold",
    barre: "text-sm",
    ligneB: "text-base font-semibold",
    tag: "px-2 py-0.5 text-xs",
  },
  lg: {
    prix: "text-3xl font-bold",
    barre: "text-lg",
    ligneB: "text-xl font-semibold",
    tag: "px-3 py-1 text-sm",
  },
};

const AxePrice = ({
  product,
  size = "md",
  className = "",
  // La couleur du prix ORDINAIRE, que chaque écran avait déjà la sienne.
  priceClassName = "text-gray-900",
}) => {
  const t = TAILLES[size] || TAILLES.md;
  const promo = product.promo ?? null;
  const stockB = product.stock_b ?? null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {promo ? (
        <div className="flex flex-wrap items-baseline gap-2">
          <del className={`${t.barre} text-gray-400`}>
            {formatPrice(product.price_ttc)}
          </del>
          <span className={`${t.prix} text-red-600`}>
            {formatPrice(promo.price_ttc)}
          </span>
        </div>
      ) : (
        <span className={`${t.prix} ${priceClassName}`}>
          {formatPrice(product.price_ttc)}
        </span>
      )}

      {stockB && (
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full bg-violet-100 font-medium text-violet-800 ${t.tag}`}
          >
            Stock B
          </span>
          {stockB.price_ttc !== null && stockB.price_ttc !== undefined && (
            <>
              <del className={`${t.barre} text-gray-400`}>
                {formatPrice(product.price_ttc)}
              </del>
              <span className={`${t.ligneB} text-violet-700`}>
                {formatPrice(stockB.price_ttc)}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AxePrice;
