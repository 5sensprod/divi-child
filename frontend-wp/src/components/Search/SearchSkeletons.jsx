// src/components/Search/SearchSkeletons.jsx
const SearchRowSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
    <div className="flex items-center gap-4 p-4">
      {/* vignette 64x64 */}
      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg" />

      {/* zone texte */}
      <div className="flex-1 min-w-0">
        {/* titre */}
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="flex items-center gap-3">
          {/* prix */}
          <div className="h-5 bg-gray-200 rounded w-24" />
          {/* catégorie */}
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
        {/* badge stock optionnel */}
        <div className="h-3 bg-gray-200 rounded w-16 mt-2" />
      </div>

      {/* chevron */}
      <div className="w-5 h-5 bg-gray-200 rounded" />
    </div>
  </div>
);

export const SearchListSkeleton = ({ count = 12 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <SearchRowSkeleton key={i} />
    ))}
  </div>
);

export default SearchRowSkeleton;
