import React from "react";
import ProductCard from "./ProductCard";
import LoadingSkeleton from "../UI/LoadingSkeleton";

const ProductGrid = ({
  products = [],
  loading = false,
  className = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}) => {
  if (loading) {
    return (
      <div className={`grid gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucun produit disponible</p>
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
