// frontend-wp/src/components/section/AxeCatalogSection.jsx
// ═══════════════════════════════════════════════════════════════════════════
// UNE CATÉGORIE ET SES PRODUITS, LUS DANS NOTRE BASE
// ═══════════════════════════════════════════════════════════════════════════
// Premier composant du site alimenté par la base SQL Axemusique plutôt que par
// WooCommerce. Il ne partage RIEN avec `WordPressContext` : ni requête, ni
// cache, ni forme de donnée — c'est voulu, les deux sources doivent pouvoir
// cohabiter le temps de la bascule.
//
// ⚠️ SANS IMAGES, ET CE N'EST PAS UN OUBLI.
// Les images du catalogue ne sont pas encore exportées vers le serveur (§7 du
// contrat d'export) : elles vivaient dans le stockage local de PocketApp, que
// ce site ne peut pas atteindre.
//
// Ce n'est plus vrai depuis le 20 août 2026 : le miroir accepte les produits,
// et `catalog.php` rend `product.image` en URL complète. Mais UN produit sur
// 2412 publiés est en ligne — la vignette de remplacement reste donc ce qu'on
// voit presque partout, et c'est normal. Voir `AxeProductImage`.

import React, { useEffect, useState } from "react";
import { PackageSearch } from "lucide-react";

import { fetchCategoryWithProducts } from "../../services/axeCatalog";
import { formatPrice } from "../../utils/format";
import AxeProductImage from "../Product/AxeProductImage";

const AxeCatalogSection = ({
  slug,
  categoryId,
  limit = 8,
  title = "Notre sélection",
}) => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    category: null,
    products: [],
  });

  useEffect(() => {
    let cancelled = false;

    setState((previous) => ({ ...previous, loading: true, error: null }));

    fetchCategoryWithProducts({ slug, id: categoryId, limit })
      .then((data) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: null,
          category: data.category,
          products: data.products || [],
        });
      })
      .catch((error) => {
        if (cancelled) return;
        // L'erreur est portée à l'écran plutôt qu'avalée : cette section est
        // une bascule en cours, et un échec silencieux se confondrait avec une
        // catégorie vide.
        setState({
          loading: false,
          error: error.message,
          category: null,
          products: [],
        });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, categoryId, limit]);

  const { loading, error, category, products } = state;

  if (loading) {
    return (
      <section className="py-14">
        <div className="container-divi">
          <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-56 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-14">
        <div className="container-divi">
          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Catalogue Axe Musique indisponible</p>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="py-14">
      <div className="container-divi">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500">
            {title}
          </p>
          <h2 className="mt-1 text-3xl font-bold text-gray-800">
            {category?.name}
          </h2>
          {category?.description && (
            <p className="mx-auto mt-2 max-w-2xl text-gray-600">
              {category.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="flex aspect-square items-center justify-center bg-gray-50">
                <AxeProductImage src={product.image} alt={product.title} />
              </div>

              <div className="flex flex-1 flex-col gap-1 p-4">
                <h3
                  className="line-clamp-2 text-sm font-semibold leading-tight text-gray-800"
                  title={product.title}
                >
                  {product.title}
                </h3>

                {product.brand && (
                  <span className="text-xs text-gray-500">
                    {product.brand.name}
                  </span>
                )}

                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-base font-bold text-gray-900">
                    {formatPrice(product.price_ttc)}
                  </span>
                  {product.stock > 0 ? (
                    <span className="text-xs font-medium text-emerald-600">
                      En stock
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <PackageSearch className="h-3 w-3" />
                      Sur commande
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AxeCatalogSection;
