// frontend-wp/src/pages/axe/AxeShopPage.jsx

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Cable,
  ChevronRight,
  Drum,
  Guitar,
  Headphones,
  KeyboardMusic,
  Music2,
  Speaker,
  Wind,
} from "lucide-react";

import {
  fetchCategoryWithProducts,
  fetchOnlineCategories,
} from "../../services/axeCatalog";
import Background from "../../components/UI/Background";
import Breadcrumb from "../../components/UI/Breadcrumb";
import Title from "../../components/UI/Title";
import AxeProductImage from "../../components/Product/AxeProductImage";
import { AxeProductCard } from "./AxeCategoryPage";

const MAX_VISIBLE_SUBCATEGORIES = 5;

/**
 * Ordre éditorial de la boutique.
 *
 * Il est volontairement indépendant du nombre de produits : « Partitions »
 * ne doit pas passer devant les guitares simplement parce qu'elle contient
 * beaucoup de références. L'ordre exprime les grands univers d'un magasin de
 * musique ; les données du catalogue remplissent ensuite chaque univers.
 */
const FEATURED_UNIVERSES = [
  {
    key: "guitares",
    title: "Guitares & basses",
    description: "Électriques, acoustiques, basses, amplis et effets.",
    rootSlug: "guitares-basses",
    coverSlug: "guitares-basses-guitares-electriques",
    wide: true,
    icon: Guitar,
    accent: "from-fuchsia-500 to-pink-500",
    iconColor: "text-fuchsia-600",
    iconBackground: "bg-fuchsia-50",
  },
  {
    key: "pianos",
    title: "Pianos & claviers",
    description: "Pianos acoustiques et numériques, claviers et synthétiseurs.",
    rootSlug: "pianos-claviers",
    coverSlug: "piano-numerique",
    wide: true,
    fallbackSlugs: [
      "piano-numerique",
      "piano-acoustique",
      "claviers-synthetiseurs",
      "clavier-maitre",
      "clavier-arrangeur",
      "accessoires-clavier",
    ],
    icon: KeyboardMusic,
    accent: "from-violet-500 to-indigo-500",
    iconColor: "text-violet-600",
    iconBackground: "bg-violet-50",
  },
  {
    key: "batterie",
    title: "Batterie & percussion",
    description: "Batteries, cymbales, peaux et petites percussions.",
    rootSlug: "batterie-percussion",
    coverSlug: "batterie-percussion",
    icon: Drum,
    accent: "from-orange-500 to-amber-400",
    iconColor: "text-orange-600",
    iconBackground: "bg-orange-50",
  },
  {
    key: "studio",
    title: "Home studio",
    description: "Interfaces, micros, monitoring, casques et traitement acoustique.",
    rootSlug: "home-studio",
    coverSlug: "micros",
    icon: Headphones,
    accent: "from-sky-500 to-cyan-400",
    iconColor: "text-sky-600",
    iconBackground: "bg-sky-50",
  },
  {
    key: "sono",
    title: "Sonorisation",
    description: "Enceintes, microphones, mixage et systèmes de diffusion.",
    rootSlug: "sonorisation-2",
    coverSlug: "sonorisation-2",
    icon: Speaker,
    accent: "from-blue-500 to-sky-400",
    iconColor: "text-blue-600",
    iconBackground: "bg-blue-50",
  },
  {
    key: "vents",
    title: "Instruments à vent",
    description: "Cuivres, harmonicas et accessoires pour instruments à vent.",
    rootSlug: "instruments-a-vent",
    coverSlug: "harmonica",
    extraSlugs: ["harmonica"],
    icon: Wind,
    accent: "from-emerald-500 to-teal-400",
    iconColor: "text-emerald-600",
    iconBackground: "bg-emerald-50",
  },
  {
    key: "partitions",
    title: "Méthodes & partitions",
    description: "Partitions, recueils et méthodes pour apprendre et progresser.",
    rootSlug: "partitions",
    coverSlug: "partitions",
    icon: BookOpen,
    accent: "from-rose-500 to-orange-400",
    iconColor: "text-rose-600",
    iconBackground: "bg-rose-50",
  },
  {
    key: "accessoires",
    title: "Accessoires",
    description: "Les indispensables pour jouer, protéger, brancher et entretenir.",
    categorySlugs: [
      "accessoire-guitares",
      "accessoires-percussion",
      "accessoires-sono-2",
      "accessoires-clavier",
      "accessoires-vents-2",
      "cables",
      "housses",
      "produits-entretien",
    ],
    coverSlug: "accessoire-guitares",
    icon: Cable,
    accent: "from-slate-600 to-gray-400",
    iconColor: "text-slate-600",
    iconBackground: "bg-slate-100",
  },
];

const cleanName = (name = "") => {
  const cleaned = name.replace(/^\*\s*/, "").trim();
  if (!cleaned) return "";

  const lowerCaseName = cleaned.toLocaleLowerCase("fr-FR");
  return `${lowerCaseName[0].toLocaleUpperCase("fr-FR")}${lowerCaseName.slice(1)}`;
};
const categoryUrl = (category) => `/categorie-produit/${category.slug}`;
const activity = (category) => Number(category?.product_count || 0);

function uniqueCategories(categories) {
  const seen = new Set();
  return categories.filter((category) => {
    if (!category || seen.has(category.id)) return false;
    seen.add(category.id);
    return true;
  });
}

function prepareShop(categories) {
  const visible = categories.filter((category) => category.slug);
  const byId = new Map(visible.map((category) => [category.id, category]));
  const bySlug = new Map(visible.map((category) => [category.slug, category]));
  const childrenByParent = new Map();

  visible.forEach((category) => {
    if (!category.parent) return;
    const siblings = childrenByParent.get(category.parent) || [];
    siblings.push(category);
    childrenByParent.set(category.parent, siblings);
  });

  childrenByParent.forEach((children) => {
    children.sort((left, right) => activity(right) - activity(left));
  });

  const featured = FEATURED_UNIVERSES.map((definition) => {
    const root = definition.rootSlug
      ? bySlug.get(definition.rootSlug)
      : null;
    let children = root ? [...(childrenByParent.get(root.id) || [])] : [];

    if (children.length === 0 && definition.fallbackSlugs) {
      children = definition.fallbackSlugs.map((slug) => bySlug.get(slug));
    }

    if (definition.categorySlugs) {
      children = definition.categorySlugs.map((slug) => bySlug.get(slug));
    }

    if (definition.extraSlugs) {
      children.push(...definition.extraSlugs.map((slug) => bySlug.get(slug)));
    }

    return {
      ...definition,
      root,
      children: uniqueCategories(children.filter(Boolean)).slice(0, 8),
    };
  }).filter((universe) => universe.root || universe.children.length > 0);

  const featuredIds = new Set();
  featured.forEach((universe) => {
    if (universe.root) featuredIds.add(universe.root.id);
    universe.children.forEach((category) => featuredIds.add(category.id));
  });

  // Un parent absent de la réponse signifie que la catégorie est orpheline
  // dans le jeu « catégories en ligne » : elle reste accessible dans les
  // autres rayons plutôt que de disparaître silencieusement.
  const otherRoots = visible
    .filter(
      (category) =>
        (!category.parent || !byId.has(category.parent)) &&
        !featuredIds.has(category.id) &&
        !category.name.trim().startsWith("*") &&
        !category.name.toLowerCase().startsWith("01-"),
    )
    .map((root) => ({
      root,
      children: (childrenByParent.get(root.id) || []).slice(0, 5),
    }))
    .sort((left, right) => {
      const leftScore =
        activity(left.root) +
        left.children.reduce((sum, child) => sum + activity(child), 0);
      const rightScore =
        activity(right.root) +
        right.children.reduce((sum, child) => sum + activity(child), 0);
      return rightScore - leftScore;
    });

  return { featured, otherRoots, visibleCount: visible.length };
}

const ShopSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className={`h-80 animate-pulse rounded-2xl border border-black/5 bg-white shadow-sm ${
          index < 2 ? "xl:col-span-6" : "xl:col-span-4"
        }`}
      />
    ))}
  </div>
);

const UniverseCard = ({ universe, products, productsLoading }) => {
  const Icon = universe.icon || Music2;
  const visualProducts = products.filter((product) => product.image).slice(0, 3);
  const visibleChildren = universe.children.slice(
    0,
    MAX_VISIBLE_SUBCATEGORIES,
  );
  const hiddenChildrenCount = Math.max(
    0,
    universe.children.length - visibleChildren.length,
  );
  const coverContent = (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${universe.iconBackground} ${
        universe.wide ? "h-48" : "h-44"
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${universe.accent} opacity-[0.08]`}
      />

      {productsLoading ? (
        <div className="absolute inset-5 animate-pulse rounded-2xl bg-white/60" />
      ) : visualProducts.length > 0 ? (
        <div
          className={`absolute inset-3 grid gap-2 ${
            visualProducts.length === 1
              ? "grid-cols-1"
              : visualProducts.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {visualProducts.map((product) => (
            <Link
              key={product.id}
              to={`/produit/${product.slug || product.id}`}
              aria-label={product.title}
              className="relative overflow-hidden rounded-xl border border-white/80 bg-white p-2 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <AxeProductImage src={product.image} alt={product.title} />
            </Link>
          ))}
        </div>
      ) : (
        <Icon
          className={`absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 opacity-30 ${universe.iconColor}`}
        />
      )}

      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
    </div>
  );

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        universe.wide ? "xl:col-span-6" : "xl:col-span-4"
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${universe.accent}`}
      />

      {coverContent}

      <div className="flex flex-1 flex-col p-5 pt-3">
        <div className="min-w-0">
          {universe.root ? (
            <Link
              to={categoryUrl(universe.root)}
              className="flex items-center justify-between gap-2 text-lg font-semibold text-gray-950 transition-colors hover:text-pink-600"
            >
              <span>{universe.title}</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          ) : (
            <h2 className="text-lg font-semibold text-gray-950">
              {universe.title}
            </h2>
          )}
          <p className="mt-1 text-sm leading-5 text-gray-500">
            {universe.description}
          </p>
        </div>

        {universe.children.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleChildren.map((category) => (
              <Link
                key={category.id}
                to={categoryUrl(category)}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700"
              >
                {cleanName(category.name)}
              </Link>
            ))}
            {hiddenChildrenCount > 0 && universe.root && (
              <Link
                to={categoryUrl(universe.root)}
                className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-700 transition-colors hover:border-pink-400 hover:bg-pink-100"
              >
                +{hiddenChildrenCount} catégories
              </Link>
            )}
            {hiddenChildrenCount > 0 && !universe.root && (
              <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-500">
                +{hiddenChildrenCount} rayons
              </span>
            )}
          </div>
        ) : universe.root ? (
          <Link
            to={categoryUrl(universe.root)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-pink-600"
          >
            Explorer le rayon <ChevronRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </article>
  );
};

const SecondaryDepartment = ({ department, product, productLoading }) => {
  const productUrl = product
    ? `/produit/${product.slug || product.id}`
    : categoryUrl(department.root);

  return (
    <article className="self-start overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex min-h-24">
        <Link
          to={productUrl}
          aria-label={product?.title || cleanName(department.root.name)}
          className="flex w-24 shrink-0 items-center justify-center border-r border-gray-100 bg-gray-50 p-2"
        >
          {productLoading ? (
            <span className="h-full w-full animate-pulse rounded-lg bg-gray-200" />
          ) : product?.image ? (
            <AxeProductImage src={product.image} alt={product.title} />
          ) : (
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg font-bold text-gray-300 shadow-sm">
              {cleanName(department.root.name).charAt(0)}
            </span>
          )}
        </Link>

        <div className="min-w-0 flex-1 p-4">
          <Link
            to={categoryUrl(department.root)}
            className="flex items-center justify-between gap-3 font-semibold text-gray-900 transition-colors hover:text-pink-600"
          >
            <span>{cleanName(department.root.name)}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
          </Link>

          {department.children.length > 0 && (
            <div className="mt-3 border-t border-gray-100 pt-3">
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {department.children.map((category) => (
                  <Link
                    key={category.id}
                    to={categoryUrl(category)}
                    className="text-xs text-gray-500 transition-colors hover:text-pink-600"
                  >
                    {cleanName(category.name)}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

const BrandStrip = ({ brands }) => {
  if (brands.length === 0) return null;

  return (
    <section className="mt-12 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
          Les signatures du catalogue
        </p>
        <h2 className="mt-1 text-xl font-bold text-gray-950">
          Marques à découvrir
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex h-16 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 px-4 text-center text-sm font-semibold text-gray-700 transition-colors hover:border-pink-200 hover:bg-pink-50"
          >
            {brand.image ? (
              <img
                src={brand.image}
                alt={brand.name}
                className="max-h-9 max-w-full object-contain"
                loading="lazy"
              />
            ) : (
              brand.name
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const AxeShopPage = () => {
  const [state, setState] = useState({
    loading: true,
    error: null,
    categories: [],
  });
  const [universeProducts, setUniverseProducts] = useState({});
  const [secondaryProducts, setSecondaryProducts] = useState({});

  useEffect(() => {
    let cancelled = false;

    fetchOnlineCategories()
      .then((data) => {
        if (!cancelled) {
          setState({
            loading: false,
            error: null,
            categories: data.categories || [],
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

  const shop = useMemo(
    () => prepareShop(state.categories),
    [state.categories],
  );

  useEffect(() => {
    if (state.loading || shop.featured.length === 0) return;

    let cancelled = false;
    setUniverseProducts({});

    shop.featured.forEach((universe) => {
      const slug =
        universe.coverSlug ||
        universe.root?.slug ||
        universe.children[0]?.slug;

      if (!slug) {
        setUniverseProducts((previous) => ({
          ...previous,
          [universe.key]: [],
        }));
        return;
      }

      fetchCategoryWithProducts({ slug, limit: 12 })
        .then((data) => {
          if (cancelled) return;
          setUniverseProducts((previous) => ({
            ...previous,
            [universe.key]: data.products || [],
          }));
        })
        .catch(() => {
          if (!cancelled) {
            setUniverseProducts((previous) => ({
              ...previous,
              [universe.key]: [],
            }));
          }
        });
    });

    return () => {
      cancelled = true;
    };
  }, [shop.featured, state.loading]);

  useEffect(() => {
    if (state.loading || shop.otherRoots.length === 0) return;

    let cancelled = false;
    setSecondaryProducts({});

    shop.otherRoots.forEach((department) => {
      fetchCategoryWithProducts({ slug: department.root.slug, limit: 8 })
        .then((data) => {
          if (cancelled) return;
          const product = (data.products || []).find((item) => item.image);
          setSecondaryProducts((previous) => ({
            ...previous,
            [department.root.id]: product || null,
          }));
        })
        .catch(() => {
          if (cancelled) return;
          setSecondaryProducts((previous) => ({
            ...previous,
            [department.root.id]: null,
          }));
        });
    });

    return () => {
      cancelled = true;
    };
  }, [shop.otherRoots, state.loading]);

  const showcaseProducts = useMemo(() => {
    const seen = new Set();
    const selection = [];
    const productPools = shop.featured.map(
      (universe) => universeProducts[universe.key] || [],
    );
    const longestPool = Math.max(0, ...productPools.map((pool) => pool.length));

    // On prend d'abord un produit par univers, puis un deuxième si nécessaire :
    // la sélection ne doit pas être monopolisée par la première catégorie chargée.
    for (let index = 0; index < longestPool && selection.length < 8; index += 1) {
      productPools.forEach((pool) => {
        if (selection.length >= 8) return;
        const product = pool[index];
        if (!product) return;
        const key = product.id || product.slug;
        if (!key || seen.has(key)) return;
        seen.add(key);
        selection.push(product);
      });
    }

    return selection;
  }, [shop.featured, universeProducts]);

  const showcaseBrands = useMemo(() => {
    const occurrences = new Map();

    Object.values(universeProducts)
      .flat()
      .forEach((product) => {
        const brand = product.brand;
        if (!brand?.name) return;
        const current = occurrences.get(brand.name) || {
          ...brand,
          count: 0,
        };
        current.count += 1;
        occurrences.set(brand.name, current);
      });

    return [...occurrences.values()]
      .sort((left, right) => right.count - left.count)
      .slice(0, 12);
  }, [universeProducts]);

  const breadcrumbItems = [
    { label: "Accueil", path: "/" },
    { label: "Boutique" },
  ];

  return (
    <div>
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
              {state.loading
                ? "Organisation des rayons..."
                : `${shop.featured.length} univers principaux · ${shop.visibleCount} catégories`}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-10">
        <div className="container-divi">
          {state.error ? (
            <div className="rounded-xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
              <p className="font-semibold">Catalogue indisponible</p>
              <p>{state.error}</p>
            </div>
          ) : state.loading ? (
            <ShopSkeleton />
          ) : shop.featured.length === 0 ? (
            <p className="py-12 text-center text-gray-500">
              Aucun rayon disponible pour le moment.
            </p>
          ) : (
            <>
              <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
                  Commencer ici
                </p>
                <h2 className="mt-1 text-2xl font-bold text-gray-950">
                  Les grands univers du magasin
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Retrouvez directement les familles les plus recherchées et
                  leurs principaux sous-rayons.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
                {shop.featured.map((universe) => (
                  <UniverseCard
                    key={universe.key}
                    universe={universe}
                    products={universeProducts[universe.key] || []}
                    productsLoading={
                      !Object.hasOwn(universeProducts, universe.key)
                    }
                  />
                ))}
              </div>

              <BrandStrip brands={showcaseBrands} />

              {showcaseProducts.length > 0 && (
                <section className="mt-12">
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-600">
                        Une boutique qui se découvre
                      </p>
                      <h2 className="mt-1 text-2xl font-bold text-gray-950">
                        Notre sélection du moment
                      </h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Un aperçu des produits disponibles dans les grands
                        univers du magasin.
                      </p>
                    </div>
                    <Music2 className="hidden h-7 w-7 text-gray-300 sm:block" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {showcaseProducts.map((product) => (
                      <AxeProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </section>
              )}

              {shop.otherRoots.length > 0 && (
                <div className="mt-12 border-t border-gray-200 pt-9">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Pour aller plus loin
                    </p>
                    <h2 className="mt-1 text-xl font-bold text-gray-900">
                      Autres rayons
                    </h2>
                  </div>

                  <div className="grid items-start gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {shop.otherRoots.map((department) => (
                      <SecondaryDepartment
                        key={department.root.id}
                        department={department}
                        product={secondaryProducts[department.root.id]}
                        productLoading={
                          !Object.hasOwn(
                            secondaryProducts,
                            department.root.id,
                          )
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AxeShopPage;
