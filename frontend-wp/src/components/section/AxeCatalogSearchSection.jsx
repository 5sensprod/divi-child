// frontend-wp/src/components/section/AxeCatalogSearchSection.jsx
// ═══════════════════════════════════════════════════════════════════════════
// « NOTRE CATALOGUE » — la section de l'accueil, avec sa barre de recherche
// ═══════════════════════════════════════════════════════════════════════════
// Reprend la place et le gabarit de la section WooCommerce qu'elle remplace
// sous `useAxeCatalog` (`Home.jsx`, `id="ProduitsVedettes"`, titre en dégradé
// « sunset ») : même ancre, donc les liens et les défilements qui la visaient
// continuent de fonctionner.
//
// La barre de recherche est la MÊME que celle de la modale du bandeau — même
// hook `useAxeSearch`, donc mêmes deux caractères minimum, même attente de
// 300 ms, même message d'erreur du serveur affiché tel quel. Deux barres de
// recherche qui se comporteraient différemment sur un même site est exactement
// ce qu'on évite ici.
//
// ─── AU REPOS : LES PRODUITS QUI ONT BOUGÉ EN DERNIER ─────────────────────
// Tant qu'on n'a rien tapé, la section montre huit produits, par
// `action=latest`. Elle montrait jusqu'au 20 août 2026 la catégorie la mieux
// fournie — « Partitions », la même à chaque visite.
//
// ─── CE QUE CE TRI DIT, ET CE QU'IL NE DIT PAS ────────────────────────────
// Il porte sur `exported_at`, et **ce n'est PAS une date d'arrivée** : cette
// donnée n'existe nulle part dans la chaîne, l'état des lieux est dans l'autre
// dépôt (`I:\pockapp\frontend\modules\site\PocketSite-docs\13-dates-produits.md`).
// `exported_at` date le dernier export CONTENANT le produit, et l'export est
// incrémental sur une empreinte qui couvre le stock et le prix : une vente
// redate un produit.
//
// La liste est donc « ce qui a bougé en dernier » — des réassorts autant que
// des nouveautés. Elle se renouvelle toute seule, ce qu'on lui demande, mais
// le libellé ne doit rien promettre d'autre. Le jour où une vraie date de
// première parution existe, seul l'`ORDER BY` du serveur change ; ni cet appel
// ni cette mise en page ne bougent.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";

import { MIN_QUERY, useAxeSearch } from "../../hooks/useAxeSearch";
import { fetchLatestProducts } from "../../services/axeCatalog";
import { AxeProductCard } from "../../pages/axe/AxeCategoryPage";
import Pagination from "../UI/Pagination";
import Title from "../UI/Title";

const PER_PAGE = 12;
const APERCU = 8;

/**
 * Les huit derniers produits exportés.
 *
 * UN appel, là où la version « catégorie la mieux fournie » en demandait deux :
 * le serveur trie, il n'y a plus de catégorie à choisir avant de charger.
 *
 * Chargé UNE FOIS, au montage, et conservé. Le brancher sur « la recherche
 * est-elle au repos ? » paraissait plus économe et faisait l'inverse : entre
 * chaque frappe et le déclenchement de la recherche, l'état repassait au repos
 * et relançait l'appel. Mesuré dans l'onglet réseau, pas déduit.
 */
function useApercu() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    fetchLatestProducts({ limit: APERCU })
      .then((data) => {
        if (cancelled) return;
        setProducts((data.products || []).slice(0, APERCU));
      })
      .catch(() => {
        // Muet : l'aperçu est un agrément. Une bannière d'erreur au repos, sur
        // une page d'accueil qui s'est affichée correctement par ailleurs,
        // inquiéterait sans rien apprendre. La recherche, elle, dit ses erreurs.
        if (!cancelled) setProducts([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return products;
}

const AxeCatalogSearchSection = () => {
  const {
    query,
    setQuery,
    page,
    setPage,
    totalPages,
    loading,
    error,
    products,
    total,
    searched,
  } = useAxeSearch(PER_PAGE);

  const apercu = useApercu();

  return (
    <section
      id="ProduitsVedettes"
      className="bg-gradient-to-br from-gray-50 to-gray-100 py-10"
    >
      <div className="container-divi">
        <div className="mb-10 text-center">
          <Title
            tag="h2"
            className="mb-4"
            animationType="equalizer"
            gradient="sunset"
          >
            Notre catalogue
          </Title>
        </div>

        <div className="mx-auto mb-8 max-w-2xl">
          <div className="flex items-center rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-colors hover:border-blue-300 focus-within:border-blue-400">
            <SearchIcon className="ml-4 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher un produit, une référence..."
              className="flex-1 rounded-xl bg-transparent p-4 text-lg placeholder-gray-500 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mr-3 rounded-full p-2 transition-colors hover:bg-gray-100"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
          {/* Ce que la recherche regarde, dit d'avance : sans cela, un visiteur
              qui cherche « guitare rouge » conclut que le catalogue est vide,
              alors qu'aucun nom de produit ne porte les deux mots. */}
          <p className="mt-2 text-center text-xs text-gray-500">
            La recherche porte sur le nom et la référence des produits.
          </p>
        </div>

        {error ? (
          <div className="mx-auto max-w-2xl rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Recherche indisponible</p>
            <p>{error}</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-lg bg-white shadow-sm"
              />
            ))}
          </div>
        ) : !searched ? (
          <>
            {query.trim().length > 0 && (
              <p className="mb-6 text-center text-sm text-gray-500">
                Saisissez au moins {MIN_QUERY} caractères.
              </p>
            )}

            {apercu.length > 0 && (
              <>
                {/* « Dernières mises à jour », et non « Nouveautés » : le tri
                    porte sur la date d'export, qu'une vente rafraîchit. Le
                    libellé dit ce que la donnée permet de dire. */}
                <p className="mb-6 text-center text-sm text-gray-600">
                  Dernières mises à jour du catalogue
                </p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {apercu.map((product) => (
                    <AxeProductCard key={product.id} product={product} />
                  ))}
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                  Cherchez un produit ci-dessus, ou{" "}
                  <Link to="/shop" className="text-blue-600 hover:underline">
                    parcourez les rayons
                  </Link>
                  .
                </p>
              </>
            )}
          </>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600">
            Aucun produit pour «&nbsp;
            <span className="font-medium">{query.trim()}</span>&nbsp;».
          </p>
        ) : (
          <>
            <p className="mb-6 text-center text-sm text-gray-600">
              <span className="font-semibold">{total}</span> produit
              {total > 1 ? "s" : ""} pour{" "}
              <span className="font-semibold">
                «&nbsp;{query.trim()}&nbsp;»
              </span>
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <AxeProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onChange={(next) => {
                    setPage(next);
                    document
                      .getElementById("ProduitsVedettes")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AxeCatalogSearchSection;
