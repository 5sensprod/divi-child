// frontend-wp/src/components/Product/SoldesCarousel.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { getProductsOnSale } from "../../services/woocommerce";
import ProductCard from "./ProductCard";

const SoldesCarousel = ({
  perPage = 8,
  autoplayDelay = 4000,
  ctaText = "Voir les soldes",
  ctaHref = "#ProduitsPromo",
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const { data } = await getProductsOnSale({
          per_page: perPage,
          page: 1,
        });

        if (isMounted) setProducts(data || []);
      } catch (e) {
        console.error("Erreur chargement carrousel soldes:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [perPage]);

  const next = useCallback(() => {
    setIndex((prevIndex) => (prevIndex + 1) % products.length);
  }, [products.length]);

  useEffect(() => {
    if (loading || products.length <= 1) return undefined;

    intervalRef.current = setInterval(next, autoplayDelay);

    return () => clearInterval(intervalRef.current);
  }, [loading, products.length, next, autoplayDelay]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-white/70 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="w-full">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="shrink-0 w-full px-2">
              <div className="max-w-sm mx-auto">
                <ProductCard product={product} saleLabel="Solde" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {products.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {products.map((product, i) => (
            <span
              key={product.id}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      <div className="max-w-[240px] sm:max-w-sm mx-auto mt-3 sm:mt-6">
        <a
          href={ctaHref}
          onClick={(e) => {
            e.preventDefault();

            document
              .getElementById("ProduitsPromo")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="flex w-full items-center justify-center px-8 py-4 rounded-full
               text-base md:text-lg font-bold text-white uppercase shadow-lg
               transition-all duration-300 hover:scale-95"
          style={{
            background: "linear-gradient(90deg, #FF2D6F, #FF9E1B)",
          }}
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
};

export default SoldesCarousel;
