// frontend-wp/src/components/Product/AxeProductImage.jsx
// ═══════════════════════════════════════════════════════════════════════════
// L'IMAGE D'UN PRODUIT DU CATALOGUE AXE — ou son absence, qui est la règle
// ═══════════════════════════════════════════════════════════════════════════
// `catalog.php` rend `product.image` : une URL COMPLÈTE, composée côté serveur
// à partir de `media_base_url` et du rang 0 de `image_paths`. Elle se consomme
// TELLE QUELLE et ne se préfixe JAMAIS ici — ce bundle est public et déjà en
// production, il n'a pas à porter le préfixe des médias.
//
// ─── L'ABSENCE EST LE CAS NORMAL, PAS LE CAS D'ERREUR ─────────────────────
// UN produit sur 2412 publiés a ses images en ligne au 20 août 2026 (mesuré à
// l'inventaire du miroir). Ils partent un par un, à la main. Le repli n'est
// donc pas un incident à signaler : c'est ce que ce site affiche presque
// partout, et il doit être calme.
//
// D'où la forme de ce composant : il rend le CONTENU d'un cadre que l'appelant
// a déjà dimensionné (`aspect-square`, `h-16 w-16`, `h-[400px]`…). Le cadre
// existe avec ou sans image, donc la mise en page ne bouge pas d'un pixel
// entre les deux cas — c'était déjà vrai avant que les images existent, et ça
// le reste.
//
// `broken` couvre le dernier cas : l'URL est là, les octets ne répondent pas
// (déploiement à moitié, rang effacé du disque). On repasse à l'icône plutôt
// que de laisser l'image cassée du navigateur. Même geste que `BrandBadge`.

import React, { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";

const AxeProductImage = ({ src, alt = "", iconClassName = "h-8 w-8" }) => {
  const [broken, setBroken] = useState(false);

  // Le composant est réutilisé d'un produit à l'autre — une grille qui pagine,
  // un carrousel qui change de vignette. Sans ce reset, une image cassée
  // condamnerait la SUIVANTE, qui n'a rien fait de mal.
  useEffect(() => {
    setBroken(false);
  }, [src]);

  if (!src || broken) {
    return <ImageOff className={`${iconClassName} text-gray-300`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setBroken(true)}
      className="h-full w-full object-contain"
    />
  );
};

export default AxeProductImage;
