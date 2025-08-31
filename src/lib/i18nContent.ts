export function i18nText(value: unknown, lang: 'ar' | 'en'): string {
  if (value == null || value === undefined) return '';
  if (typeof value === 'string') return value; // legacy
  if (typeof value === 'object' && value !== null) {
    // expect { ar?: string, en?: string }
    const v = value[lang] ?? value[lang === 'ar' ? 'en' : 'ar'];
    return typeof v === 'string' ? v : '';
  }
  return String(value || '');
}
