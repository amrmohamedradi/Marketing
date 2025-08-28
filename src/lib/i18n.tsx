import React, { createContext, useContext, ReactNode } from 'react';

interface I18nContextType {
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  // Header & Navigation
  preview: 'معاينة',
  logout: 'تسجيل الخروج',
  
  // Main Page
  heading_main: 'إنشاء مواصفات الخدمات المهنية',
  heading_desc: 'أنشئ عروض خدمات شاملة لعملائك بسهولة واحترافية',
  preview_spec: 'معاينة المواصفات',
  complete_steps_hint: 'يرجى إكمال جميع الحقول المطلوبة لمعاينة المواصفات',
  
  // Login Form
  welcome_back: 'مرحباً بعودتك',
  sign_in_desc: 'سجل الدخول لإنشاء مواصفات خدمات جميلة لعملائك',
  sign_in: 'تسجيل الدخول',
  sign_in_desc_card: 'استخدم أي بيانات اعتماد للوصول إلى العرض التوضيحي',
  email: 'البريد الإلكتروني',
  email_placeholder: 'demo@servicespec.com',
  password: 'كلمة المرور',
  password_placeholder: 'أدخل أي كلمة مرور',
  signing_in: 'جاري تسجيل الدخول...',
  demo_notice: 'هذا تطبيق تجريبي. استخدم أي بريد إلكتروني وكلمة مرور للمتابعة.',
  
  // Client Details
  client_details: 'تفاصيل العميل',
  client_name: 'اسم العميل',
  client_name_placeholder: 'أدخل الاسم الكامل للعميل',
  company: 'الشركة',
  company_placeholder: 'اسم الشركة أو المؤسسة',
  phone: 'الهاتف',
  phone_placeholder: '+1 (555) 123-4567',
  project_description: 'وصف المشروع',
  project_description_placeholder: 'وصف مختصر للمشروع أو المتطلبات...',
  
  // Services
  services: 'الخدمات',
  our_services: 'خدماتنا',
  add_service: 'إضافة خدمة',
  service_name: 'اسم الخدمة',
  service_name_placeholder: 'اسم الخدمة (مثال: التسويق الرقمي)',
  service_description: 'وصف الخدمة',
  service_description_placeholder: 'وصف مختصر',
  add_sub_service: 'إضافة خدمة فرعية',
  sub_service_name: 'اسم الخدمة الفرعية',
  sub_service_name_placeholder: 'أدخل اسم الخدمة الفرعية',
  sub_service_description: 'وصف الخدمة الفرعية',
  sub_service_description_placeholder: 'أدخل وصف الخدمة الفرعية',
  subservice_name_ph: 'أدخل اسم الخدمة الفرعية',
  subservice_desc_ph: 'أدخل وصف الخدمة الفرعية',
  edit: 'تعديل',
  delete: 'حذف',
  save: 'حفظ',
  cancel: 'إلغاء',
  items: 'عنصر',
  custom: 'خاص',
  included_items: 'العناصر المدرجة',
  included_services: 'الخدمات المدرجة',
  suggested: 'مقترح',
  add: 'إضافة',
  
  // Default Services
  programming: 'البرمجة',
  marketing: 'التسويق',
  photo_editing: 'التحرير والتصوير',
  
  // Support & Benefits
  support_benefits: 'الدعم والمزايا',
  support_benefits_desc: 'كل ما تحصل عليه عند العمل معنا',
  support_24_7: 'الدعم 24/7',
  support_24_7_desc: 'مساعدة مستمرة طوال الوقت عندما تحتاج المساعدة',
  quality_guarantee: 'ضمان الجودة',
  quality_guarantee_desc: 'ضمان رضا 100% على جميع التسليمات',
  on_time_delivery: 'التسليم في الوقت المحدد',
  on_time_delivery_desc: 'التسليم الدقيق حسب الموعد المتفق عليه',
  dedicated_team: 'فريق مخصص',
  dedicated_team_desc: 'فريق من المتخصصين المعتمدين لمشروعك',
  secure_process: 'عملية آمنة',
  secure_process_desc: 'أمان وسرية على مستوى المؤسسات',
  fast_turnaround: 'استجابة سريعة',
  fast_turnaround_desc: 'تكرارات سريعة وتواصل متجاوب',
  
  // Pricing
  pricing: 'التسعير',
  base_price: 'السعر الأساسي',
  currency: 'العملة',
  select_currency: 'اختر العملة',
  additional_items: 'العناصر الإضافية',
  item_description: 'الوصف',
  item_description_placeholder: 'مثال: مراجعات إضافية، دعم متميز',
  amount: 'المبلغ',
  add_item: 'إضافة عنصر',
  total_price: 'السعر الإجمالي',
  additional_notes: 'ملاحظات إضافية',
  price_notes_placeholder: 'شروط الدفع والشروط أو معلومات تسعير إضافية...',
  
  // Preview Modal
  service_specification: 'مواصفات الخدمة',
  share: 'مشاركة',
  export: 'تصدير',
  service_proposal: 'عرض الخدمة',
  prepared_for: 'أُعد لـ',
  your_client: 'عميلك',
  generated_on: 'تم إنشاؤه في',
  client_information: 'معلومات العميل',
  name: 'الاسم',
  services_included: 'الخدمات المدرجة',
  service: 'خدمة',
  investment: 'الاستثمار',
  total_investment: 'إجمالي الاستثمار',
  all_prices_in: 'جميع الأسعار بـ',
  terms_conditions: 'الشروط والأحكام',
  proposal_valid: 'هذا العرض صالح لمدة 30 يوماً من تاريخ الإنشاء.',
  generated_with: 'MarketingCorner - ركن التسويق',
  
  // Currency Labels
  usd_label: 'دولار أمريكي ($)',
  eur_label: 'يورو (€)',
  gbp_label: 'جنيه إسترليني (£)',
  cad_label: 'دولار كندي (C$)',
  aud_label: 'دولار أسترالي (A$)',
  
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Set Arabic as the only language and RTL direction
  React.useEffect(() => {
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
  }, []);

  const t = (key: string): string => {
    return translations[key as keyof typeof translations] || key;
  };

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within a LanguageProvider');
  }
  return context;
}


