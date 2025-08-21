import React from "react";
import { useParams } from "react-router-dom";

const Product = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Produit #{id}</h1>
      <p>Page produit en cours de développement...</p>
    </div>
  );
};

export default Product;
