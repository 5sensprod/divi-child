// frontend-wp/src/components/Product/RelatedProductsCarousel.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsByCategory } from "../../services/woocommerce";
import { formatPrice } from "../../utils/format";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ IMAGE PAR DÉFAUT
const FALLBACK_IMAGE =
  "https://placehold.co/800x800/f3f4f6/9ca3af?text=Produit";

const RelatedProductsCarousel = ({ currentProductId, categoryId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsPerView, setProductsPerView] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setProductsPerView(1);
      } else if (window.innerWidth < 1024) {
        setProductsPerView(2);
      } else {
        setProductsPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        const response = await getProductsByCategory(categoryId, {
          per_page: 12,
          page: 1,
        });

        const allProducts = response.data || response;
        const filtered = allProducts.filter((p) => p.id !== currentProductId);
        setProducts(filtered);
      } catch (error) {
        console.error("Erreur chargement produits similaires:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [categoryId, currentProductId]);

  const canGoNext = currentIndex < products.length - productsPerView;
  const canGoPrev = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (canGoPrev) setCurrentIndex((prev) => prev - 1);
  };

  const handleProductClick = (slug) => {
    navigate(`/produit/${slug}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getStockBadge = (
    stockStatus,
    manageStock = false,
    stockQuantity = null,
  ) => {
    if (manageStock) {
      const isReappro =
        stockStatus === "outofstock" &&
        stockQuantity !== null &&
        stockQuantity === 0;

      const badges = {
        instock: null,
        outofstock: isReappro
          ? { text: "Réappro", bgColor: "bg-orange-500/90" }
          : { text: "Rupture", bgColor: "bg-red-600/90" },
        onbackorder: { text: "Réappro", bgColor: "bg-orange-500/90" },
      };
      return badges[stockStatus];
    } else {
      const badges = {
        instock: null,
        outofstock: { text: "Sur commande", bgColor: "bg-yellow-500/90" },
        onbackorder: { text: "Réappro", bgColor: "bg-orange-500/90" },
      };
      return badges[stockStatus];
    }
  };

  // ✅ Composant Image avec gestion d'erreur
  const ProductImage = ({ src, alt, promo, stockBadge }) => {
    const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);
    const [errorOccurred, setErrorOccurred] = useState(false);

    const handleError = () => {
      if (!errorOccurred) {
        setImgSrc(FALLBACK_IMAGE);
        setErrorOccurred(true);
      }
    };

    return (
      <div className="aspect-square bg-gray-100 relative">
        <img
          src={imgSrc}
          alt={alt}
          className="w-full h-full object-cover"
          onError={handleError}
          loading="lazy"
        />

        {/* Badge Promo */}
        {promo && (
          <span className="absolute top-2 left-2 text-xs font-medium px-2 py-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-sky-400 text-white shadow">
            Promo
          </span>
        )}

        {/* Badge de stock */}
        {stockBadge && (
          <span
            className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full text-white shadow ${stockBadge.bgColor}`}
          >
            {stockBadge.text}
          </span>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Produits similaires
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Produits similaires
      </h2>

      <div className="relative">
        {canGoPrev && (
          <button
            onClick={handlePrev}
            className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all"
            aria-label="Produit précédent"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}

        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${
                currentIndex * (100 / productsPerView)
              }%)`,
            }}
          >
            {products.map((product) => {
              const stockBadge = getStockBadge(
                product.stock_status,
                product.manage_stock,
                product.stock_quantity ?? null,
              );

              return (
                <div
                  key={product.id}
                  className="flex-shrink-0 px-2"
                  style={{ width: `${100 / productsPerView}%` }}
                >
                  <div
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full"
                    onClick={() => handleProductClick(product.slug)}
                  >
                    {/* ✅ Image avec fallback */}
                    <ProductImage
                      src={product.images?.[0]?.src}
                      alt={product.name}
                      promo={product.on_sale && product.sale_price}
                      stockBadge={stockBadge}
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        {product.on_sale && product.sale_price ? (
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-pink-600">
                              {formatPrice(product.sale_price)}
                            </span>
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(product.regular_price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {formatPrice(product.regular_price)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {canGoNext && (
          <button
            onClick={handleNext}
            className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-all"
            aria-label="Produit suivant"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        )}
      </div>

      {/* Navigation mobile */}
      <div className="flex sm:hidden justify-center gap-4 mt-4">
        <button
          onClick={handlePrev}
          disabled={!canGoPrev}
          className="bg-white rounded-full p-3 shadow-md hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Produit précédent"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className="bg-white rounded-full p-3 shadow-md hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Produit suivant"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Indicateurs */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({
          length: Math.ceil(products.length / productsPerView),
        }).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i * productsPerView)}
            className={`h-2 rounded-full transition-all ${
              Math.floor(currentIndex / productsPerView) === i
                ? "w-8 bg-pink-500"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Aller au groupe ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProductsCarousel;
