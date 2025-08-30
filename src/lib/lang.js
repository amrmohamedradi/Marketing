export function canonLang(raw) {
  const v = (raw || 'ar').toLowerCase();
  return v.startsWith('ar') ? 'ar' : 'en';
}
