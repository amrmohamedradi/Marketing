import { translateArabicToEnglish } from './serviceTranslations.js';

// Cache for Arabic detection and translations
const arabicCache = new Map();
const translationCache = new Map();
const arabicRegex = /[\u0600-\u06FF]/;

/**
 * Fast Arabic text detection with caching
 */
function isArabicText(text) {
  if (arabicCache.has(text)) {
    return arabicCache.get(text);
  }
  const isArabic = arabicRegex.test(text);
  arabicCache.set(text, isArabic);
  return isArabic;
}

/**
 * Fast translation with caching
 */
function getCachedTranslation(text) {
  if (translationCache.has(text)) {
    return translationCache.get(text);
  }
  const translation = translateArabicToEnglish(text);
  translationCache.set(text, translation);
  return translation;
}

/**
 * Extract text in current language with fallback to other language
 * Handles both legacy string format and bilingual object format { ar?, en? }
 * @param {any} value - The text value (string or { ar?, en? })
 * @param {'ar' | 'en'} lang - Current language
 * @returns {string} - Extracted text
 */
export function i18nText(value, lang) {
  if (value == null) return '';
  
  if (typeof value === 'string') {
    // If requesting English but have Arabic string, try to translate
    if (lang === 'en' && isArabicText(value)) {
      return getCachedTranslation(value);
    }
    return value;
  }
  
  if (typeof value === 'object') {
    let v = value[lang];
    if (!v) {
      // Fallback to other language
      const fallback = value[lang === 'ar' ? 'en' : 'ar'];
      if (fallback && lang === 'en' && isArabicText(fallback)) {
        v = getCachedTranslation(fallback);
      } else {
        v = fallback;
      }
    }
    return typeof v === 'string' ? v : '';
  }
  
  return String(value);
}
