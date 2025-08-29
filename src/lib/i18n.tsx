import React, { createContext, useContext, ReactNode } from 'react';

interface I18nContextType {
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations: { [key: string]: { [lang: string]: string } } = {
  // Header & Navigation
  preview: { ar: 'معاينة', en: 'Preview' },
  logout: { ar: 'تسجيل الخروج', en: 'Logout' },
  home: { ar: 'الرئيسية', en: 'Home' },
  toggle_navigation_menu: { ar: 'تبديل قائمة التنقل', en: 'Toggle navigation menu' },
  
  // Main Page
  heading_main: { ar: 'إنشاء مواصفات الخدمات المهنية', en: 'Create Professional Service Specifications' },
  heading_desc: { ar: 'أنشئ عروض خدمات شاملة لعملائك بسهولة واحترافية', en: 'Easily and professionally create comprehensive service proposals for your clients.' },
  preview_spec: { ar: 'معاينة المواصفات', en: 'Preview Specification' },
  complete_steps_hint: { ar: 'يرجى إكمال جميع الحقول المطلوبة لمعاينة المواصفات', en: 'Please complete all required fields to preview the specification' },
  
  // Login Form
  welcome_back: { ar: 'مرحباً بعودتك', en: 'Welcome Back' },
  sign_in_desc: { ar: 'سجل الدخول لإنشاء مواصفات خدمات جميلة لعملائك', en: 'Sign in to create beautiful service specifications for your clients' },
  sign_in: { ar: 'تسجيل الدخول', en: 'Sign In' },
  sign_in_desc_card: { ar: 'استخدم أي بيانات اعتماد للوصول إلى العرض التوضيحي', en: 'Use any credentials to access the demo' },
  email: { ar: 'البريد الإلكتروني', en: 'Email' },
  email_placeholder: { ar: 'demo@servicespec.com', en: 'demo@servicespec.com' },
  password: { ar: 'كلمة المرور', en: 'Password' },
  password_placeholder: { ar: 'أدخل أي كلمة مرور', en: 'Enter any password' },
  signing_in: { ar: 'جاري تسجيل الدخول...', en: 'Signing In...' },
  demo_notice: { ar: 'هذا تطبيق تجريبي. استخدم أي بريد إلكتروني وكلمة مرور للمتابعة.', en: 'This is a demo app. Use any email and password to proceed.' },
  
  // Client Details
  client_details: { ar: 'تفاصيل العميل', en: 'Client Details' },
  client_name: { ar: 'اسم العميل', en: 'Client Name' },
  client_name_placeholder: { ar: 'أدخل الاسم الكامل للعميل', en: 'Enter client\'s full name' },
  company: { ar: 'الشركة', en: 'Company' },
  company_placeholder: { ar: 'اسم الشركة أو المؤسسة', en: 'Company or Organization Name' },
  phone: { ar: 'الهاتف', en: 'Phone' },
  phone_placeholder: { ar: '+1 (555) 123-4567', en: '+1 (555) 123-4567' },
  project_description: { ar: 'وصف المشروع', en: 'Project Description' },
  project_description_placeholder: { ar: 'وصف مختصر للمشروع أو المتطلبات...', en: 'Brief description of the project or requirements...' },
  
  // Services
  services: { ar: 'الخدمات', en: 'Services' },
  our_services: { ar: 'خدماتنا', en: 'Our Services' },
  add_service: { ar: 'إضافة خدمة', en: 'Add Service' },
  service_name: { ar: 'اسم الخدمة', en: 'Service Name' },
  service_name_placeholder: { ar: 'اسم الخدمة (مثال: التسويق الرقمي)', en: 'Service Name (e.g., Digital Marketing)' },
  service_description: { ar: 'وصف الخدمة', en: 'Service Description' },
  service_description_placeholder: { ar: 'وصف مختصر', en: 'Brief description' },
  add_sub_service: { ar: 'إضافة خدمة فرعية', en: 'Add Sub-Service' },
  sub_service_name: { ar: 'اسم الخدمة الفرعية', en: 'Sub-Service Name' },
  sub_service_name_placeholder: { ar: 'أدخل اسم الخدمة الفرعية', en: 'Enter sub-service name' },
  sub_service_description: { ar: 'وصف الخدمة الفرعية', en: 'Sub-Service Description' },
  sub_service_description_placeholder: { ar: 'أدخل وصف الخدمة الفرعية', en: 'Enter sub-service description' },
  subservice_name_ph: { ar: 'أدخل اسم الخدمة الفرعية', en: 'Enter sub-service name' },
  subservice_desc_ph: { ar: 'أدخل وصف الخدمة الفرعية', en: 'Enter sub-service description' },
  edit: { ar: 'تعديل', en: 'Edit' },
  delete: { ar: 'حذف', en: 'Delete' },
  save: { ar: 'حفظ', en: 'Save' },
  cancel: { ar: 'إلغاء', en: 'Cancel' },
  items: { ar: 'عنصر', en: 'Item' },
  custom: { ar: 'خاص', en: 'Custom' },
  included_items: { ar: 'العناصر المدرجة', en: 'Included Items' },
  included_services: { ar: 'الخدمات المدرجة', en: 'Included Services' },
  suggested: { ar: 'مقترح', en: 'Suggested' },
  suggested_items: { ar: 'العناصر المقترحة', en: 'Suggested Items' },
  add: { ar: 'إضافة', en: 'Add' },
  
  // Default Services
  programming: { ar: 'البرمجة', en: 'Programming' },
  marketing: { ar: 'التسويق', en: 'Marketing' },
  photo_editing: { ar: 'التحرير والتصوير', en: 'Photo Editing' },
  
  // Suggested Items for Marketing
  instagram_posts: { ar: 'منشورات انستغرام', en: 'Instagram Posts' },
  monthly_content_plan: { ar: 'خطة محتوى شهرية', en: 'Monthly Content Plan' },
  reels_10: { ar: '10 ريلز', en: '10 Reels' },
  short_video_edits: { ar: 'تعديلات فيديو قصيرة', en: 'Short Video Edits' },
  facebook_ads: { ar: 'إعلانات فيسبوك', en: 'Facebook Ads' },
  setup_optimization: { ar: 'إعداد وتحسين', en: 'Setup & Optimization' },
  reports: { ar: 'تقارير', en: 'Reports' },
  monthly_performance_report: { ar: 'تقرير الأداء الشهري', en: 'Monthly Performance Report' },
  
  // Suggested Items for Photo Editing
  product_photos: { ar: 'صور المنتجات', en: 'Product Photos' },
  lighting_editing: { ar: 'إضاءة وتعديل', en: 'Lighting & Editing' },
  portrait_editing: { ar: 'تعديل الصور الشخصية', en: 'Portrait Edits' },
  skin_color_grading: { ar: 'تدرج البشرة والألوان', en: 'Skin & Color Grading' },
  feature_videos: { ar: 'مقاطع فيديو مميزة', en: 'Feature Videos' },
  sixty_ninety_sec_edits: { ar: 'تعديلات 60-90 ثانية', en: '60-90 Sec Edits' },
  delivery: { ar: 'تسليم', en: 'Delivery' },
  web_ready_export: { ar: 'تصدير جاهز للويب', en: 'Web-Ready Export' },
  
  // Suggested Items for Programming
  frontend_ui: { ar: 'واجهة المستخدم الأمامية', en: 'Frontend UI' },
  responsive_react_screens: { ar: 'شاشات React متجاوبة', en: 'Responsive React Screens' },
  api_endpoints: { ar: 'نقاط نهاية API', en: 'API Endpoints' },
  rest_graphql: { ar: 'REST/GraphQL', en: 'REST/GraphQL' },
  database_schema: { ar: 'مخطط قاعدة البيانات', en: 'Database Schema' },
  design_migration: { ar: 'تصميم وترحيل', en: 'Design & Migration' },
  documentation: { ar: 'وثائق', en: 'Documentation' },
  setup_usage_notes: { ar: 'ملاحظات الإعداد والاستخدام', en: 'Setup & Usage Notes' },
  click_to_add_item_hint: { ar: 'انقر على أي عنصر لإضافته إلى خدمتك', en: 'Click any item to add it to your service' },
  
  // Generic Suggested Items
  discovery: { ar: 'اكتشاف', en: 'Discovery' },
  goals_requirements: { ar: 'الأهداف والمتطلبات', en: 'Goals & Requirements' },
  implementation: { ar: 'تنفيذ', en: 'Implementation' },
  core_deliverable: { ar: 'التسليم الأساسي', en: 'Core Deliverable' },
  quality_assurance: { ar: 'ضمان الجودة', en: 'Quality Assurance' },
  testing_fixes: { ar: 'اختبار وإصلاحات', en: 'Testing & Fixes' },
  
  // Support & Benefits
  support_benefits: { ar: 'الدعم والمزايا', en: 'Support & Benefits' },
  support_benefits_desc: { ar: 'كل ما تحصل عليه عند العمل معنا', en: 'All you get when working with us' },
  support_24_7: { ar: 'الدعم 24/7', en: '24/7 Support' },
  support_24_7_desc: { ar: 'مساعدة مستمرة طوال الوقت عندما تحتاج المساعدة', en: 'Continuous assistance whenever you need help' },
  quality_guarantee: { ar: 'ضمان الجودة', en: 'Quality Guarantee' },
  quality_guarantee_desc: { ar: 'ضمان رضا 100% على جميع التسليمات', en: '100% satisfaction guarantee on all deliverables' },
  on_time_delivery: { ar: 'التسليم في الوقت المحدد', en: 'On-Time Delivery' },
  on_time_delivery_desc: { ar: 'التسليم الدقيق حسب الموعد المتفق عليه', en: 'Accurate delivery according to the agreed schedule' },
  dedicated_team: { ar: 'فريق مخصص', en: 'Dedicated Team' },
  dedicated_team_desc: { ar: 'فريق من المتخصصين المعتمدين لمشروعك', en: 'A team of certified specialists for your project' },
  secure_process: { ar: 'عملية آمنة', en: 'Secure Process' },
  secure_process_desc: { ar: 'أمان وسرية على مستوى المؤسسات', en: 'Enterprise-level security and confidentiality' },
  fast_turnaround: { ar: 'استجابة سريعة', en: 'Fast Turnaround' },
  fast_turnaround_desc: { ar: 'تكرارات سريعة وتواصل متجاوب', en: 'Rapid iterations and responsive communication' },
  
  // Pricing
  pricing: { ar: 'التسعير', en: 'Pricing' },
  base_price: { ar: 'السعر الأساسي', en: 'Base Price' },
  currency: { ar: 'العملة', en: 'Currency' },
  select_currency: { ar: 'اختر العملة', en: 'Select Currency' },
  additional_items: { ar: 'العناصر الإضافية', en: 'Additional Items' },
  item_description: { ar: 'الوصف', en: 'Description' },
  item_description_placeholder: { ar: 'مثال: مراجعات إضافية، دعم متميز', en: 'e.g., Extra revisions, premium support' },
  amount: { ar: 'المبلغ', en: 'Amount' },
  add_item: { ar: 'إضافة عنصر', en: 'Add Item' },
  total_price: { ar: 'السعر الإجمالي', en: 'Total Price' },
  additional_notes: { ar: 'ملاحظات إضافية', en: 'Additional Notes' },
  price_notes_placeholder: { ar: 'شروط الدفع والشروط أو معلومات تسعير إضافية...', en: 'Payment terms & conditions or additional pricing information...' },
  
  // Preview Modal
  service_specification: { ar: 'مواصفات الخدمة', en: 'Service Specification' },
  share: { ar: 'مشاركة', en: 'Share' },
  export: { ar: 'تصدير', en: 'Export' },
  service_proposal: { ar: 'عرض الخدمة', en: 'Service Proposal' },
  prepared_for: { ar: 'أُعد لـ', en: 'Prepared for' },
  your_client: { ar: 'عميلك', en: 'Your Client' },
  generated_on: { ar: 'تم إنشاؤه في', en: 'Generated on' },
  client_information: { ar: 'معلومات العميل', en: 'Client Information' },
  name: { ar: 'الاسم', en: 'Name' },
  services_included: { ar: 'الخدمات المدرجة', en: 'Services Included' },
  service: { ar: 'خدمة', en: 'Service' },
  investment: { ar: 'الاستثمار', en: 'Investment' },
  total_investment: { ar: 'إجمالي الاستثمار', en: 'Total Investment' },
  all_prices_in: { ar: 'جميع الأسعار بـ', en: 'All prices in' },
  terms_conditions: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
  proposal_valid: { ar: 'هذا العرض صالح لمدة 30 يوماً من تاريخ الإنشاء.', en: 'This proposal is valid for 30 days from the date of creation.' },
  generated_with: { ar: 'MarketingCorner - ركن التسويق', en: 'MarketingCorner - Service Spec Maker' },
  marketing_corner_logo_text: { ar: 'ماركتنج كورنر', en: 'Marketing Corner' },
  go_to_dashboard: { ar: 'الذهاب إلى لوحة التحكم', en: 'Go to Dashboard' },
  
  // Currency Labels
  usd_label: { ar: 'دولار أمريكي ($)', en: 'USD ($)' },
  eur_label: { ar: 'يورو (€)', en: 'EUR (€)' },
  gbp_label: { ar: 'جنيه إسترليني (£)', en: 'GBP (£)' },
  cad_label: { ar: 'دولار كندي (C$)', en: 'CAD (C$)' },
  aud_label: { ar: 'دولار أسترالي (A$)', en: 'AUD (A$)' },
  
  // Arabic Currencies
  aed_label: { ar: 'درهم إماراتي (د.إ)', en: 'UAE Dirham (AED)' },
  sar_label: { ar: 'ريال سعودي (ر.س)', en: 'Saudi Riyal (SAR)' },
  qar_label: { ar: 'ريال قطري (ر.ق)', en: 'Qatari Riyal (QAR)' },
  kwd_label: { ar: 'دينار كويتي (د.ك)', en: 'Kuwaiti Dinar (KWD)' },
  egp_label: { ar: 'جنيه مصري (ج.م)', en: 'Egyptian Pound (EGP)' },
  
  // Support Items
  support_24_7_title: { ar: 'دعم 24/7', en: '24/7 Support' },
  support_24_7_description: { ar: 'مساعدة مستمرة طوال الوقت عندما تحتاج المساعدة', en: 'Continuous assistance whenever you need help' },
  quality_guarantee_title: { ar: 'ضمان الجودة', en: 'Quality Guarantee' },
  quality_guarantee_description: { ar: 'ضمان رضا 100% على جميع التسليمات', en: '100% satisfaction guarantee on all deliverables' },
  on_time_delivery_title: { ar: 'التسليم في الوقت المحدد', en: 'On-Time Delivery' },
  on_time_delivery_description: { ar: 'التسليم الدقيق حسب الموعد المتفق عليه', en: 'Accurate delivery according to the agreed schedule' },
  dedicated_team_title: { ar: 'فريق مخصص', en: 'Dedicated Team' },
  dedicated_team_description: { ar: 'فريق من المتخصصين المعتمدين لمشروعك', en: 'A team of certified specialists for your project' },
  secure_process_title: { ar: 'عملية آمنة', en: 'Secure Process' },
  secure_process_description: { ar: 'أمان وسرية على مستوى المؤسسات', en: 'Enterprise-level security and confidentiality' },
  fast_turnaround_title: { ar: 'استجابة سريعة', en: 'Fast Turnaround' },
  fast_turnaround_description: { ar: 'تكرارات سريعة وتواصل متجاوب', en: 'Rapid iterations and responsive communication' },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = React.useState('ar');

  React.useEffect(() => {
    document.documentElement.setAttribute("dir", currentLanguage === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute("lang", currentLanguage);
  }, [currentLanguage]);

  const t = (key: string): string => {
    const translation = translations[key];
    return translation ? translation[currentLanguage] || key : key;
  };

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
  };

  return (
    <I18nContext.Provider value={{ t, changeLanguage, currentLanguage }}>
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


