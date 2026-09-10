// src/services/menu.js
// ═══════════════════════════════════════════════════════════════════════════
// MENU DE NAVIGATION — le fichier publié par PocketApp, et rien d'autre
// ═══════════════════════════════════════════════════════════════════════════
// Source unique depuis le 10 septembre 2026 : `/data/menu.json`, écrit par
// PocketApp (`publish-menu.php`). WordPress et WooCommerce sont retirés du
// site ; il n'y a plus de source de repli à choisir, donc plus de drapeau.
//
// Le cache local ne dure que 5 minutes (`CACHE_DURATIONS.MENU_PUBLISHED`) :
// avec 24 h, une publication restait invisible une journée pour tout visiteur
// déjà venu.
//
// En cas d'échec — fichier absent, JSON invalide, `contractVersion` inconnue —
// on rend le menu de secours plutôt que de casser la navigation, et on le DIT
// dans la console : sans ce message, un menu de secours ressemble à un menu mal
// configuré. C'est ce message qui a permis de voir, le 10 septembre 2026, que
// le site lisait un fichier supprimé.
// ═══════════════════════════════════════════════════════════════════════════

import { CACHE_DURATIONS, CACHE_KEYS, cacheUtils } from "../utils/cache";
import { DEFAULT_MENU } from "../utils/constants";
import { loadPublishedMenu } from "./published-menu";

const cacheEnabled = import.meta.env.VITE_DISABLE_CACHE !== "true";

/** Le menu en cache s'il a moins de 5 minutes, sinon `null`. Synchrone : sert
 *  au premier rendu, pour que la navigation n'attende pas le réseau. */
export const getCachedMenu = () =>
  cacheEnabled
    ? cacheUtils.getWithTTL(
        CACHE_KEYS.MENU_PUBLISHED,
        CACHE_DURATIONS.MENU_PUBLISHED,
      )
    : null;

/** Le menu publié — depuis le cache récent, sinon depuis le serveur. Ne lève
 *  jamais : rend le menu de secours en cas d'échec. */
export async function loadMenu() {
  try {
    const cached = getCachedMenu();
    if (cached) return cached;

    const menu = await loadPublishedMenu();
    if (cacheEnabled) cacheUtils.set(CACHE_KEYS.MENU_PUBLISHED, menu);
    return menu;
  } catch (error) {
    console.warn(
      "Menu publié non récupéré, repli sur le menu par défaut :",
      error.message,
    );
    return DEFAULT_MENU;
  }
}
