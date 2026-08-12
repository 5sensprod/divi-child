// src/services/published-menu.js
// ═══════════════════════════════════════════════════════════════════════════
// MENU PUBLIÉ PAR POCKETAPP  (ticket 8)
// ═══════════════════════════════════════════════════════════════════════════
// Lit le fichier statique publié par PocketApp et le rend dans la forme que le
// site consomme déjà — `{name, items[]}`, chaque entrée en `{id, title, url,
// parent}`. C'est le SEUL endroit qui connaît le format publié.
//
// Le contrat fait autorité sur ce format. Il vit dans l'autre dépôt :
// PocketApp, `frontend/modules/site/PocketSite-docs/05-contrat-menu.md`.
// Toute divergence entre ce fichier et lui est un bogue de ce fichier.
//
// Aucun composant de navigation n'est modifié par ce ticket : l'adaptation se
// fait ici, une fois. C'est délibéré — le site reste bête, l'intelligence est
// du côté qui se redéploie facilement (§4.4 de l'audit).
// ═══════════════════════════════════════════════════════════════════════════

import { API_CONFIG } from "../utils/constants";

/**
 * Versions de format que ce site sait lire.
 *
 * Un document dont `contractVersion` est inconnue est REFUSÉ, jamais
 * interprété au mieux (§5 du contrat) : c'est la raison d'être du champ.
 * Refuser signifie ici retomber sur le repli, pas casser la navigation.
 */
const SUPPORTED_CONTRACT_VERSIONS = [1];

/**
 * WordPress marque la racine par la chaîne `"0"` ; le document publié par
 * `null`, les identifiants PocketBase étant des chaînes.
 *
 * Ce n'est pas cosmétique : `useNavigation.js:109-111` cherche la racine par
 * `item.parent === parentId.toString()` avec `parentId = "0"`. Publier `null`
 * tel quel donnerait un menu VIDE, sans erreur — aucune entrée ne matcherait la
 * racine. La conversion se fait donc ici, pas dans la navigation.
 */
const ROOT_PARENT = "0";

/**
 * Adapte le document publié à la forme attendue par le site.
 *
 * Les champs inconnus sont ignorés sans erreur, comme l'exige §5 du contrat —
 * `ref` en fait partie : il est publié pour le diagnostic et le site n'en fait
 * rien. Seule `url` compte pour naviguer.
 */
function adaptPublishedMenu(document) {
  const items = document.menu.items.map((item) => ({
    id: String(item.id),
    title: item.title,
    url: item.url,
    parent: item.parent === null || item.parent === undefined
      ? ROOT_PARENT
      : String(item.parent),
  }));

  return { name: document.menu.name, items };
}

/** Vérifie l'enveloppe avant d'y toucher. Rend un message, ou `null` si tout va
 *  bien — le message part dans l'erreur, c'est lui qui sera lisible en console
 *  le jour où le format bougera. */
function describeProblem(document) {
  if (!document || typeof document !== "object") {
    return "réponse vide ou illisible";
  }
  if (!SUPPORTED_CONTRACT_VERSIONS.includes(document.contractVersion)) {
    return `contractVersion ${document.contractVersion} non prise en charge (connues : ${SUPPORTED_CONTRACT_VERSIONS.join(", ")})`;
  }
  if (!document.menu || !Array.isArray(document.menu.items)) {
    return "menu.items absent ou n'est pas un tableau";
  }
  return null;
}

/**
 * Charge le menu publié. Lève en cas de problème — l'appelant décide du repli.
 *
 * `cache: "no-store"` n'est pas une précaution de principe. Le fichier est servi
 * par Apache avec `etag` et `last-modified` mais **sans `Cache-Control`** : le
 * navigateur applique alors son heuristique et peut resservir une version
 * précédente après une publication. Symptôme observé le 10 août 2026 — fichier
 * à jour sur le serveur, ancien contenu à l'écran.
 */
export async function loadPublishedMenu() {
  const response = await fetch(API_CONFIG.publishedMenuUrl, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Menu publié inaccessible (HTTP ${response.status}) : ${API_CONFIG.publishedMenuUrl}`,
    );
  }

  const document = await response.json();

  const problem = describeProblem(document);
  if (problem) {
    throw new Error(`Menu publié refusé — ${problem}`);
  }

  return adaptPublishedMenu(document);
}
