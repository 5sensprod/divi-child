// frontend-wp/src/components/Product/AxeProductLinks.jsx
// ═══════════════════════════════════════════════════════════════════════════
// LIENS ET VIDÉOS D'UNE FICHE PRODUIT
// ═══════════════════════════════════════════════════════════════════════════
// Arrivés le 15 septembre 2026. `catalog.php` rend `product.links` sur la
// SEULE action `product` — la fiche —, exactement comme `gallery` et pour la
// même raison : aucune grille n'affiche de liens.
//
// Chaque entrée est `{ kind: 'link' | 'video', url, label }`, DANS L'ORDRE
// voulu par le vendeur : c'est une donnée, pas un hasard de requête. On ne
// retrie rien ici.
//
// ─── L'IDENTIFIANT D'UNE VIDÉO SE DÉRIVE ICI, ET NULLE PART AILLEURS ───────
// Ni PocketApp ni le serveur ne le calculent : c'est cette page qui l'affiche,
// c'est donc elle qui l'extrait. Le stocker en ferait une troisième copie de
// la même donnée, à tenir d'accord avec l'URL dont elle sort.
//
// ─── CE QUI ARRIVE ICI A DÉJÀ ÉTÉ VALIDÉ DEUX FOIS ────────────────────────
// À la saisie (`lib/catalog/web-links.ts`) et à la lecture du serveur
// (`server/lib/web-links.php`) : https obligatoire, hôte YouTube contrôlé pour
// une vidéo. On ne refait pas ce contrôle — mais `rel="noopener noreferrer"`
// et `target="_blank"` restent posés, parce qu'une page tierce n'a aucune
// raison d'accéder à `window.opener`.
//
// ─── L'INTÉGRATION PASSE PAR `youtube-nocookie.com` ───────────────────────
// Même lecteur, sans cookie de suivi tant que le visiteur ne lance pas la
// vidéo. Le site n'a pas de bandeau de consentement, et ce n'est pas cette
// section qui doit lui en imposer un.

import React from "react";
import { ExternalLink, Play } from "lucide-react";

/**
 * L'identifiant d'une vidéo YouTube, ou null.
 *
 * Trois formes circulent, et le vendeur colle celle que son navigateur lui
 * donne : `watch?v=…`, `youtu.be/…`, et les chemins `embed`/`shorts`. On lit
 * l'URL plutôt que de la faire correspondre à une expression régulière — le
 * navigateur sait déjà découper une adresse, et une regexp sur ces trois
 * formes se serait mise à mentir au premier paramètre inattendu.
 */
export function youtubeId(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.toLowerCase().replace(/^(www|m)\./, "");
  const segments = parsed.pathname.split("/").filter(Boolean);

  // youtu.be/<id> — le chemin EST l'identifiant.
  if (host === "youtu.be") return segments[0] || null;

  if (host !== "youtube.com" && host !== "youtube-nocookie.com") return null;

  // watch?v=<id>, la forme la plus courante.
  const v = parsed.searchParams.get("v");
  if (v) return v;

  // /embed/<id> et /shorts/<id> : une URL déjà intégrée, ou un court.
  if (segments[0] === "embed" || segments[0] === "shorts")
    return segments[1] || null;

  return null;
}

/** Le domaine, sans `www.` — le repli quand le vendeur n'a pas mis de
 *  libellé. Mieux qu'une URL complète de 180 caractères dans un bouton. */
function domaine(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function LienExterne({ lien }) {
  return (
    <a
      href={lien.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
    >
      <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{lien.label || domaine(lien.url)}</span>
    </a>
  );
}

/**
 * Une vidéo intégrée.
 *
 * `loading="lazy"` : cette section est SOUS la description, donc sous la ligne
 * de flottaison sur la quasi-totalité des fiches. Charger trois lecteurs
 * YouTube à l'ouverture d'une page qu'on ne fera peut-être jamais défiler
 * coûte plus cher que tout le reste du document.
 *
 * `aspect-video` tient le cadre à 16/9 sans calcul : le conteneur ne bouge pas
 * pendant le chargement de l'iframe, et rien ne saute sous le curseur.
 */
function VideoIntegree({ lien }) {
  const id = youtubeId(lien.url);

  // Une adresse YouTube dont on ne sait pas tirer d'identifiant (une playlist,
  // une chaîne) : on rend le lien plutôt qu'un cadre vide. Le cas est refusé à
  // la saisie pour tout ce qui n'est pas YouTube, mais pas pour ça.
  if (!id) return <LienExterne lien={lien} />;

  return (
    <figure className="w-full">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-md">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}`}
          title={lien.label || "Vidéo de présentation"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full w-full border-0"
        />
      </div>
      {lien.label && (
        <figcaption className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
          <Play className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {lien.label}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * La section entière, ou RIEN.
 *
 * Aucun titre, aucun cadre, aucune place réservée quand la liste est vide :
 * la quasi-totalité du catalogue n'a pas de liens, et ce n'est pas une
 * information à donner au visiteur. Même principe que le logo de marque
 * absent — le repli est le cas normal, et il est silencieux.
 */
export default function AxeProductLinks({ links }) {
  if (!Array.isArray(links) || links.length === 0) return null;

  const videos = links.filter((lien) => lien.kind === "video");
  const pages = links.filter((lien) => lien.kind !== "video");

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        En savoir plus
      </h2>

      {videos.length > 0 && (
        <div className="mb-4 grid gap-4">
          {videos.map((lien) => (
            <VideoIntegree key={lien.url} lien={lien} />
          ))}
        </div>
      )}

      {pages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {pages.map((lien) => (
            <LienExterne key={lien.url} lien={lien} />
          ))}
        </div>
      )}
    </div>
  );
}
