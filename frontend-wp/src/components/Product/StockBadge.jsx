import { StockBadgeSkeleton } from "../UI/LoadingSkeleton";

const StockBadge = ({
  stockStatus,
  manageStock = false,
  stockQuantity = null,
  size = "md",
  showQuantity = true,
  loading = false,
}) => {
  if (loading) return <StockBadgeSkeleton size={size} />;

  let badge;

  if (manageStock) {
    // ─── PAS DE « RUPTURE » SUR CETTE VITRINE ──────────────────────────────
    // Le site ne vend pas : un stock à zéro n'y ferme aucune commande, il dit
    // seulement que l'article n'est pas en rayon à l'instant. « Rupture de
    // stock » décourage une visite au magasin que « Réappro » invite. Le
    // libellé est aussi celui des cartes de grille (`AxeProductCard`), pour
    // qu'une même fiche ne change pas de mot selon l'écran d'où on la regarde.
    //
    // ⚠️ La condition portait `stockQuantity === 0`, et un stock NÉGATIF —
    // ordinaire en caisse — retombait donc sur « Rupture de stock ».
    const standardBadges = {
      instock: {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        dotColor: "bg-green-500",
        label: "En stock",
      },
      outofstock: {
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        dotColor: "bg-orange-500",
        label: "Réappro",
      },
      onbackorder: {
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        dotColor: "bg-orange-500",
        label: "Réappro",
      },
    };
    badge = standardBadges[stockStatus] || standardBadges.outofstock;
  } else {
    // Gestion manuelle : 3 statuts distincts
    const manualBadges = {
      instock: {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        dotColor: "bg-green-500",
        label: "En stock",
      },
      outofstock: {
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        dotColor: "bg-yellow-500",
        label: "Sur commande",
      },
      onbackorder: {
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        dotColor: "bg-orange-500",
        label: "En réappro",
      },
    };
    badge = manualBadges[stockStatus] || manualBadges.instock;
  }

  const sizes = {
    sm: {
      badge: "px-2 py-0.5 text-xs",
      dot: "w-1.5 h-1.5 mr-1",
      text: "text-xs",
    },
    md: { badge: "px-3 py-1 text-sm", dot: "w-2 h-2 mr-2", text: "text-sm" },
    lg: {
      badge: "px-4 py-2 text-base",
      dot: "w-2.5 h-2.5 mr-2",
      text: "text-base",
    },
  };

  const sizeClasses = sizes[size] || sizes.md;
  const hasQuantity = manageStock && stockQuantity !== null && showQuantity;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center rounded-full font-medium ${badge.bgColor} ${badge.textColor} ${sizeClasses.badge}`}
      >
        <span
          className={`rounded-full ${badge.dotColor} ${sizeClasses.dot}`}
        ></span>
        {badge.label}
      </span>
      {/* {hasQuantity && (
        <span className={`text-gray-600 ${sizeClasses.text}`}>
          ({stockQuantity} disponible{stockQuantity > 1 ? "s" : ""})
        </span>
      )} */}
    </div>
  );
};

export default StockBadge;
