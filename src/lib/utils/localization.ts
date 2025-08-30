// TypeScript types for localized content
export type Localized = string | { ar?: string; en?: string };

export interface SpecItem {
  label: Localized;
  value?: Localized;
  price?: number;
}

export interface Spec {
  title: Localized;
  name?: Localized;
  items?: SpecItem[];
  meta?: Record<string, unknown>;
}

// Safe utility function to extract text from localized values
export function t(value: Localized | undefined | null): string {
  if (!value) return '';
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object' && value !== null) {
    // Return Arabic first, fallback to English, then empty string
    return value.ar || value.en || '';
  }
  
  return '';
}

// Helper for getting English text specifically
export function tEn(value: Localized | undefined | null): string {
  if (!value) return '';
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object' && value !== null) {
    return value.en || value.ar || '';
  }
  
  return '';
}

// Helper for getting Arabic text specifically
export function tAr(value: Localized | undefined | null): string {
  if (!value) return '';
  
  if (typeof value === 'string') {
    return value;
  }
  
  if (typeof value === 'object' && value !== null) {
    return value.ar || value.en || '';
  }
  
  return '';
}
