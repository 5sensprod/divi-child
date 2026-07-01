// frontend-wp/src/components/Product/PromoProductsSection.jsx
import React, { useState, useEffect } from "react";
import { getProductsOnSale } from "../../services/woocommerce";
import ProductGrid from "./ProductGrid";
import Pagination from "../UI/Pagination";
import Title from "../UI/Title";
import Background from "../UI/Background";

const PromoProductsSection = ({ perPage = 8, className = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchPromo = async () => {
      try {
        setLoading(true);
        const { data, pagination } = await getProductsOnSale({
          per_page: perPage,
          page,
        });
        if (isMounted) {
          setProducts(data);
          setTotalPages(pagination.totalPages);
          setTotal(pagination.total);
        }
      } catch (error) {
        console.error("Erreur chargement produits en promo:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPromo();
    return () => {
      isMounted = false;
    };
  }, [page, perPage]);

  if (!loading && products.length === 0) return null;

  return (
    <section
      id="ProduitsPromo"
      className={`py-14 relative overflow-hidden ${className}`}
    >
      <Background variant="boutique" opacity={0.95} animated={true} />

      <div className="container-divi relative z-10">
        <div className="text-center mb-10">
          <Title
            tag="h2"
            className="mb-4"
            animationType="equalizer"
            gradient="sunset"
          >
            🔥 Nos meilleures soldes
          </Title>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Profitez de nos offres du moment avant qu'elles ne s'envolent
          </p>
        </div>

        <ProductGrid
          products={products}
          loading={loading}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        />

        {!loading && totalPages > 1 && (
          <>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                document
                  .getElementById("ProduitsPromo")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            />
            <div className="text-center mt-4 text-sm text-gray-600">
              {total} produit{total > 1 ? "s" : ""} en solde
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PromoProductsSection;
