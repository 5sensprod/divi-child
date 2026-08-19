// src/services/axeCatalog.js
// ═══════════════════════════════════════════════════════════════════════════
// CATALOGUE AXEMUSIQUE — lecture de notre propre base, sans WooCommerce
// ═══════════════════════════════════════════════════════════════════════════
// Consomme `server/api/catalog.php`, alimenté par PocketApp. C'est la première
// donnée catalogue du site qui ne vient PAS de WooCommerce.
//
// ─── AUCUNE CLÉ ICI, ET IL NE DOIT JAMAIS Y EN AVOIR ───────────────────────
// Ce fichier part dans le bundle public : tout ce qu'il contient est lisible
// par n'importe quel visiteur. C'est précisément le défaut de
// `services/woocommerce.js`, qui embarque `VITE_WC_CONSUMER_KEY` et
// `VITE_WC_CONSUMER_SECRET` en lecture-écriture.
//
// L'endpoint est donc public et en lecture seule. L'écriture reste derrière
// `products-sync.php` et sa clé, que PocketApp seul détient.

import { API_CONFIG } from "../utils/constants";

/**
 * Appelle l'endpoint et rend le JSON, ou lève.
 *
 * Pas de dépendance à axios : une requête publique sans en-tête n'a besoin de
 * rien de plus que `fetch`, et le bundle est déjà lourd.
 */
async function callCatalog(params) {
  const url = new URL(API_CONFIG.axeCatalogUrl, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  // Le mutualisé peut répondre une page HTML — erreur Apache, maintenance,
  // couche anti-bot. La lire comme du JSON donnerait une erreur de syntaxe
  // incompréhensible ; on dit ce qui s'est réellement passé.
  const raw = await response.text();
  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    throw new Error(
      `Réponse inattendue du catalogue (${response.status}) : ${raw.slice(0, 120)}`,
    );
  }

  if (!response.ok || payload?.ok === false) {
    throw new Error(payload?.error || `Erreur ${response.status}`);
  }

  return payload;
}

/**
 * Une catégorie et ses produits.
 *
 * Sans `slug` ni `id`, le serveur rend la catégorie la mieux fournie — ce que
 * veut une page d'accueil qui montre « une » catégorie.
 */
export async function fetchCategoryWithProducts({ slug, id, limit = 8 } = {}) {
  return await callCatalog({ action: "category", slug, id, limit });
}

/**
 * Une catégorie, sa page de produits, ses sous-catégories.
 *
 * Pagination à part de `fetchCategoryWithProducts` : la page d'accueil veut
 * « les 8 premiers » et la page catégorie « la page 3 » — deux besoins, deux
 * appels, plutôt qu'un seul aux paramètres ambigus.
 */
export async function fetchCategoryPage({
  slug,
  id,
  page = 1,
  perPage = 24,
} = {}) {
  return await callCatalog({
    action: "category",
    slug,
    id,
    page,
    per_page: perPage,
  });
}

/**
 * Un produit par son slug, avec les catégories auxquelles il appartient.
 *
 * Le slug est l'adresse publique, et il est **figé au premier envoi** côté
 * serveur : c'est ce qui permet à cette route de ne jamais casser.
 */
export async function fetchProductBySlug(slug) {
  return await callCatalog({ action: "product", slug });
}

/**
 * Les décomptes du catalogue en ligne.
 *
 * Produits, marques et catégories, comptés côté serveur sur les seuls produits
 * publiés. Additionner les `product_count` de `fetchOnlineCategories` donnerait
 * un total faux dans les deux sens : un produit rattaché à deux catégories
 * compterait double, un produit sans catégorie ne compterait pas.
 */
export async function fetchCatalogStats() {
  return await callCatalog({ action: "stats" });
}

/** Les catégories qui portent au moins un produit en ligne. */
export async function fetchOnlineCategories() {
  return await callCatalog({ action: "categories" });
}

/**
 * Recherche plein texte, paginée.
 *
 * Porte sur `name`, `sku` et `slug` — PAS sur la description, qui est du HTML :
 * chercher « strong » y trouverait la moitié du catalogue.
 *
 * L'ordre est alphabétique, sans pertinence pondérée. Le serveur n'a pas
 * d'index FULLTEXT ; une pertinence bricolée à sa place serait un classement
 * qui a l'air d'en être un, ce qui est pire que pas de classement du tout.
 *
 * Deux caractères au minimum : en deçà, le serveur rend une liste vide et
 * `total: 0`. On s'arrête donc avant l'appel, qui n'apprendrait rien.
 */
export async function searchProducts(query, { page = 1, perPage = 12 } = {}) {
  const q = (query || "").trim();
  if (q.length < 2) {
    return {
      ok: true,
      query: q,
      products: [],
      total: 0,
      page: 1,
      per_page: perPage,
    };
  }

  return await callCatalog({
    action: "search",
    q,
    page,
    per_page: perPage,
  });
}
