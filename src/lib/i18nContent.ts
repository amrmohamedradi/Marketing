export function i18nText(value: unknown, lang: 'ar' | 'en'): string {
  if (value == null) return '';
  if (typeof value === 'string') return value; // legacy
  if (typeof value === 'object') {
    // expect { ar?: string, en?: string }
    const v = value[lang] ?? value[lang === 'ar' ? 'en' : 'ar'];
    return typeof v === 'string' ? v : '';
  }
  return String(value);
}
