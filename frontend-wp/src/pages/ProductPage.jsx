// src/pages/ProductPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductBySlug, getCategories } from "../services/woocommerce";
import Background from "../components/UI/Background";
import Title from "../components/UI/Title";
import Breadcrumb from "../components/UI/Breadcrumb";
import ImageLightbox from "../components/UI/ImageLightbox";
import { formatPrice } from "../utils/format";
import RelatedProductsCarousel from "../components/Product/RelatedProductsCarousel";
import WishlistButton from "../components/UI/WishlistButton";
import StockBadge from "../components/Product/StockBadge";
import { ProductPageBodySkeleton } from "../components/UI/LoadingSkeleton";
import { ZoomIn } from "lucide-react";

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const infoColRef = useRef(null);
  const [infoColHeight, setInfoColHeight] = useState(null);

  useEffect(() => {
    if (!infoColRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setInfoColHeight(entry.contentRect.height);
    });
    observer.observe(infoColRef.current);
    return () => observer.disconnect();
  }, [product]);

  const buildCategoryHierarchy = async (categoryId, allCategories) => {
    const hierarchy = [];
    let currentCat = allCategories.find((cat) => cat.id === categoryId);

    while (currentCat) {
      hierarchy.unshift({
        id: currentCat.id,
        name: currentCat.name,
        slug: currentCat.slug,
      });

      if (currentCat.parent === 0) break;
      currentCat = allCategories.find((cat) => cat.id === currentCat.parent);
    }

    return hierarchy;
  };

  const buildCategoryPath = (hierarchy) => {
    return hierarchy.map((cat) => cat.slug).join("/");
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getProductBySlug(slug);
        setProduct(data);

        const items = [{ label: "Accueil", path: "/" }];

        if (data.categories && data.categories.length > 0) {
          try {
            const allCategories = await getCategories();
            let deepestCategory = data.categories[0];
            let maxDepth = 0;

            for (const cat of data.categories) {
              const hierarchy = await buildCategoryHierarchy(
                cat.id,
                allCategories,
              );
              if (hierarchy.length > maxDepth) {
                maxDepth = hierarchy.length;
                deepestCategory = cat;
              }
            }

            const hierarchy = await buildCategoryHierarchy(
              deepestCategory.id,
              allCategories,
            );

            hierarchy.forEach((cat, index) => {
              const pathUpToThis = hierarchy.slice(0, index + 1);
              const fullPath = buildCategoryPath(pathUpToThis);
              items.push({
                label: cat.name,
                path: `/categorie-produit/${fullPath}`,
              });
            });
          } catch (err) {
            console.error("Erreur construction hiérarchie:", err);
          }
        }

        items.push({ label: data.name, path: null });
        setBreadcrumbItems(items);
      } catch (err) {
        console.error("Erreur chargement produit:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) loadProduct();
  }, [slug]);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => Math.max(1, prev + increment));
  };

  if (loading) {
    return (
      <div>
        <section className="relative overflow-hidden page-content pt-36 pb-4 md:pt-48 md:pb-4">
          <Background variant="ocean-night" opacity={1} animated={true} />
          <div className="container-divi relative z-20">
            <div className="flex justify-end">
              <Breadcrumb loading />
            </div>
          </div>
        </section>

        <ProductPageBodySkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <section className="relative overflow-hidden min-h-[200px] page-content">
          <Background variant="auto" opacity={1} animated={true} />
          <div className="container-divi relative z-20">
            <div className="text-center py-12">
              <Title
                tag="h1"
                className="mb-4 text-white"
                animationType="equalizer"
                gradient="default"
                mode="neon"
              >
                Produit non trouvé
              </Title>
              <p className="text-white/80 mb-6">
                {error || "Ce produit n'existe pas ou n'est plus disponible"}
              </p>
              <button
                onClick={() => navigate("/")}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const images = product.images || [];
  const hasImages = images.length > 0 && images[0]?.src;

  return (
    <div>
      {/* Hero Section - Fil d'ariane uniquement */}
      <section className="relative overflow-hidden page-content pt-36 pb-4 md:pt-48 md:pb-4">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-20">
          <div className="flex justify-end">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </section>

      {/* Section produit */}
      <section className="py-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          <div
            className={`grid ${hasImages ? "lg:grid-cols-2" : "lg:grid-cols-1"} gap-8 lg:gap-12 lg:items-start`}
          >
            {/* GALERIE D'IMAGES */}
            {hasImages && (
              // `top-[108px]`, pas `top-6` : la barre de navigation est
              // `fixed` et fait 80 px une fois réduite au défilement (118 px
              // en haut de page). À 24 px, la galerie se collait SOUS elle.
              // Même valeur que `ProductFilter.jsx` et que la page Axe.
              <div className="lg:sticky lg:top-[108px] flex flex-col gap-4">
                {/* Image principale cliquable */}
                <div
                  className="relative bg-white rounded-lg shadow-lg overflow-hidden cursor-zoom-in group"
                  style={{ height: "400px" }}
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    src={images[selectedImage]?.src}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="eager"
                  />
                  {/* Indicateur zoom */}
                  <div className="absolute bottom-3 right-3 bg-black/40 text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={13} />
                    Agrandir
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImage === index
                            ? "border-pink-500 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image.src}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Informations produit */}
            <div className="space-y-6" ref={infoColRef}>
              <div className="bg-white rounded-lg p-6 shadow-md">
                {/* Nom */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </h2>
                </div>

                {/* Prix */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    {product.on_sale && product.sale_price ? (
                      <>
                        <span className="text-3xl font-bold text-pink-600">
                          {formatPrice(product.sale_price)}
                        </span>
                        <span className="text-xl text-gray-500 line-through">
                          {formatPrice(product.regular_price)}
                        </span>
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                          Solde
                        </span>
                        <span className="bg-gray-900 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                          -
                          {Math.round(
                            100 -
                              (Number(product.sale_price) /
                                Number(product.regular_price)) *
                                100,
                          )}
                          %
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-gray-900">
                        {formatPrice(product.regular_price)}
                      </span>
                    )}
                  </div>
                  <WishlistButton
                    product={product}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  />
                </div>
                {/* Marques */}
                {product.brands?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Marque
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.brands.map((brand) => (
                        <span
                          key={brand.id}
                          className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-full text-sm font-medium text-blue-700 flex items-center gap-2"
                        >
                          {brand.image?.src && (
                            <img
                              src={brand.image.src}
                              alt={brand.image.alt || brand.name}
                              className="h-5 w-auto object-contain"
                            />
                          )}
                          {brand.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Catégories */}
                {product.categories?.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">
                      Catégories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((cat) => {
                        const item = breadcrumbItems.find(
                          (b) => b.label === cat.name,
                        );
                        return (
                          <button
                            key={cat.id}
                            onClick={() => item && navigate(item.path)}
                            className="bg-gray-100 hover:bg-pink-50 border border-gray-200 hover:border-pink-300 px-3 py-1.5 rounded-full text-sm text-gray-700 hover:text-pink-600 transition-colors"
                          >
                            {cat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <StockBadge
                  stockStatus={product.stock_status}
                  manageStock={product.manage_stock}
                  stockQuantity={product.stock_quantity}
                  size="md"
                  showQuantity={true}
                />
              </div>

              {/* Description courte */}
              {product.short_description && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">
                    Description
                  </h2>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: product.short_description,
                    }}
                  />
                </div>
              )}

              {/* Tags */}
              {product.tags?.length > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-pink-50 px-3 py-1 rounded-full text-sm text-pink-700"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description longue */}
          {product.description && (
            <div className="mt-12 bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Détails du produit
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            </div>
          )}

          {/* Attributs */}
          {product.attributes?.length > 0 && (
            <div className="mt-8 bg-white rounded-lg p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Caractéristiques
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {product.attributes.map((attr, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {attr.name}
                    </div>
                    <div className="text-gray-600">
                      {Array.isArray(attr.options)
                        ? attr.options.join(", ")
                        : attr.options}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Produits liés */}
          {product.categories?.[0] && (
            <RelatedProductsCarousel
              currentProductId={product.id}
              categoryId={product.categories[0].id}
            />
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={images}
          currentIndex={selectedImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
};

export default ProductPage;
