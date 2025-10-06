// src/components/UI/RelatedCategories.jsx
import { useNavigate } from "react-router-dom";
import { capitalize } from "../../utils/format";

const RelatedCategories = ({ currentCategory, allCategories = [] }) => {
  const navigate = useNavigate();

  if (!currentCategory || !allCategories.length) return null;

  // Trouver les enfants directs de la catégorie actuelle (premier niveau uniquement)
  const children = allCategories.filter(
    (cat) => cat.parent === currentCategory.id && cat.count > 0 // Seulement celles avec des produits
  );

  if (children.length === 0) return null;

  const handleCategoryClick = (category) => {
    // Construire le chemin complet si nécessaire
    let path = `/categorie-produit/${category.slug}`;

    // Si la catégorie a un parent, construire le chemin complet
    if (category.parent !== 0) {
      const parent = allCategories.find((cat) => cat.id === category.parent);
      if (parent) {
        path = `/categorie-produit/${parent.slug}/${category.slug}`;
      }
    }

    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Dans le même rayon
      </h3>
      <div className="flex flex-wrap gap-2">
        {children.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-pink-50 border border-gray-200 hover:border-pink-300 rounded-lg text-sm text-gray-700 hover:text-pink-600 transition-all"
          >
            {cat.image?.src && (
              <img
                src={cat.image.src}
                alt={cat.name}
                className="w-6 h-6 object-cover rounded"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <span>{capitalize(cat.name)}</span>
            <span className="text-xs text-gray-500">({cat.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedCategories;
