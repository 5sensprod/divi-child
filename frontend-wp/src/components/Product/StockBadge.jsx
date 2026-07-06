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
    // stock_quantity === 0 → en cours de réappro, sinon rupture franche
    const isReappro =
      stockStatus === "outofstock" &&
      stockQuantity !== null &&
      stockQuantity === 0;

    const standardBadges = {
      instock: {
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        dotColor: "bg-green-500",
        label: "En stock",
      },
      outofstock: isReappro
        ? {
            bgColor: "bg-orange-100",
            textColor: "text-orange-800",
            dotColor: "bg-orange-500",
            label: "En cours de réappro",
          }
        : {
            bgColor: "bg-red-100",
            textColor: "text-red-800",
            dotColor: "bg-red-500",
            label: "Rupture de stock",
          },
      onbackorder: {
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        dotColor: "bg-orange-500",
        label: "En cours de réappro",
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
