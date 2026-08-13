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
// ─── AU REPOS : UN APERÇU, PAS DES « NOUVEAUTÉS » ─────────────────────────
// Tant qu'on n'a rien tapé, la section montre huit produits sous le titre « Un
// aperçu du catalogue ». Ce titre est exact, et c'est pour cela qu'il a été
// choisi : **le catalogue ne sait pas dire quels produits sont les derniers.**
//
// Vérifié dans `catalog.php` : la mise en forme d'un produit ne rend aucune
// date, et aucune action ne trie par date — seulement par nom ou par nombre de
// produits. La seule colonne date du schéma est `exported_at`, réécrite à
// chaque export (`products-sync.php`), donc sans rapport avec l'arrivée en
// magasin. Trier par elle donnerait la queue du dernier lot envoyé, sous un
// titre qui promettrait des nouveautés.
//
// Le jour où le serveur portera une vraie date de première parution, ce bloc
// devient « Les derniers arrivés » et rien d'autre ne bouge. L'état des lieux
// complet — ce que NeDB porte, ce que PocketBase peut porter, et les trois
// chemins possibles — est dans l'autre dépôt, avec le reste de la migration :
// `I:\pockapp\frontend\modules\site\PocketSite-docs\13-dates-produits.md`.
//
// ─── LA CATÉGORIE MONTRÉE EST LA MIEUX FOURNIE ────────────────────────────
// La première de `action=categories`, qui trie par nombre de produits. Son slug
// est lu dans la réponse, jamais deviné.
//
// Elle a d'abord été la DEUXIÈME, tant qu'`AxeCatalogSection` occupait le haut
// de l'accueil avec la mieux fournie : deux grilles identiques se seraient
// suivies. Cette section a été retirée le 13 août 2026, et l'aperçu est revenu
// au premier choix — l'évitement n'avait plus d'objet.
//
// Pas d'images (§7 du contrat d'export) : la carte est celle de la page
// catégorie, réutilisée telle quelle.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, X } from "lucide-react";

import { MIN_QUERY, useAxeSearch } from "../../hooks/useAxeSearch";
import {
  fetchCategoryWithProducts,
  fetchOnlineCategories,
} from "../../services/axeCatalog";
import { AxeProductCard } from "../../pages/axe/AxeCategoryPage";
import Pagination from "../UI/Pagination";
import Title from "../UI/Title";

const PER_PAGE = 12;
const APERCU = 8;

/**
 * Huit produits de la catégorie la mieux fournie.
 *
 * Deux appels et non un : le premier sert à CHOISIR la catégorie sans en
 * inventer le slug, le second à la charger. Les deux réponses sont mises en
 * cache cinq minutes par le serveur (`Cache-Control`, `catalog.php`), donc le
 * coût réel est proche d'un seul aller-retour.
 *
 * Chargé UNE FOIS, au montage, et conservé. Le brancher sur « la recherche
 * est-elle au repos ? » paraissait plus économe et faisait l'inverse : entre
 * chaque frappe et le déclenchement de la recherche, l'état repassait au repos
 * et relançait les deux appels. Mesuré dans l'onglet réseau, pas déduit.
 */
function useApercu() {
  const [state, setState] = useState({ products: [], category: null });

  useEffect(() => {
    let cancelled = false;

    fetchOnlineCategories()
      .then((data) => {
        const categories = data.categories || [];
        const choisie = categories[0];
        if (!choisie?.slug) return null;
        return fetchCategoryWithProducts({
          slug: choisie.slug,
          limit: APERCU,
        });
      })
      .then((data) => {
        if (cancelled || !data) return;
        setState({
          products: (data.products || []).slice(0, APERCU),
          category: data.category || null,
        });
      })
      .catch(() => {
        // Muet : l'aperçu est un agrément. Une bannière d'erreur au repos, sur
        // une page d'accueil qui s'est affichée correctement par ailleurs,
        // inquiéterait sans rien apprendre. La recherche, elle, dit ses erreurs.
        if (!cancelled) setState({ products: [], category: null });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
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

            {apercu.products.length > 0 && (
              <>
                <p className="mb-6 text-center text-sm text-gray-600">
                  Un aperçu du catalogue
                  {apercu.category?.name && (
                    <span className="text-gray-500">
                      {" "}
                      — {apercu.category.name}
                    </span>
                  )}
                </p>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {apercu.products.map((product) => (
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
