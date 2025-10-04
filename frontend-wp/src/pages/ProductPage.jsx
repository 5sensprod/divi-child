// src/pages/ProductPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductBySlug } from "../services/woocommerce";
import Background from "../components/UI/Background";
import Title from "../components/UI/Title";
import { formatPrice } from "../utils/format";

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("🔍 Chargement du produit:", slug);
        const data = await getProductBySlug(slug);
        setProduct(data);
        console.log("✅ Produit chargé:", data);
      } catch (err) {
        console.error("❌ Erreur chargement produit:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const handleQuantityChange = (increment) => {
    setQuantity((prev) => {
      const newValue = prev + increment;
      return newValue < 1 ? 1 : newValue;
    });
  };

  if (loading) {
    return (
      <div>
        <section className="relative overflow-hidden min-h-[400px] page-content">
          <Background variant="auto" opacity={1} animated={true} />
          <div className="container-divi relative z-10">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Chargement du produit...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        <section className="relative overflow-hidden min-h-[400px] page-content">
          <Background variant="auto" opacity={1} animated={true} />
          <div className="container-divi relative z-10">
            <div className="text-center py-20">
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
                onClick={() => navigate("/shop")}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
              >
                Retour à la boutique
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImage]?.src || "/placeholder-product.jpg";

  return (
    <div>
      {/* HERO Section avec nom du produit */}
      <section className="relative overflow-hidden min-h-[300px] page-content">
        <Background variant="ocean-night" opacity={1} animated={true} />
        <div className="container-divi relative z-10">
          <div className="py-12 lg:py-16">
            {/* Fil d'Ariane */}
            <nav className="mb-6 text-sm">
              <ol className="flex items-center space-x-2 text-white/70">
                <li>
                  <button
                    onClick={() => navigate("/")}
                    className="hover:text-white transition-colors"
                  >
                    Accueil
                  </button>
                </li>
                <li>/</li>
                <li>
                  <button
                    onClick={() => navigate("/shop")}
                    className="hover:text-white transition-colors"
                  >
                    Boutique
                  </button>
                </li>
                {product.categories && product.categories[0] && (
                  <>
                    <li>/</li>
                    <li>
                      <button
                        onClick={() =>
                          navigate(
                            `/categorie-produit/${product.categories[0].slug}`
                          )
                        }
                        className="hover:text-white transition-colors"
                      >
                        {product.categories[0].name}
                      </button>
                    </li>
                  </>
                )}
                <li>/</li>
                <li className="text-white font-medium">{product.name}</li>
              </ol>
            </nav>

            <Title
              tag="h1"
              className="text-white drop-shadow-lg"
              animationType="none"
              gradient="ocean"
              mode="oceanNight"
              bold="true"
            >
              {product.name}
            </Title>
          </div>
        </div>
      </section>

      {/* Section produit */}
      <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container-divi">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galerie d'images */}
            <div className="space-y-4">
              {/* Image principale */}
              <div className="aspect-square bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = "/placeholder-product.jpg";
                  }}
                />
              </div>

              {/* Miniatures */}
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
                        onError={(e) => {
                          e.target.src = "/placeholder-product.jpg";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Informations produit */}
            <div className="space-y-6">
              {/* Prix */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-baseline gap-3 mb-2">
                  {product.on_sale && product.sale_price ? (
                    <>
                      <span className="text-3xl font-bold text-pink-600">
                        {formatPrice(product.sale_price)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.regular_price)}
                      </span>
                      <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                        PROMO
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.regular_price)}
                    </span>
                  )}
                </div>

                {/* Statut stock */}
                <div className="flex items-center gap-2 mt-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      product.stock_status === "instock"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        product.stock_status === "instock"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {product.stock_status === "instock"
                      ? "En stock"
                      : "Rupture de stock"}
                  </span>
                </div>
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

              {/* Quantité et panier */}
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantité :
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-6 py-2 border-x border-gray-300 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="w-full bg-pink-500 text-white py-3 px-6 rounded-lg hover:bg-pink-600 transition-colors font-medium text-lg shadow-md hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                  disabled={product.stock_status !== "instock"}
                >
                  {product.stock_status === "instock"
                    ? "Ajouter au panier"
                    : "Produit indisponible"}
                </button>
              </div>

              {/* Catégories et tags */}
              {(product.categories?.length > 0 || product.tags?.length > 0) && (
                <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
                  {product.categories?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Catégories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() =>
                              navigate(`/categorie-produit/${cat.slug}`)
                            }
                            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700 transition-colors"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.tags?.length > 0 && (
                    <div>
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
              )}
            </div>
          </div>

          {/* Description complète */}
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

          {/* Attributs du produit */}
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
        </div>
      </section>
    </div>
  );
};

export default ProductPage;
