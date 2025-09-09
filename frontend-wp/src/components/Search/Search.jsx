// src/components/Search/Search.jsx
import { useEffect, useRef, useState } from "react";
import {
  Search as SearchIcon,
  ShoppingBag,
  Clock,
  TrendingUp,
  ChevronDown,
  X,
} from "lucide-react";
import { useWordPress } from "../../context/WordPressContext";
import { useSearch } from "../../hooks/useSearch";
import Modal from "../UI/Modal";
import SearchFilters from "./SearchFilters";
import { getProduct } from "../../services/woocommerce";
import ProductExpansion from "./ProductExpansion";

const Search = ({ isOpen, onClose }) => {
  const inputRef = useRef(null);
  const { categories } = useWordPress();

  const {
    query,
    filters,
    results,
    loading,
    error,
    hasResults,
    showEmpty,
    showSuggestions,
    hasActiveFilters,
    updateQuery,
    updateFilters,
    resetFilters,
    clearQuery,
    performSearch,
    recentSearches,
    toggleProductExpansion,
    expandedProduct,
  } = useSearch();

  // Focus automatique à l'ouverture
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleClose = () => {
    clearQuery();
    resetFilters();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="fullscreen"
      position="top"
      showCloseButton={false}
      backdropClassName="bg-black/50 backdrop-blur-sm"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 flex-shrink-0">
          <div className="px-4 lg:px-6 py-4">
            <SearchHeader
              inputRef={inputRef}
              query={query}
              onQueryChange={updateQuery}
              onClose={handleClose}
              onClearQuery={clearQuery}
            />
          </div>
        </div>

        {/* Filtres */}
        <div className="flex-shrink-0">
          <SearchFilters
            categories={categories || []}
            filters={filters}
            onFiltersChange={updateFilters}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-4 lg:px-6 py-6">
            <SearchContent
              loading={loading}
              error={error}
              results={results}
              query={query}
              hasResults={hasResults}
              showEmpty={showEmpty}
              showSuggestions={showSuggestions}
              hasActiveFilters={hasActiveFilters}
              recentSearches={recentSearches}
              onRetry={performSearch}
              onSuggestionClick={updateQuery}
              onClose={handleClose}
              toggleProductExpansion={toggleProductExpansion}
              expandedProduct={expandedProduct}
              getProduct={getProduct}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 lg:px-6 py-3 bg-gray-50 flex-shrink-0">
          <SearchFooter />
        </div>
      </div>
    </Modal>
  );
};

// Header simplifié
const SearchHeader = ({
  inputRef,
  query,
  onQueryChange,
  onClose,
  onClearQuery,
}) => (
  <div className="flex items-center gap-4">
    <div className="flex items-center flex-1 bg-gray-50 rounded-xl px-4 py-3">
      <SearchIcon className="text-gray-400 mr-3" size={20} />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Rechercher des instruments, accessoires..."
        className="flex-1 text-lg outline-none bg-transparent placeholder-gray-500"
      />
      {query && (
        <button
          onClick={onClearQuery}
          className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={16} className="text-gray-400" />
        </button>
      )}
    </div>
    <button
      onClick={onClose}
      className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
    >
      <X size={24} className="text-gray-600" />
    </button>
  </div>
);

// Contenu principal simplifié
const SearchContent = ({
  loading,
  error,
  results,
  query,
  hasResults,
  showEmpty,
  showSuggestions,
  hasActiveFilters,
  recentSearches,
  onRetry,
  onSuggestionClick,
  onClose,
  toggleProductExpansion,
  expandedProduct,
  getProduct,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Recherche en cours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (showEmpty) {
    return <SearchEmptyState query={query} />;
  }

  if (showSuggestions) {
    return (
      <SearchSuggestions
        recentSearches={recentSearches}
        onSuggestionClick={onSuggestionClick}
      />
    );
  }

  if (hasResults) {
    return (
      <SearchResults
        results={results}
        query={query}
        hasActiveFilters={hasActiveFilters}
        onClose={onClose}
        toggleProductExpansion={toggleProductExpansion}
        expandedProduct={expandedProduct}
        getProduct={getProduct} // ✅ Ajouté
      />
    );
  }

  return null;
};

// Composants UI restants (inchangés)
const SearchEmptyState = ({ query }) => (
  <div className="text-center py-12">
    <ShoppingBag size={64} className="mx-auto mb-6 text-gray-300" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      Aucun produit trouvé
    </h3>
    <p className="text-gray-600 mb-6">
      Aucun résultat pour "<span className="font-medium">{query}</span>"
    </p>
    <div className="text-sm text-gray-500">
      <p>Suggestions :</p>
      <ul className="mt-2 space-y-1">
        <li>• Vérifiez l'orthographe</li>
        <li>• Essayez des mots-clés différents</li>
        <li>• Utilisez des termes plus généraux</li>
      </ul>
    </div>
  </div>
);

const SearchSuggestions = ({ recentSearches, onSuggestionClick }) => (
  <>
    {recentSearches.length > 0 && (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-gray-400" />
          <h3 className="font-medium text-gray-800">Recherches récentes</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {recentSearches.slice(0, 6).map((searchTerm, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(searchTerm)}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
            >
              {searchTerm}
            </button>
          ))}
        </div>
      </div>
    )}

    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={18} className="text-gray-400" />
        <h3 className="font-medium text-gray-800">Recherches populaires</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          "Guitare électrique",
          "Piano numérique",
          "Microphone",
          "Ampli guitare",
          "Batterie",
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  </>
);

const SearchResults = ({
  results,
  query,
  hasActiveFilters,
  onClose,
  toggleProductExpansion,
  expandedProduct,
  getProduct, // ✅ Ajouté
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-600">
        <span className="font-medium">{results.length}</span> résultat
        {results.length > 1 ? "s" : ""}
        {query.trim() && (
          <>
            {" "}
            pour <span className="font-medium text-gray-800">"{query}"</span>
          </>
        )}
        {hasActiveFilters && (
          <span className="text-blue-600"> (avec filtres)</span>
        )}
      </p>
    </div>

    <div className="grid gap-3">
      {results.map((product) => (
        <SearchResult
          key={product.id}
          product={product}
          onClose={onClose}
          onToggleProduct={toggleProductExpansion}
          isExpanded={expandedProduct === product.id}
          getProduct={getProduct} // ✅ Ajouté
        />
      ))}
    </div>
  </div>
);

const SearchResult = ({ product, onClose, onToggleProduct, isExpanded }) => {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [fullProduct, setFullProduct] = useState(null);

  const handleClick = (e) => {
    e.preventDefault();
    onToggleProduct(product.id);

    // Charger les détails du produit si on l'expanse et qu'on ne les a pas déjà
    if (!isExpanded && !fullProduct) {
      loadProductDetails();
    }
  };

  const loadProductDetails = async () => {
    try {
      setLoadingDetails(true);
      const details = await getProduct(product.id);
      setFullProduct(details);
    } catch (error) {
      console.error("Erreur chargement détails produit:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleNavigateToProduct = (e) => {
    e.stopPropagation();
    onClose();
    // Navigation vers le produit
    console.log("Navigation vers produit:", product.id);
  };

  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(price));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Ligne principale du produit */}
      <div
        onClick={handleClick}
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
          {product.images?.[0] ? (
            <img
              src={product.images[0].src}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingBag size={24} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            {product.price && (
              <p className="text-lg font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>
            )}
            {product.categories?.length > 0 && (
              <p className="text-sm text-gray-500">
                {product.categories[0].name}
              </p>
            )}
          </div>
          {product.stock_status === "instock" && (
            <p className="text-xs text-green-600 mt-1">✓ En stock</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNavigateToProduct}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voir le produit"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="text-gray-400"
            >
              <path d="M6 3l5 5-5 5V3z" />
            </svg>
          </button>

          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Zone d'expansion avec les détails */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          <ProductExpansion
            product={product}
            fullProduct={fullProduct}
            isLoading={loadingDetails}
          />
        </div>
      )}
    </div>
  );
};

const SearchFooter = () => (
  <p className="text-xs text-gray-500 text-center hidden sm:block">
    Appuyez sur{" "}
    <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">
      Échap
    </kbd>{" "}
    pour fermer
  </p>
);

export default Search;
