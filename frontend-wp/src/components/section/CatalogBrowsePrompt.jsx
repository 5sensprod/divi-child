import React from "react";
import { Link } from "react-router-dom";

import Title from "../UI/Title";

const CatalogBrowsePrompt = ({ className = "" }) => (
  <div className={`text-center ${className}`}>
    <Title
      tag="p"
      animationType="none"
      showAnimation={false}
      solidColor="#4b5563"
      bold={false}
    >
      Cherchez un produit ci-dessus, ou{" "}
      <Link
        to="/shop"
        className="font-semibold text-pink-600 underline decoration-pink-300 underline-offset-4 transition-colors hover:text-blue-600"
      >
        parcourez les rayons
      </Link>
      .
    </Title>
  </div>
);

export default CatalogBrowsePrompt;
