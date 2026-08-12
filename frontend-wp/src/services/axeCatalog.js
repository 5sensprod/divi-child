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
      `Réponse inattendue du catalogue (${response.status}) : ${raw.slice(0, 120)}`
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
export async function fetchCategoryWithProducts({
  slug,
  id,
  limit = 8,
} = {}) {
  return await callCatalog({ action: "category", slug, id, limit });
}

/** Les catégories qui portent au moins un produit en ligne. */
export async function fetchOnlineCategories() {
  return await callCatalog({ action: "categories" });
}
