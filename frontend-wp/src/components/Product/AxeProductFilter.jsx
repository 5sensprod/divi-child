// frontend-wp/src/components/Product/AxeProductFilter.jsx
// ═══════════════════════════════════════════════════════════════════════════
// FILTRES DE LA PAGE COURANTE — et la barre le dit
// ═══════════════════════════════════════════════════════════════════════════
// Trois critères, ceux que notre catalogue porte réellement : marque, prix,
// disponibilité. Ni promotion, ni note, ni nouveauté — ces champs n'existent
// pas au contrat, et une facette vide qui ne filtre rien est une promesse
// rompue à chaque clic.
//
// ─── LE PIÈGE, ET LA FAÇON DONT ON LE TRAITE ──────────────────────────────
// La page catégorie est paginée CÔTÉ SERVEUR (24 par page). Ce filtre-ci est
// entièrement client : il ne voit que les produits déjà chargés, donc la page
// affichée. Filtrer « moins de 100 € » sur la page 1 ne dit rien des 300
// produits des pages suivantes.
//
// Le pousser en SQL serait la bonne réponse, et c'est un ticket serveur qui
// n'est pas ouvert. En attendant, la barre ANNONCE sa portée en toutes
// lettres — « parmi les 24 produits de cette page ». Un filtre muet aurait
// laissé croire qu'il porte sur la catégorie entière, ce qui est précisément
// l'erreur qu'on ne veut pas induire.
//
// ─── LES FACETTES ABSENTES DISPARAISSENT ──────────────────────────────────
// Une seule marque sur la page : pas de sélecteur de marque. Tout en stock :
// pas de sélecteur de disponibilité. Un menu à une seule entrée n'est pas un
// filtre, c'est un ornement.

import React from "react";
import { RotateCcw } from "lucide-react";

export const DEFAULT_AXE_FILTERS = {
  brand: "",
  availability: "all",
  maxPrice: "",
};

/**
 * Applique les filtres à une liste de produits.
 *
 * Fonction pure, exportée à part : l'état vit dans la page, la barre n'est que
 * l'interface. Aucun effet, donc aucune boucle de rendu possible entre les
 * deux.
 */
export function applyAxeFilters(products, filters) {
  const max = Number.parseFloat(filters.maxPrice);
  const hasMax = Number.isFinite(max);

  return products.filter((product) => {
    if (filters.brand && product.brand?.id !== filters.brand) return false;
    if (filters.availability === "in-stock" && !(product.stock > 0))
      return false;
    if (hasMax && Number(product.price_ttc) > max) return false;
    return true;
  });
}

/** Les marques présentes sur la page, dédoublonnées et triées. */
function brandsOf(products) {
  const map = new Map();
  products.forEach((product) => {
    if (product.brand?.id) map.set(product.brand.id, product.brand.name);
  });
  return [...map.entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));
}

const AxeProductFilter = ({ products, filters, onChange, resultCount }) => {
  const brands = brandsOf(products);
  const hasStockVariety =
    products.some((product) => product.stock > 0) &&
    products.some((product) => !(product.stock > 0));

  // Rien à proposer : une page d'une seule marque, tout en stock. La barre
  // n'apparaît pas du tout plutôt que d'apparaître inerte.
  if (brands.length < 2 && !hasStockVariety && products.length === 0) {
    return null;
  }

  const isActive =
    filters.brand !== "" ||
    filters.availability !== "all" ||
    filters.maxPrice !== "";

  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        {brands.length > 1 && (
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            Marque
            <select
              value={filters.brand}
              onChange={(event) => update({ brand: event.target.value })}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-800"
            >
              <option value="">Toutes</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {hasStockVariety && (
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            Disponibilité
            <select
              value={filters.availability}
              onChange={(event) => update({ availability: event.target.value })}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-800"
            >
              <option value="all">Toutes</option>
              <option value="in-stock">En stock</option>
            </select>
          </label>
        )}

        <label className="flex flex-col gap-1 text-xs text-gray-600">
          Prix maximum
          <input
            type="number"
            min="0"
            step="10"
            inputMode="decimal"
            value={filters.maxPrice}
            onChange={(event) => update({ maxPrice: event.target.value })}
            placeholder="€"
            className="w-28 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-800"
          />
        </label>

        {isActive && (
          <button
            type="button"
            onClick={() => onChange(DEFAULT_AXE_FILTERS)}
            className="flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser
          </button>
        )}
      </div>

      {/* La portée, dite sans détour. Voir l'en-tête du fichier. */}
      <p className="mt-3 text-xs text-gray-500">
        {isActive
          ? `${resultCount} produit${resultCount > 1 ? "s" : ""} parmi les ${products.length} de cette page.`
          : `Filtre parmi les ${products.length} produits de cette page, pas sur la catégorie entière.`}
      </p>
    </div>
  );
};

export default AxeProductFilter;
