// frontend-wp/src/components/Product/AxeRelatedProducts.jsx
// ═══════════════════════════════════════════════════════════════════════════
// « DANS LA MÊME CATÉGORIE » — pas une recommandation
// ═══════════════════════════════════════════════════════════════════════════
// La règle est arrêtée, et elle tient en une phrase : les produits de la
// PREMIÈRE catégorie du produit courant — celle qui sert déjà de fil d'Ariane
// sur la page produit —, le produit courant exclu, huit au maximum, dans
// l'ordre rendu par l'API.
//
// Aucune similarité, aucun score, aucune pondération. Le titre l'annonce
// littéralement : « Dans la même catégorie ». Un carrousel qui prétendrait
// recommander, alors qu'il liste un voisinage de classement, promettrait une
// intelligence qui n'est pas là.
//
// Aucun appel supplémentaire n'a été ajouté au serveur pour cela :
// `fetchCategoryPage` rend exactement ce qu'il faut.
//
// Pas d'images (§7 du contrat d'export) — la carte est celle de la page
// catégorie, réutilisée telle quelle.

import React, { useEffect, useState } from "react";

import { fetchCategoryPage } from "../../services/axeCatalog";
import { AxeProductCard } from "../../pages/axe/AxeCategoryPage";

const MAX_RELATED = 8;

const AxeRelatedProducts = ({ categorySlug, currentProductId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!categorySlug) return undefined;

    let cancelled = false;

    // On demande un de plus que ce qu'on affiche : le produit courant fait
    // partie de sa propre catégorie et sera retiré. Sans cela, une catégorie de
    // huit produits n'en montrerait que sept.
    fetchCategoryPage({
      slug: categorySlug,
      page: 1,
      perPage: MAX_RELATED + 1,
    })
      .then((data) => {
        if (cancelled) return;
        const others = (data.products || [])
          .filter((product) => product.id !== currentProductId)
          .slice(0, MAX_RELATED);
        setProducts(others);
      })
      .catch(() => {
        // Silencieux, à la différence du reste de la bascule : c'est une
        // section d'agrément. Une bannière d'erreur au bas d'une fiche produit
        // qui, elle, s'est affichée correctement, inquiéterait sans informer.
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, [categorySlug, currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Dans la même catégorie
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <AxeProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default AxeRelatedProducts;
