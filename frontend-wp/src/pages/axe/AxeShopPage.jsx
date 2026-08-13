// frontend-wp/src/pages/axe/AxeShopPage.jsx
// ═══════════════════════════════════════════════════════════════════════════
// BOUTIQUE — l'entrée dans notre catalogue, par les catégories
// ═══════════════════════════════════════════════════════════════════════════
// Sert `/shop` quand `VITE_USE_AXE_CATALOG=true`. Elle ne remplace pas
// `ShopPage.jsx` : elle COMBLE UN TROU. Sous le drapeau, `/shop` n'était routée
// nulle part (`App.jsx`, branche `useReactCategories`) et tombait sur la page
// 404, alors que le menu la propose.
//
// Elle liste des CATÉGORIES, pas des produits, et c'est délibéré : notre API
// ne sait pas rendre « tous les produits » — `action=category` veut une
// catégorie, `action=search` veut deux caractères. Une boutique qui affiche
// « les 20 premiers produits » d'un catalogue de 2500 n'affiche de toute façon
// rien de choisi ; les catégories, elles, mènent quelque part.
//
// ─── PAS DE DÉCOMPTE À CÔTÉ DES NOMS, ET C'EST UNE PRÉCAUTION ─────────────
// `action=categories` rend un `product_count` qui compte les produits attachés
// EN PROPRE à la catégorie. La page catégorie, elle, affiche le total de TOUTE
// LA BRANCHE (§6 bis du contrat). Les deux nombres sont justes et différents ;
// les afficher l'un après l'autre ferait passer notre catalogue pour incohérent
// aux yeux du visiteur. On garde donc l'ORDRE que ce décompte induit — les
// mieux fournies d'abord — sans en imprimer la valeur.
//
// Pas d'images : elles ne sont pas encore exportées (§7 du contrat d'export).

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";

import { fetchOnlineCategories } from "../../services/axeCatalog";
import Background from "../../components/UI/Background";
import Breadcrumb from "../../components/UI/Breadcrumb";
import Title from "../../components/UI/Title";

/**
 * Ajoute le nom du parent aux catégories HOMONYMES, à elles seules.
 *
 * Le catalogue en porte plusieurs — « Accessoires vents » apparaît deux fois,
 * sous deux parents différents. Côte à côte dans une grille, elles donnent deux
 * liens visuellement identiques qui ne mènent pas au même endroit : le visiteur
 * qui revient en arrière et reclique tombe ailleurs sans comprendre.
 *
 * Le suffixe n'est posé QUE sur les doublons : l'ajouter partout alourdirait
 * 198 libellés pour régler le cas d'une poignée.
 *
 * Deux d'entre eux partagent en plus LE MÊME PARENT — « Accessoires vents »
 * deux fois sous « Accessoires instru ». Rien dans la donnée ne les distingue
 * sinon le slug : c'est donc le slug qui est affiché, faute de quoi le visiteur
 * verrait deux tuiles rigoureusement identiques. On montre ce qui diffère
 * réellement plutôt que d'inventer une différence lisible.
 */
function disambiguate(categories) {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const seen = new Map();
  categories.forEach((category) => {
    seen.set(category.name, (seen.get(category.name) || 0) + 1);
  });

  const labelled = categories.map((category) => {
    if (seen.get(category.name) < 2) return category;
    const parent = category.parent ? byId.get(category.parent) : null;
    return parent ? { ...category, hint: `dans ${parent.name}` } : category;
  });

  // Second passage : les homonymes dont le suffixe est LUI AUSSI identique.
  const hints = new Map();
  labelled.forEach((category) => {
    if (!category.hint) return;
    const key = `${category.name}|${category.hint}`;
    hints.set(key, (hints.get(key) || 0) + 1);
  });

  return labelled.map((category) => {
    if (!category.hint) return category;
    const key = `${category.name}|${category.hint}`;
    return hints.get(key) < 2 ? category : { ...category, hint: category.slug };
  });
}

const AxeShopPage = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    categories: [],
  });

  useEffect(() => {
    let cancelled = false;

    fetchOnlineCategories()
      .then((data) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            categories: disambiguate(data.categories || []),
          });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ loading: false, error: error.message, categories: [] });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const { loading, error, categories } = state;

  const breadcrumbItems = [
    { label: "Accueil", path: "/" },
    { label: "Boutique" },
  ];

  return (
    <div>
      {/* Même bandeau que la page catégorie : la boutique en est l'amont, pas
          un écran d'une autre famille. */}
      <section className="relative overflow-hidden page-content pt-32 pb-6 md:pt-36 md:pb-6">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-10">
          <div className="mb-4 flex justify-end">
            <Breadcrumb items={breadcrumbItems} />
          </div>

          <div className="text-center">
            <Title
              tag="h1"
              className="mb-2 text-white drop-shadow-lg"
              animationType="none"
              gradient="ocean"
              mode="oceanNight"
              bold="true"
            >
              La boutique
            </Title>
            <p className="text-base text-white/80">
              {loading
                ? "Chargement des rayons..."
                : `${categories.length} rayon${categories.length > 1 ? "s" : ""} à parcourir`}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container-divi">
          {error ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Catalogue indisponible</p>
              <p>{error}</p>
            </div>
          ) : loading ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="h-20 animate-pulse rounded-lg bg-white shadow-sm"
                />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              Aucune catégorie en ligne pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categorie-produit/${category.slug}`}
                  className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <FolderOpen className="h-5 w-5 flex-shrink-0 text-pink-500" />
                  <span className="text-sm font-medium leading-tight text-gray-800">
                    {category.name}
                    {category.hint && (
                      <span className="block text-xs font-normal text-gray-400">
                        {category.hint}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AxeShopPage;
