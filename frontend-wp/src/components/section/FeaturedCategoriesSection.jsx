import React, { useEffect, useState } from "react";
import { ArrowRight, Music2 } from "lucide-react";
import { Link } from "react-router-dom";

import { fetchFeaturedCategories } from "../../services/axeCatalog";
import Title from "../UI/Title";

/**
 * Les catégories choisies dans PocketApp pour apparaître sur l'accueil.
 *
 * La sélection est strictement éditoriale (`is_featured`) : aucun classement
 * implicite par volume de produits ne vient décider à la place du commerçant.
 * Si aucune catégorie n'est mise en avant, la section se masque entièrement.
 */
const FeaturedCategoriesSection = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const payload = await fetchFeaturedCategories();
        if (cancelled) return;

        setCategories(
          (payload.categories || []).filter(
            (category) => category.is_featured && category.slug,
          ),
        );
      } catch (error) {
        console.error("Erreur catégories mises en avant:", error);
        if (!cancelled) setCategories([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Cet enrichissement de l'accueil n'est pas bloquant : pas de grand squelette
  // ni de message d'erreur si le catalogue public est momentanément absent.
  if (categories === null || categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-cyan-50 py-12 md:py-16">
      <div className="container-divi relative z-10">
        <div className="mx-auto mb-9 max-w-3xl text-center">
          <Title
            tag="h2"
            className="mb-3"
            animationType="equalizer"
            gradient="oceanNight"
          >
            Nos univers en vedette
          </Title>
          <p className="text-base text-slate-600 md:text-lg">
            Entrez directement dans les rayons sélectionnés par l'équipe.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categorie-produit/${encodeURIComponent(category.slug)}`}
              className="group relative min-h-64 overflow-hidden rounded-2xl bg-slate-900 shadow-lg ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cyan-400/60"
            >
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-800 via-slate-900 to-cyan-900">
                  <Music2
                    className="h-20 w-20 text-white/20 transition duration-300 group-hover:scale-110 group-hover:text-white/30"
                    aria-hidden="true"
                  />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <h3 className="text-xl font-bold leading-tight md:text-2xl">
                  {category.name}
                </h3>
                <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-cyan-100">
                  Découvrir le rayon
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategoriesSection;
