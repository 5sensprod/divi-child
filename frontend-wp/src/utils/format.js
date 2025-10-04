// src/utils/format.js

/**
 * Formate un prix au format français
 * @param {string|number} price - Le prix à formater
 * @param {string} currency - Le symbole de devise (par défaut '€')
 * @returns {string} - Prix formaté (ex: "84,00 €")
 */
export const formatPrice = (price, currency = "€") => {
  // Convertir en nombre
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  // Vérifier si c'est un nombre valide
  if (isNaN(numPrice)) {
    return `0,00 ${currency}`;
  }

  // Formater avec 2 décimales, virgule comme séparateur décimal
  // et espace comme séparateur de milliers
  const formatted = numPrice.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${formatted} ${currency}`;
};

/**
 * Formate un prix sans décimales si c'est un nombre entier
 * @param {string|number} price - Le prix à formater
 * @param {string} currency - Le symbole de devise (par défaut '€')
 * @returns {string} - Prix formaté (ex: "84 €" ou "84,50 €")
 */
export const formatPriceShort = (price, currency = "€") => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return `0 ${currency}`;
  }

  // Vérifier si le prix est un nombre entier
  const isInteger = numPrice % 1 === 0;

  const formatted = numPrice.toLocaleString("fr-FR", {
    minimumFractionDigits: isInteger ? 0 : 2,
    maximumFractionDigits: 2,
  });

  return `${formatted} ${currency}`;
};

/**
 * Décode les entités HTML (comme &amp; vers &)
 * @param {string} text - Le texte à décoder
 * @returns {string} - Texte décodé
 */
export const decodeHTMLEntities = (text) => {
  if (typeof text !== "string") return text;
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

/**
 * Formate un nombre avec séparateurs de milliers français
 * @param {number} num - Le nombre à formater
 * @returns {string} - Nombre formaté (ex: "1 234")
 */
export const formatNumber = (num) => {
  if (isNaN(num)) return "0";
  return num.toLocaleString("fr-FR");
};

export default {
  formatPrice,
  formatPriceShort,
  decodeHTMLEntities,
  formatNumber,
};
