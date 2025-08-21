import React from "react";
import { useParams } from "react-router-dom";

const Category = () => {
  const { slug } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Catégorie: {slug}</h1>
      <p>Page catégorie en cours de développement...</p>
    </div>
  );
};

export default Category;
