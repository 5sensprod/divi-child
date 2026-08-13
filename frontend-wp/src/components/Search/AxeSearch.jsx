// frontend-wp/src/components/Search/AxeSearch.jsx
// ═══════════════════════════════════════════════════════════════════════════
// RECHERCHE — dans notre catalogue, pas dans WooCommerce
// ═══════════════════════════════════════════════════════════════════════════
// Remplace `Search.jsx` quand `VITE_USE_AXE_CATALOG=true`. Les deux ne se
// parlent pas : celle-ci n'appelle que `catalog.php?action=search`, l'autre ne
// connaît que Woo.
//
// Faire cohabiter les deux aurait été la pire option — un visiteur trouvant un
// produit dans une recherche Woo à un prix, puis lisant un autre prix sur la
// fiche servie par notre base. Une fonction absente se constate ; une fonction
// qui ment ne se constate pas.
//
// ─── CE QU'ELLE N'A PAS, PARCE QUE LA DONNÉE N'EST PAS LÀ ─────────────────
//   • pas de barre de filtres — `SearchFilters` filtre sur des catégories
//     WooCommerce, et notre recherche n'accepte aucun paramètre de filtre ;
//   • pas de dépliage de fiche — `ProductExpansion` lit la forme Woo
//     (`images[]`, `attributes`, `regular_price`) ; le lien mène à la page
//     produit, qui a tout cela dans sa propre forme ;
//   • pas de prix barré ni de pastille « Solde » — le catalogue n'a aucune
//     notion de promotion, décision du 10 août 2026 ;
//   • pas de vignette — les images ne sont pas exportées (§7 du contrat).
//
// La recherche porte sur le NOM, la RÉFÉRENCE et le SLUG, jamais sur la
// description : celle-ci est du HTML, et y chercher « strong » ramènerait la
// moitié du catalogue. L'ordre est alphabétique, sans pertinence pondérée.

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ImageOff, Search as SearchIcon, X } from "lucide-react";

import { formatPrice } from "../../utils/format";
import { MIN_QUERY, useAxeSearch } from "../../hooks/useAxeSearch";
import Modal from "../UI/Modal";
import Pagination from "../UI/Pagination";
import { SearchListSkeleton } from "./SearchSkeletons";

const PER_PAGE = 12;

const AxeSearch = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);

  // La mécanique — attente, page 1 sur nouvelle requête, deux caractères
  // minimum — est partagée avec la section « Notre catalogue » de l'accueil.
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

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="default"
      position="top"
      showCloseButton={false}
      backdropClassName="bg-black/50 backdrop-blur-sm"
      scrollToTopKey={page}
    >
      <div className="flex h-full flex-col">
        <div className="flex-shrink-0 border-b border-gray-100">
          <div className="flex items-center gap-4 px-4 py-4 lg:px-6">
            <div className="flex flex-1 items-center rounded-xl bg-gray-50 px-4 py-3">
              <SearchIcon className="mr-3 text-gray-400" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher un produit, une référence..."
                className="flex-1 bg-transparent text-lg placeholder-gray-500 outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="ml-2 rounded-full p-1 transition-colors hover:bg-gray-200"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-xl p-3 transition-colors hover:bg-gray-100"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-4 py-6 lg:px-6">
            {loading ? (
              <SearchListSkeleton count={PER_PAGE} />
            ) : error ? (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Recherche indisponible</p>
                <p>{error}</p>
              </div>
            ) : !searched ? (
              <p className="py-12 text-center text-sm text-gray-500">
                Saisissez au moins {MIN_QUERY} caractères.
              </p>
            ) : products.length === 0 ? (
              <div className="py-12 text-center">
                <SearchIcon size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-600">
                  Aucun produit pour «&nbsp;
                  <span className="font-medium">{query.trim()}</span>&nbsp;».
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  La recherche porte sur le nom et la référence.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{total}</span> résultat
                    {total > 1 ? "s" : ""} pour{" "}
                    <span className="font-medium text-gray-800">
                      «&nbsp;{query.trim()}&nbsp;»
                    </span>
                  </p>
                  {totalPages > 1 && (
                    <span className="text-xs text-gray-500">
                      Page {page} / {totalPages}
                    </span>
                  )}
                </div>

                <div className="grid gap-3">
                  {products.map((product) => (
                    <AxeSearchResult
                      key={product.id}
                      product={product}
                      onNavigate={onClose}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onChange={setPage}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 px-4 py-3 lg:px-6">
          <p className="hidden text-center text-xs text-gray-500 sm:block">
            Appuyez sur{" "}
            <kbd className="rounded border border-gray-200 bg-white px-2 py-1 text-xs">
              Échap
            </kbd>{" "}
            pour fermer
          </p>
        </div>
      </div>
    </Modal>
  );
};

/**
 * Une ligne de résultat.
 *
 * Le lien mène à la page produit ; la modale se ferme au clic, sans quoi elle
 * resterait ouverte par-dessus la page qu'on vient d'ouvrir.
 */
const AxeSearchResult = ({ product, onNavigate }) => (
  <Link
    to={`/produit/${product.slug || product.id}`}
    onClick={onNavigate}
    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
  >
    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
      <ImageOff size={20} className="text-gray-300" />
    </div>

    <div className="min-w-0 flex-1">
      <h3 className="mb-1 line-clamp-1 font-medium text-gray-900">
        {product.title}
      </h3>
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-lg font-bold text-blue-600">
          {formatPrice(product.price_ttc)}
        </p>
        {product.brand && (
          <p className="text-sm text-gray-500">{product.brand.name}</p>
        )}
        {product.sku && (
          <p className="font-mono text-xs text-gray-400">{product.sku}</p>
        )}
      </div>
      {product.stock > 0 && (
        <p className="mt-1 text-xs text-green-600">✓ En stock</p>
      )}
    </div>
  </Link>
);

export default AxeSearch;
