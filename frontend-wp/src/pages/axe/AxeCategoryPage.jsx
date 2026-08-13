// frontend-wp/src/pages/axe/AxeCategoryPage.jsx
// ═══════════════════════════════════════════════════════════════════════════
// PAGE CATÉGORIE — lue dans la base Axe Musique
// ═══════════════════════════════════════════════════════════════════════════
// Remplace `CategoryPage.jsx` quand `VITE_USE_AXE_CATALOG=true`. Les deux
// coexistent le temps de la bascule ; celle-ci ne parle qu'à notre API, l'autre
// qu'à WooCommerce. Aucune des deux n'appelle l'autre.
//
// Même habillage que la page WooCommerce : bandeau `ocean-night` portant le
// titre et le décompte, corps sur fond dégradé. La bascule ne doit pas se voir.
//
// ⚠️ LES SLUGS NE SONT PAS CEUX DE WORDPRESS. Ce sont les nôtres, produits à
// l'export et figés au premier envoi. Une URL WordPress connue ne résout donc
// pas ici, et c'est pour cela que le menu et les pages basculent ENSEMBLE.
//
// Pas d'images : elles ne sont pas encore exportées (§7 du contrat d'export).
//
// Pas de TRI, contrairement à la page WooCommerce : le sien travaille sur la
// liste complète, chargée d'un bloc. Ici la liste est paginée côté serveur —
// le porter demanderait de le pousser en SQL, ce qui est un ticket à part.
//
// Des FILTRES, en revanche, il y en a — mais uniquement sur la page affichée,
// et la barre l'annonce elle-même. Voir `AxeProductFilter.jsx`, dont l'en-tête
// explique pourquoi ce choix a été préféré au silence.

import React, { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

import { fetchCategoryPage } from "../../services/axeCatalog";
import { formatPrice } from "../../utils/format";
import Background from "../../components/UI/Background";
import Breadcrumb from "../../components/UI/Breadcrumb";
import Title from "../../components/UI/Title";
import AxeProductFilter, {
  DEFAULT_AXE_FILTERS,
  applyAxeFilters,
} from "../../components/Product/AxeProductFilter";

const PER_PAGE = 24;

/**
 * Le slug est le DERNIER segment de l'URL.
 *
 * La route est `/categorie-produit/*` et WordPress y mettait une hiérarchie
 * (`parent/enfant`). Nos slugs sont plats et uniques : prendre le dernier
 * segment accepte les deux formes sans avoir à les distinguer.
 */
function slugFromPath(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
}

const AxeCategoryPage = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = slugFromPath(location.pathname);
  const page = Math.max(1, Number(searchParams.get("page") || 1));

  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });
  const [filters, setFilters] = useState(DEFAULT_AXE_FILTERS);

  // Les filtres ne portent que sur la page affichée : les garder d'une page à
  // l'autre laisserait croire qu'ils suivent la navigation.
  useEffect(() => {
    setFilters(DEFAULT_AXE_FILTERS);
  }, [slug, page]);

  useEffect(() => {
    let cancelled = false;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    fetchCategoryPage({ slug, page, perPage: PER_PAGE })
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: null, data });
      })
      .catch((error) => {
        if (!cancelled)
          setState({ loading: false, error: error.message, data: null });
      });

    return () => {
      cancelled = true;
    };
  }, [slug, page]);

  const { loading, error, data } = state;

  if (error) {
    return (
      <div>
        <section className="relative overflow-hidden page-content pt-32 pb-8">
          <Background variant="auto" opacity={1} animated={true} />
          <div className="container-divi relative z-10">
            <div className="py-10 text-center">
              <Title
                tag="h1"
                className="mb-4 text-white drop-shadow-lg"
                animationType="none"
                gradient="ocean"
                mode="oceanNight"
                bold="true"
              >
                Catégorie indisponible
              </Title>
              <p className="mb-6 text-white/80">{error}</p>
              <Link
                to="/"
                className="rounded-lg bg-pink-500 px-6 py-3 text-white transition-colors hover:bg-pink-600"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const category = data?.category;
  const ancestors = data?.ancestors || [];
  const children = data?.children || [];

  // Même fil d'Ariane que la page produit, et pour la même raison : depuis une
  // sous-catégorie, remonter à la catégorie parente ne doit pas demander le
  // bouton « retour » du navigateur. La chaîne vient du serveur, de la racine
  // au parent direct ; la catégorie courante la referme, sans lien.
  const breadcrumbItems = [
    { label: "Accueil", path: "/" },
    ...ancestors.map((ancestor) => ({
      label: ancestor.name,
      path: `/categorie-produit/${ancestor.slug}`,
    })),
    ...(category ? [{ label: category.name }] : []),
  ];
  const products = data?.products || [];
  const visibleProducts = applyAxeFilters(products, filters);
  const total = data?.total || 0;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));

  const goToPage = (next) => {
    setSearchParams(next > 1 ? { page: String(next) } : {});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      {/* Bandeau — titre et décompte, comme la page WooCommerce */}
      <section className="relative overflow-hidden page-content pt-32 pb-6 md:pt-36 md:pb-6">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-10">
          {!loading && (
            <div className="mb-4 flex justify-end">
              <Breadcrumb items={breadcrumbItems} />
            </div>
          )}

          <div className="text-center">
            <Title
              tag="h1"
              className="mb-2 text-white drop-shadow-lg"
              animationType="none"
              gradient="ocean"
              mode="oceanNight"
              bold="true"
            >
              {category?.name || "Catégorie"}
            </Title>
            <p className="text-base text-white/80">
              {loading
                ? "Chargement des produits..."
                : `${total} produit${total > 1 ? "s" : ""} disponible${total > 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container-divi">
          {category?.description && !loading && (
            <p className="mb-6 max-w-4xl text-sm text-gray-600">
              {category.description}
            </p>
          )}

          {/* Sous-catégories : seules celles qui portent des produits
              remontent du serveur — proposer une branche vide est une impasse
              pour le visiteur. */}
          {children.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {children.map((child) => (
                <Link
                  key={child.id}
                  to={`/categorie-produit/${child.slug}`}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-colors hover:border-pink-300 hover:text-pink-600"
                >
                  {child.name}
                  <span className="ml-1.5 text-gray-400">
                    {child.product_count}
                  </span>
                </Link>
              ))}
            </div>
          )}

          {!loading && products.length > 0 && (
            <AxeProductFilter
              products={products}
              filters={filters}
              onChange={setFilters}
              resultCount={visibleProducts.length}
            />
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-lg bg-white shadow-sm"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              Aucun produit dans cette catégorie pour le moment.
            </p>
          ) : visibleProducts.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              Aucun produit de cette page ne correspond à ces filtres.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <AxeProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {lastPage > 1 && !loading && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </button>
              <span className="text-sm text-gray-600">
                Page {page} sur {lastPage}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= lastPage}
                className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-40"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/**
 * Carte produit.
 *
 * Volontairement PAS `ProductCard` : celui-ci lit `product.images[0].src`,
 * `sale_price`, `regular_price` et `stock_status` — la forme WooCommerce.
 * L'adapter demanderait soit de traduire nos objets à chaque rendu, soit de
 * lui apprendre une seconde forme, alors qu'il est déjà consommé par plusieurs
 * écrans qui n'ont rien demandé.
 */
export const AxeProductCard = ({ product }) => (
  <Link
    to={`/produit/${product.slug || product.id}`}
    className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-lg"
  >
    <div className="flex aspect-square items-center justify-center bg-gray-50">
      <ImageOff className="h-8 w-8 text-gray-300" />
    </div>
    <div className="flex flex-1 flex-col gap-1 p-4">
      <h3
        className="line-clamp-2 text-sm font-semibold leading-tight text-gray-800"
        title={product.title}
      >
        {product.title}
      </h3>
      {product.brand && (
        <span className="text-xs text-gray-500">{product.brand.name}</span>
      )}
      <div className="mt-auto flex items-center justify-between pt-3">
        <span className="text-base font-bold text-gray-900">
          {formatPrice(product.price_ttc)}
        </span>
        {product.stock > 0 ? (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            En stock
          </span>
        ) : (
          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800">
            Réappro
          </span>
        )}
      </div>
    </div>
  </Link>
);

export default AxeCategoryPage;
