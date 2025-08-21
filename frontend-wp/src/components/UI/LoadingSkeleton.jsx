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

export default LoadingSkeleton;
