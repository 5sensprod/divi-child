// frontend-wp/src/components/Product/AxeSaleBadge.jsx
// ═══════════════════════════════════════════════════════════════════════════
// LA PASTILLE D'ÉTAT COMMERCIAL D'UN PRODUIT DU CATALOGUE AXE
// ═══════════════════════════════════════════════════════════════════════════
// `catalog.php` rend `product.sale_state` sur les QUATRE actions qui portent
// des produits — `category`, `product`, `search`, `latest`. Contrairement à
// `gallery`, il n'est pas réservé à la fiche : une grille l'a toujours.
//
// Trois valeurs, TOUJOURS une chaîne, jamais `null`, jamais absente :
//
//   ""       → plein tarif. C'est l'ÉTAT ORDINAIRE de la quasi-totalité du
//              catalogue, pas une donnée manquante. On ne rend rien.
//   "sale"   → soldé.
//   "promo"  → en promotion.
//
// ─── ELLE NE PORTE AUCUN PRIX ─────────────────────────────────────────────
// `sale_state` ne transporte ni pourcentage, ni prix d'avant, ni montant de
// remise, et rien ailleurs dans la réponse ne les porte non plus. `price_ttc`
// est le prix de vente, tel quel, soldé ou non — il ne se recalcule pas.
// Donc : PAS de prix barré, PAS de « -20 % », PAS de « au lieu de ». Les
// fabriquer reviendrait à inventer un tarif affiché en vitrine.
//
// Elle ne dit rien non plus de la publication : `catalog.php` ne sert que les
// produits `published`. Les deux notions ne se croisent pas.
//
// La forme est celle de `StockBadge` (`components/Product/StockBadge.jsx`) —
// pastille arrondie, fond clair, texte foncé, point de couleur — pour qu'une
// carte qui porte les deux ne présente pas deux vocabulaires visuels.

const ETATS = {
  sale: {
    label: "Soldes",
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    dotColor: "bg-red-500",
  },
  promo: {
    label: "Promo",
    bgColor: "bg-amber-100",
    textColor: "text-amber-800",
    dotColor: "bg-amber-500",
  },
};

const TAILLES = {
  sm: { badge: "px-2 py-0.5 text-xs", dot: "w-1.5 h-1.5 mr-1" },
  md: { badge: "px-3 py-1 text-sm", dot: "w-2 h-2 mr-2" },
};

const AxeSaleBadge = ({ state, size = "sm", className = "" }) => {
  // `""` passe ici, et c'est le chemin le plus fréquent : pas de pastille,
  // pas de cadre vide, pas d'espace réservé.
  const etat = ETATS[state];
  if (!etat) return null;

  const taille = TAILLES[size] || TAILLES.sm;

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${etat.bgColor} ${etat.textColor} ${taille.badge} ${className}`}
    >
      <span
        className={`rounded-full ${etat.dotColor} ${taille.dot}`}
        aria-hidden="true"
      />
      {etat.label}
    </span>
  );
};

export default AxeSaleBadge;
