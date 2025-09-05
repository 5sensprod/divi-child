// src/components/Search/SearchModal.jsx
import { useState, useEffect, useRef } from "react";
import { X, Search, ShoppingBag, Clock, TrendingUp } from "lucide-react";
import { useProductSearch } from "../../hooks/useProductSearch";

const SearchModal = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);
  const {
    query,
    results,
    loading,
    error,
    hasSearched,
    search,
    clearSearch,
    getRecentSearches,
  } = useProductSearch();

  // Focus automatique à l'ouverture
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Déclencher la recherche quand l'input change
  useEffect(() => {
    search(inputValue);
  }, [inputValue, search]);

  // Nettoyer à la fermeture
  const handleClose = () => {
    setInputValue("");
    clearSearch();
    onClose();
  };

  // Gestion des raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  // Recherches récentes
  const recentSearches = getRecentSearches();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-2xl border-b border-gray-200">
        {/* Header de recherche */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center flex-1 bg-gray-50 rounded-xl px-4 py-3">
                <Search className="text-gray-400 mr-3" size={20} />
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Rechercher des instruments, accessoires..."
                  className="flex-1 text-lg outline-none bg-transparent placeholder-gray-500"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue("")}
                    className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </div>

              <button
                onClick={handleClose}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="Fermer la recherche"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu des résultats */}
        <div className="max-h-[70vh] overflow-y-auto">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            {/* État de chargement */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Recherche en cours...
                </span>
              </div>
            )}

            {/* Erreur */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <p className="text-red-600 text-lg">{error}</p>
                <button
                  onClick={() => search(inputValue)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Pas de résultats */}
            {hasSearched &&
              !loading &&
              !error &&
              results.length === 0 &&
              inputValue.trim() && (
                <div className="text-center py-12">
                  <ShoppingBag
                    size={64}
                    className="mx-auto mb-6 text-gray-300"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Aucun produit trouvé
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Aucun résultat pour "
                    <span className="font-medium">{query}</span>"
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
              )}

            {/* Recherches récentes (quand pas de recherche active) */}
            {!inputValue.trim() && recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-gray-400" />
                  <h3 className="font-medium text-gray-800">
                    Recherches récentes
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 6).map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(search)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions populaires (quand pas de recherche) */}
            {!inputValue.trim() && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={18} className="text-gray-400" />
                  <h3 className="font-medium text-gray-800">
                    Recherches populaires
                  </h3>
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
                      onClick={() => setInputValue(suggestion)}
                      className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Résultats de recherche */}
            {results.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">{results.length}</span>{" "}
                    résultat{results.length > 1 ? "s" : ""} pour
                    <span className="font-medium text-gray-800">
                      {" "}
                      "{query}"
                    </span>
                  </p>
                </div>

                <div className="grid gap-3">
                  {results.map((product) => (
                    <SearchResult
                      key={product.id}
                      product={product}
                      onClose={handleClose}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer avec raccourci */}
        <div className="border-t border-gray-100 px-4 lg:px-6 py-3 bg-gray-50">
          <div className="container mx-auto">
            <p className="text-xs text-gray-500 text-center">
              Appuyez sur{" "}
              <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                Échap
              </kbd>{" "}
              pour fermer
              {/* ou <kbd className="px-2 py-1 bg-white border border-gray-200 rounded text-xs">↑↓</kbd> pour naviguer */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher un résultat de recherche
const SearchResult = ({ product, onClose }) => {
  const handleClick = () => {
    // Navigation vers le produit
    onClose();
    // Si vous utilisez React Router
    // navigate(`/produit/${product.slug || product.id}`);
  };

  // Formater le prix
  const formatPrice = (price) => {
    if (!price) return null;
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(price));
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
    >
      {/* Image du produit */}
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

      {/* Informations du produit */}
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

      {/* Flèche pour indiquer l'action */}
      <div className="flex-shrink-0 text-gray-400">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M6 3l5 5-5 5V3z" />
        </svg>
      </div>
    </div>
  );
};

export default SearchModal;
