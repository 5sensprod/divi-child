import React from "react";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "../UI/LoadingSkeleton";

const ProductGrid = ({
  products = [],
  loading = false,
  className = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  if (loading) {
    return (
      <div className={`grid gap-5 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-14">
        <p className="text-gray-500 text-lg">Aucun produit disponible</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-5 ${className}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
