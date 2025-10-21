// src/hooks/useBreadcrumb.js
import { useState, useEffect } from "react";
import { getCategories } from "../services/woocommerce";

export const useBreadcrumb = (product) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const buildBreadcrumb = async () => {
      if (!product) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const items = [{ label: "Accueil", path: "/" }];

        if (product.categories && product.categories.length > 0) {
          try {
            const allCategories = await getCategories();
            let deepestCategory = product.categories[0];
            let maxDepth = 0;

            for (const cat of product.categories) {
              const hierarchy = await buildCategoryHierarchy(
                cat.id,
                allCategories
              );
              if (hierarchy.length > maxDepth) {
                maxDepth = hierarchy.length;
                deepestCategory = cat;
              }
            }

            const hierarchy = await buildCategoryHierarchy(
              deepestCategory.id,
              allCategories
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

        items.push({ label: product.name, path: null });
        setBreadcrumbItems(items);
      } catch (err) {
        console.error("Erreur construction breadcrumb:", err);
      } finally {
        setLoading(false);
      }
    };

    buildBreadcrumb();
  }, [product]);

  return { breadcrumbItems, loading };
};
