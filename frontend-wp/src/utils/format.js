// src/utils/format.js

/**
 * Formate un prix au format français
 * @param {string|number} price - Le prix à formater
 * @param {string} currency - Le symbole de devise (par défaut '€')
 * @returns {string} - Prix formaté (ex: "84,00 €")
 */
export const formatPrice = (price, currency = "€") => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) {
    return `0,00 ${currency}`;
  }

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
 * Décode récursivement les entités HTML dans un objet, tableau ou chaîne
 * @param {*} obj - L'objet à décoder
 * @returns {*} - Objet décodé
 */
export const decodeObject = (obj) => {
  if (!obj) return obj;
  if (typeof obj === "string") return decodeHTMLEntities(obj);
  if (Array.isArray(obj)) return obj.map(decodeObject);
  if (typeof obj === "object") {
    const decoded = {};
    for (const [key, value] of Object.entries(obj)) {
      decoded[key] = decodeObject(value);
    }
    return decoded;
  }
  return obj;
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
  decodeObject,
  formatNumber,
};
