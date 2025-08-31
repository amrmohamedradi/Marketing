/**
 * Translation Validation Utility
 * Helps identify missing translations and inconsistencies
 */

interface TranslationEntry {
  ar?: string;
  en?: string;
}

interface TranslationValidationResult {
  missingArabic: string[];
  missingEnglish: string[];
  emptyTranslations: string[];
  inconsistentKeys: string[];
  total: number;
  valid: number;
  invalid: number;
}

/**
 * Validates a translations object and reports missing or inconsistent translations
 */
export function validateTranslations(
  translations: Record<string, TranslationEntry>
): TranslationValidationResult {
  const missingArabic: string[] = [];
  const missingEnglish: string[] = [];
  const emptyTranslations: string[] = [];
  const inconsistentKeys: string[] = [];
  
  let total = 0;
  let valid = 0;
  let invalid = 0;

  for (const [key, value] of Object.entries(translations)) {
    total++;
    
    if (!value || typeof value !== 'object') {
      emptyTranslations.push(key);
      invalid++;
      continue;
    }

    const hasArabic = value.ar && value.ar.trim() !== '';
    const hasEnglish = value.en && value.en.trim() !== '';

    if (!hasArabic && !hasEnglish) {
      emptyTranslations.push(key);
      invalid++;
    } else if (!hasArabic) {
      missingArabic.push(key);
      invalid++;
    } else if (!hasEnglish) {
      missingEnglish.push(key);
      invalid++;
    } else {
      valid++;
    }

    // Check for placeholder keys that weren't replaced
    if (value.ar === key || value.en === key) {
      inconsistentKeys.push(key);
    }
  }

  return {
    missingArabic,
    missingEnglish,
    emptyTranslations,
    inconsistentKeys,
    total,
    valid,
    invalid
  };
}

/**
 * Reports missing translations in a formatted way
 */
export function reportMissingTranslations(
  translations: Record<string, TranslationEntry>
): void {
  const result = validateTranslations(translations);
  
  console.group('🌐 Translation Validation Report');
  console.log(`📊 Total keys: ${result.total}`);
  console.log(`✅ Valid: ${result.valid}`);
  console.log(`❌ Invalid: ${result.invalid}`);
  console.log(`📈 Coverage: ${Math.round((result.valid / result.total) * 100)}%`);
  
  if (result.missingArabic.length > 0) {
    console.group('🔴 Missing Arabic translations:');
    result.missingArabic.forEach(key => console.log(`  - ${key}`));
    console.groupEnd();
  }
  
  if (result.missingEnglish.length > 0) {
    console.group('🔴 Missing English translations:');
    result.missingEnglish.forEach(key => console.log(`  - ${key}`));
    console.groupEnd();
  }
  
  if (result.emptyTranslations.length > 0) {
    console.group('⚪ Empty translations:');
    result.emptyTranslations.forEach(key => console.log(`  - ${key}`));
    console.groupEnd();
  }
  
  if (result.inconsistentKeys.length > 0) {
    console.group('⚠️ Inconsistent keys (placeholder values):');
    result.inconsistentKeys.forEach(key => console.log(`  - ${key}`));
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Extracts translation keys from component files
 */
export function extractTranslationKeysFromCode(code: string): string[] {
  // Match t('key') and t("key") patterns
  const tFunctionRegex = /t\(['"]([^'"]+)['"]\)/g;
  const keys: string[] = [];
  let match;
  
  while ((match = tFunctionRegex.exec(code)) !== null) {
    keys.push(match[1]);
  }
  
  return [...new Set(keys)]; // Remove duplicates
}

/**
 * Development helper to validate translations at runtime
 */
export function setupTranslationValidation(
  translations: Record<string, TranslationEntry>
): void {
  if (process.env.NODE_ENV === 'development') {
    // Report on startup
    setTimeout(() => {
      reportMissingTranslations(translations);
    }, 1000);
    
    // Add global helper function
    (window as any).__validateTranslations = () => {
      reportMissingTranslations(translations);
    };
    
    console.log('🌐 Translation validation setup complete. Run __validateTranslations() in console for report.');
  }
}

/**
 * Generates missing translation templates
 */
export function generateMissingTranslationTemplate(
  missingKeys: string[]
): string {
  return missingKeys
    .map(key => `  ${key}: { ar: '', en: '' },`)
    .join('\n');
}