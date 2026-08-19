// frontend-wp/src/pages/axe/AxeProductPage.jsx
// ═══════════════════════════════════════════════════════════════════════════
// PAGE PRODUIT — lue dans la base Axe Musique
// ═══════════════════════════════════════════════════════════════════════════
// Remplace `ProductPage.jsx` quand `VITE_USE_AXE_CATALOG=true`.
//
// ─── Elle reprend l'habillage de la page WooCommerce, DÉLIBÉRÉMENT ─────────
// Mêmes composants (`Background`, `Breadcrumb`, `StockBadge`, `Title`), même
// gabarit : bandeau sombre avec fil d'Ariane à droite, corps sur fond dégradé,
// cartes blanches. Le visiteur ne doit pas pouvoir dire quelle page vient de
// quelle source — sans quoi la bascule se verrait, et c'est précisément ce
// qu'on ne veut pas.
//
// ─── Ce qui n'y est PAS, et pourquoi ──────────────────────────────────────
//   • pas d'images ni de galerie DU PRODUIT — non exportées ;
//   • pas de bouton favori — `WishlistButton` attend la forme WooCommerce
//     (`images[]`, `regular_price`, identifiant numérique) ; lui passer notre
//     objet écrirait des favoris de travers dans le stockage local ;
//   • pas d'ajout au panier — le site est une vitrine, il ne vend pas.
//
// ─── Ce qui y est ENTRÉ depuis ────────────────────────────────────────────
// Les produits liés, écartés ici tant que la règle n'était pas décidée. Elle
// l'est : même catégorie, produit courant exclu, huit au maximum, ordre de
// l'API — voir `AxeRelatedProducts.jsx`. Le commentaire qui disait le
// contraire a été retiré plutôt que laissé à vieillir.
//
// Le LOGO DE MARQUE, lui, est arrivé : ses octets sont en ligne depuis le
// 19 août 2026 et `catalog.php` rend `brand.image`, une URL COMPLÈTE — voir
// `BrandBadge` plus bas. Le champ est null pour la quasi-totalité des marques,
// et c'est le cas NORMAL : trois marques sur 288 sont synchronisées à ce jour.
//
// La description est rendue en HTML brut, comme celle de WooCommerce. Elle
// vient de notre propre base, alimentée par notre propre export ; le jour où
// elle deviendra saisissable par un tiers, ce `dangerouslySetInnerHTML` devra
// être assaini.

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ImageOff } from "lucide-react";

import { fetchProductBySlug } from "../../services/axeCatalog";
import { formatPrice } from "../../utils/format";
import Background from "../../components/UI/Background";
import Breadcrumb from "../../components/UI/Breadcrumb";
import Title from "../../components/UI/Title";
import StockBadge from "../../components/Product/StockBadge";
import { ProductPageBodySkeleton } from "../../components/UI/LoadingSkeleton";
import AxeRelatedProducts from "../../components/Product/AxeRelatedProducts";

/**
 * Notre export ne porte pas `stock_status` — seulement un entier.
 *
 * On le traduit ici plutôt que d'ajouter un champ au contrat : le statut est
 * *calculable* à partir du stock, et le modèle cible a tranché que ce qui est
 * calculable ne se stocke pas. `manageStock` à `true` avec une quantité nulle
 * donne « En cours de réappro » plutôt que « Rupture de stock », ce qui est le
 * comportement de la page WooCommerce (`StockBadge.jsx:18`).
 */
function stockProps(stock) {
  return {
    stockStatus: stock > 0 ? "instock" : "outofstock",
    manageStock: true,
    stockQuantity: Number.isFinite(stock) ? stock : 0,
  };
}

/**
 * La pastille de marque, avec son logo quand il existe.
 *
 * ─── LE REPLI EST LE CAS NORMAL, PAS LE CAS D'ERREUR ──────────────────────
 * Trois marques sur 288 ont leurs images en ligne au 19 août 2026 : la très
 * grande majorité des pages produit n'aura pas de logo, et l'absence doit
 * donc être PROPRE et SILENCIEUSE. Sans logo, on rend exactement la pastille
 * d'avant — même bordure, même fond, même texte : aucun trou réservé, aucune
 * icône « image manquante », aucun décalage de mise en page.
 *
 * `brand.image` est consommée TELLE QUELLE. C'est une URL complète, composée
 * côté serveur à partir de `media_base_url` : ce bundle est public et déjà en
 * production, il ne doit porter aucun préfixe de médias qu'il faudrait
 * reconstruire à chaque déménagement. Ne jamais la préfixer ici.
 *
 * Pas de `loading="lazy"` : le logo est au-dessus de la ligne de flottaison,
 * il pèse 24 pixels de côté, et le différer ne ferait que le faire apparaître
 * après le reste de la page.
 *
 * `broken` couvre le seul cas restant : l'URL est là mais les octets ne
 * répondent pas (déploiement à moitié, fichier retiré du disque). On repasse
 * alors au repli plutôt que de laisser l'icône d'image cassée du navigateur.
 */
function BrandBadge({ brand }) {
  const [broken, setBroken] = useState(false);
  const showLogo = Boolean(brand.image) && !broken;

  return (
    <span className="flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
      {showLogo && (
        <img
          src={brand.image}
          alt=""
          aria-hidden="true"
          onError={() => setBroken(true)}
          className="h-6 w-6 shrink-0 object-contain"
        />
      )}
      {brand.name}
    </span>
  );
}

const AxeProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ loading: true, error: null, data: null });

    fetchProductBySlug(slug)
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
  }, [slug]);

  const { loading, error, data } = state;

  if (loading) {
    return (
      <div>
        <section className="relative overflow-hidden page-content pt-36 pb-4 md:pt-48 md:pb-4">
          <Background variant="ocean-night" opacity={1} animated={true} />
          <div className="container-divi relative z-20">
            <div className="flex justify-end">
              <Breadcrumb loading />
            </div>
          </div>
        </section>

        <ProductPageBodySkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div>
        <section className="relative overflow-hidden min-h-[200px] page-content">
          <Background variant="auto" opacity={1} animated={true} />
          <div className="container-divi relative z-20">
            <div className="py-12 text-center">
              <Title
                tag="h1"
                className="mb-4 text-white"
                animationType="equalizer"
                gradient="default"
                mode="neon"
              >
                Produit non trouvé
              </Title>
              <p className="mb-6 text-white/80">
                {error || "Ce produit n'existe pas ou n'est plus disponible"}
              </p>
              <button
                onClick={() => navigate("/")}
                className="rounded-lg bg-pink-500 px-6 py-3 text-white transition-colors hover:bg-pink-600"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { product, categories = [] } = data;

  // Le fil d'Ariane s'arrête à UNE catégorie : un produit en a un ensemble,
  // sans principale (décision du modèle cible). Remonter la chaîne des parents
  // demanderait un appel de plus, pour une information dont l'utilité au
  // visiteur n'est pas établie.
  const breadcrumbItems = [
    { label: "Accueil", path: "/" },
    ...(categories[0]
      ? [
          {
            label: categories[0].name,
            path: `/categorie-produit/${categories[0].slug}`,
          },
        ]
      : []),
    { label: product.title },
  ];

  return (
    <div>
      {/* Bandeau — fil d'Ariane uniquement, comme la page WooCommerce */}
      <section className="relative overflow-hidden page-content pt-36 pb-4 md:pt-48 md:pb-4">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-20">
          <div className="flex justify-end">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="container-divi">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-12">
            <div className="lg:sticky lg:top-6">
              <div className="flex h-[400px] items-center justify-center rounded-lg bg-white shadow-lg">
                <div className="text-center text-gray-300">
                  <ImageOff className="mx-auto h-14 w-14" />
                  <p className="mt-3 text-xs">Image à venir</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <div className="mb-4 border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.title}
                  </h2>
                </div>

                <div className="mb-4 flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price_ttc)}
                  </span>
                </div>

                {product.brand && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                      Marque
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {/* Même pastille que la page WooCommerce, logo compris
                          quand la marque en a un en ligne. */}
                      <BrandBadge brand={product.brand} />
                    </div>
                  </div>
                )}

                {categories.length > 0 && (
                  <div className="mb-4">
                    <h3 className="mb-2 text-sm font-semibold text-gray-700">
                      Catégories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/categorie-produit/${category.slug}`}
                          className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <StockBadge
                  {...stockProps(product.stock)}
                  size="md"
                  showQuantity={true}
                />

                {product.sku && (
                  <p className="mt-4 text-sm text-gray-500">
                    Référence : <span className="font-mono">{product.sku}</span>
                  </p>
                )}
              </div>

              {product.description && (
                <div className="rounded-lg bg-white p-6 shadow-md">
                  <h2 className="mb-3 text-lg font-semibold text-gray-900">
                    Description
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    // Voir l'avertissement en tête de fichier.
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* La catégorie retenue est la MÊME que celle du fil d'Ariane —
              `categories[0]`. Deux « premières catégories » différentes sur la
              même page seraient un mensonge discret. */}
          <AxeRelatedProducts
            categorySlug={categories[0]?.slug}
            currentProductId={product.id}
          />
        </div>
      </section>
    </div>
  );
};

export default AxeProductPage;
