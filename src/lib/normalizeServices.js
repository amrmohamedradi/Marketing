import { translateArabicToEnglish } from './serviceTranslations.js';

/**
 * Normalize service data to ensure bilingual format with intelligent translation
 * Converts legacy string titles to proper bilingual objects using translation mappings
 * @param {Array} services - Array of service objects
 * @returns {Array} - Normalized services with bilingual titles and items
 */
export function normalizeServices(services) {
  if (!Array.isArray(services)) return [];
  
  return services.map(service => {
    const normalizedService = { ...service };
    
    // Helper function to create bilingual object from string
    const createBilingualObject = (text) => {
      if (!text || typeof text !== 'string') return text;
      
      // Check if it's Arabic text by testing for Arabic characters
      const isArabic = /[\u0600-\u06FF]/.test(text);
      
      if (isArabic) {
        // Try to translate Arabic to English
        const englishTranslation = translateArabicToEnglish(text);
        return {
          ar: text,
          en: englishTranslation !== text ? englishTranslation : '' // Only use translation if it's different from original
        };
      } else {
        // Assume it's English text
        return {
          ar: '', // We don't have reverse translation capability
          en: text
        };
      }
    };
    
    // Normalize service title
    if (typeof service.title === 'string') {
      normalizedService.title = createBilingualObject(service.title);
    }
    
    // Normalize service name (for dashboard compatibility)
    if (typeof service.name === 'string') {
      normalizedService.name = createBilingualObject(service.name);
    }
    
    // Normalize service items
    if (Array.isArray(service.items)) {
      normalizedService.items = service.items.map(item => {
        if (typeof item === 'string') {
          return { text: createBilingualObject(item) };
        }
        if (item && typeof item.text === 'string') {
          return { ...item, text: createBilingualObject(item.text) };
        }
        return item;
      });
    }
    
    // Normalize subServices (for dashboard compatibility)
    if (Array.isArray(service.subServices)) {
      normalizedService.subServices = service.subServices.map(subService => {
        const normalized = { ...subService };
        if (typeof subService.name === 'string') {
          normalized.name = createBilingualObject(subService.name);
        }
        if (typeof subService.description === 'string') {
          normalized.description = createBilingualObject(subService.description);
        }
        return normalized;
      });
    }
    
    return normalizedService;
  });
}
