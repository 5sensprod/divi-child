// src/components/UI/LoadingSkeleton.jsx

// Skeleton par défaut pour les cartes produits
const LoadingSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Skeleton pour les items de menu desktop
export const MenuSkeleton = () => (
  <>
    <div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>
    <div className="h-5 w-16 bg-gray-700 rounded animate-pulse"></div>
    <div className="h-5 w-24 bg-gray-700 rounded animate-pulse"></div>
    <div className="h-5 w-18 bg-gray-700 rounded animate-pulse"></div>
  </>
);

// Skeleton pour le menu mobile
export const MobileMenuSkeleton = () => (
  <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-white/10">
    <div className="container mx-auto px-4 py-6 space-y-3">
      <div className="h-6 w-32 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 w-28 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 w-36 bg-gray-700 rounded animate-pulse"></div>
      <div className="h-6 w-24 bg-gray-700 rounded animate-pulse"></div>
    </div>
  </div>
);

// Skeleton pour la liste de produits
export const ProductListSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <LoadingSkeleton key={index} />
    ))}
  </div>
);

// Skeleton pour les détails d'un produit
export const ProductDetailSkeleton = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>

      {/* Détails skeleton */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

// Skeleton pour les catégories
export const CategorySkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="text-center animate-pulse">
        <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
      </div>
    ))}
  </div>
);

// Skeleton pour le footer
export const FooterSkeleton = () => (
  <div className="bg-gray-900 text-white py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Variante "glass" pour fonds sombres/colorés (slide soldes)
export const GlassSkeleton = () => {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse
                    bg-white/10 backdrop-blur-md border border-white/20 shadow-lg"
    >
      <div className="h-52 bg-white/15"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/20 rounded"></div>
        <div className="h-4 bg-white/20 rounded w-2/3"></div>
        <div className="h-10 bg-white/15 rounded-xl"></div>
      </div>
    </div>
  );
};

// Skeleton glass pour le fil d'Ariane
export const BreadcrumbGlassSkeleton = ({ className = "" }) => (
  <nav
    aria-hidden="true"
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 animate-pulse
                bg-white/10 backdrop-blur-md border border-white/20 shadow-lg ${className}`}
  >
    <div className="h-3 w-14 rounded-full bg-white/25" />
    <div className="h-3 w-2 rounded-full bg-white/20" />
    <div className="h-3 w-20 rounded-full bg-white/25" />
    <div className="h-3 w-2 rounded-full bg-white/20" />
    <div className="h-3 w-28 rounded-full bg-white/30" />
  </nav>
);


const SkeletonLine = ({ className = "", dark = false }) => (
  <div className={`rounded-full ${dark ? "bg-white/20" : "bg-gray-200"} ${className}`} />
);

export const StockBadgeSkeleton = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "h-5 w-20",
    md: "h-7 w-24",
    lg: "h-10 w-32",
  };

  return (
    <div
      aria-hidden="true"
      className={`inline-flex items-center rounded-full animate-pulse bg-gray-100 ${sizes[size] || sizes.md} ${className}`}
    >
      <div className="ml-3 h-2 w-2 rounded-full bg-gray-300" />
      <div className="ml-2 h-3 w-14 rounded-full bg-gray-300" />
    </div>
  );
};

// `top-[108px]` suit la galerie qu'il remplace (`ProductPage.jsx`) : un
// squelette qui se colle ailleurs que le contenu ferait sauter la page au
// moment où les données arrivent.
export const ProductGallerySkeleton = ({ thumbnailCount = 6 }) => (
  <div
    aria-hidden="true"
    className="lg:sticky lg:top-[108px] flex flex-col gap-4 animate-pulse"
  >
    <div className="relative h-[400px] rounded-lg bg-white shadow-lg overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" />
      <div className="absolute inset-12 rounded-full bg-gray-200/70" />
      <div className="absolute bottom-3 right-3 h-7 w-24 rounded-full bg-gray-300/80" />
    </div>

    <div className="grid grid-cols-4 gap-2">
      {Array.from({ length: thumbnailCount }).map((_, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden"
        >
          <div className="h-full w-full bg-gray-200" />
        </div>
      ))}
    </div>
  </div>
);

export const ProductInformationSkeleton = () => (
  <div aria-hidden="true" className="bg-white rounded-lg p-6 shadow-md animate-pulse">
    <div className="mb-4 pb-4 border-b border-gray-200">
      <SkeletonLine className="h-7 w-3/4" />
    </div>

    <div className="flex items-start justify-between mb-5 gap-4">
      <div className="flex items-baseline gap-3 flex-wrap">
        <SkeletonLine className="h-9 w-28" />
        <SkeletonLine className="h-5 w-16" />
      </div>
      <div className="h-10 w-10 rounded-full bg-gray-100" />
    </div>

    <div className="mb-5 space-y-2">
      <SkeletonLine className="h-4 w-16" />
      <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2">
        <div className="h-5 w-8 rounded bg-blue-100" />
        <SkeletonLine className="h-4 w-12" />
      </div>
    </div>

    <div className="mb-5 space-y-2">
      <SkeletonLine className="h-4 w-20" />
      <div className="flex flex-wrap gap-2">
        <SkeletonLine className="h-8 w-36" />
        <SkeletonLine className="h-8 w-24" />
      </div>
    </div>

    <StockBadgeSkeleton />
  </div>
);

export const ProductDescriptionSkeleton = ({ lines = 3 }) => (
  <div aria-hidden="true" className="bg-white rounded-lg p-6 shadow-md animate-pulse">
    <SkeletonLine className="h-5 w-28 mb-4" />
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine
          key={index}
          className={`h-4 ${index === lines - 1 ? "w-3/5" : "w-full"}`}
        />
      ))}
    </div>
  </div>
);

export const ProductTagsSkeleton = () => (
  <div aria-hidden="true" className="bg-white rounded-lg p-6 shadow-md animate-pulse">
    <SkeletonLine className="h-4 w-14 mb-3" />
    <div className="flex flex-wrap gap-2">
      <SkeletonLine className="h-7 w-20" />
      <SkeletonLine className="h-7 w-24" />
      <SkeletonLine className="h-7 w-16" />
    </div>
  </div>
);

export const ProductLongDescriptionSkeleton = () => (
  <div aria-hidden="true" className="mt-12 bg-white rounded-lg p-8 shadow-md animate-pulse">
    <SkeletonLine className="h-7 w-56 mb-6" />
    <div className="space-y-3">
      <SkeletonLine className="h-4 w-full" />
      <SkeletonLine className="h-4 w-11/12" />
      <SkeletonLine className="h-4 w-10/12" />
      <SkeletonLine className="h-4 w-2/3" />
    </div>
  </div>
);

export const ProductAttributesSkeleton = ({ count = 4 }) => (
  <div aria-hidden="true" className="mt-8 bg-white rounded-lg p-8 shadow-md animate-pulse">
    <SkeletonLine className="h-7 w-44 mb-6" />
    <div className="grid md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="border-b border-gray-200 pb-3 space-y-2">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="h-4 w-40" />
        </div>
      ))}
    </div>
  </div>
);

export const ProductPageBodySkeleton = () => (
  <section className="py-6 bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="container-divi">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 lg:items-start">
        <ProductGallerySkeleton />
        <div className="space-y-6">
          <ProductInformationSkeleton />
          <ProductDescriptionSkeleton />
          <ProductTagsSkeleton />
        </div>
      </div>

      <ProductLongDescriptionSkeleton />
      <ProductAttributesSkeleton />
    </div>
  </section>
);

export const ImageLightboxSkeleton = ({ onClose }) => (
  <div className="fixed inset-0 z-[2000] bg-black/95 flex flex-col animate-fade-in">
    <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 animate-pulse">
      <SkeletonLine dark className="h-4 w-12" />
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-lg bg-white/10" />
        <button
          type="button"
          onClick={onClose}
          className="h-9 w-9 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Fermer"
        />
      </div>
    </div>

    <div className="flex-1 flex items-center justify-center overflow-hidden relative animate-pulse">
      <div className="h-[70vh] w-[70vw] max-w-5xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/10" />
      <div className="absolute left-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10" />
      <div className="absolute right-3 top-1/2 h-11 w-11 -translate-y-1/2 rounded-full bg-white/10" />
    </div>

    <div className="flex justify-center gap-2 px-4 py-3 flex-shrink-0 animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-12 w-12 rounded-md bg-white/10 border border-white/10" />
      ))}
    </div>

    <div className="flex justify-center pb-2 animate-pulse">
      <SkeletonLine dark className="h-3 w-56" />
    </div>
  </div>
);

export default LoadingSkeleton;
