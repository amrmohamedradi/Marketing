import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";

type Lang = "ar" | "en";

type Dictionary = Record<string, { ar: string; en: string }>;

const dict: Dictionary = {
  our_services: { ar: "خدماتنا", en: "Our Services" },
  add_service: { ar: "إضافة خدمة", en: "Add Service" },
  service_name_placeholder: { ar: "اسم الخدمة (مثال: التسويق الرقمي)", en: "Service name (e.g., Digital Marketing)" },
  service_desc_placeholder: { ar: "وصف قصير", en: "Short description" },
  included_services: { ar: "الخدمات المضمنة", en: "INCLUDED SERVICES" },
  suggested: { ar: "مقترحات", en: "SUGGESTED" },
  add: { ar: "إضافة", en: "Add" },
  save: { ar: "حفظ", en: "Save" },
  cancel: { ar: "إلغاء", en: "Cancel" },
  edit: { ar: "تعديل", en: "Edit" },
  delete: { ar: "حذف", en: "Delete" },
  preview: { ar: "معاينة", en: "Preview" },
  logout: { ar: "تسجيل الخروج", en: "Logout" },
  heading_main: { ar: "أنشئ مواصفات خدمات احترافية", en: "Create Professional Service Specifications" },
  heading_desc: { ar: "ابنِ عروضًا تفصيلية وجذابة لعملائك بسهولة.", en: "Build beautiful, detailed proposals for your clients with our intuitive service specification builder." },
  preview_spec: { ar: "معاينة المواصفات", en: "Preview Specification" },
  complete_steps_hint: { ar: "أكمل بيانات العميل، أضف الخدمات، وحدد التسعير لتفعيل المعاينة", en: "Complete client details, add services, and set pricing to enable preview" },
  add_custom_item: { ar: "إضافة عنصر مخصص", en: "Add Custom Item" },
  subservice_name_ph: { ar: "اسم الخدمة الفرعية", en: "Sub-service name" },
  subservice_desc_ph: { ar: "وصف (اختياري)", en: "Description (optional)" },
  language: { ar: "اللغة", en: "Language" },
  switch_to_en: { ar: "English", en: "English" },
  switch_to_ar: { ar: "العربية", en: "Arabic" },
};

type I18nContextType = {
  lang: Lang;
  t: (key: keyof typeof dict) => string;
  toggle: () => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    const dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  const t = useCallback((key: keyof typeof dict) => {
    const entry = dict[key];
    if (!entry) return "";
    return entry[lang];
  }, [lang]);

  const value = useMemo(() => ({ lang, t, toggle: () => setLang((p) => (p === "ar" ? "en" : "ar")) }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}


