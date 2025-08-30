// Comprehensive English translations for service terms
export const serviceTranslations = {
  // Main service titles
  'البرمجة': 'Programming',
  'التسويق': 'Marketing', 
  'التصميم': 'Design',
  'التحرير والتصوير': 'Photo Editing',
  'تطوير المواقع': 'Web Development',
  'إدارة المشاريع': 'Project Management',
  'الاستشارات': 'Consulting',
  'التدريب': 'Training',
  'وثائق': 'Documentation',
  'مخطط قاعدة البيانات': 'Database Schema',
  'API نقاط بيانية': 'API Endpoints',
  'نقاط نهاية API': 'API Endpoints',
  'واجهة المستخدم الأمامية': 'Frontend Interface',
  'شاشات React متجاوبة': 'Responsive React Screens',
  'متجاوبة React شاشات': 'Responsive React Screens',
  'تصميم وتطبيق': 'Design and Implementation',
  'ملحقات الإيجاد والاستخدام': 'Search and Usage Extensions',
  'REST/GraphQL': 'REST/GraphQL',
  'تصميم وتطبيق': 'Design and Implementation',
  'متجاوبة': 'Responsive',
  'شاشات': 'Screens',
  'نقاط بيانية': 'Data Points',
  'واجهة': 'Interface',
  'المستخدم': 'User',
  'الأمامية': 'Frontend',
  'قاعدة البيانات': 'Database',
  'مخطط': 'Schema',
  
  // Exact terms from the interface
  'ملحقات الإيجاد والاستخدام': 'Search and Usage Extensions',
  'API نقطة بيانية': 'API Endpoint',
  'واجهة المستخدم الأمامية': 'Frontend User Interface',
  'متجاوبة React شاشات': 'Responsive React Screens',
  
  // Additional terms from the interface
  'ملاحظات الإعداد والاستخدام': 'Setup & Usage Notes',
  'تصميم وترحيل': 'Design & Migration',
  
  // Programming sub-services
  'تطوير التطبيقات': 'App Development',
  'تطوير مواقع الويب': 'Website Development',
  'برمجة قواعد البيانات': 'Database Programming',
  'تطوير واجهات برمجة التطبيقات': 'API Development',
  'اختبار البرمجيات': 'Software Testing',
  'صيانة الأنظمة': 'System Maintenance',
  'أمان المعلومات': 'Information Security',
  'الحوسبة السحابية': 'Cloud Computing',
  
  // Marketing sub-services
  'إدارة وسائل التواصل الاجتماعي': 'Social Media Management',
  'تحسين محركات البحث': 'SEO Optimization',
  'الإعلانات المدفوعة': 'Paid Advertising',
  'كتابة المحتوى': 'Content Writing',
  'التسويق بالبريد الإلكتروني': 'Email Marketing',
  'تحليل البيانات': 'Data Analysis',
  'استراتيجية التسويق': 'Marketing Strategy',
  'العلامة التجارية': 'Branding',
  
  // Design sub-services
  'تصميم واجهة المستخدم': 'UI Design',
  'تصميم تجربة المستخدم': 'UX Design',
  'تصميم الشعارات': 'Logo Design',
  'تصميم المطبوعات': 'Print Design',
  'تصميم المواقع': 'Web Design',
  'الرسوم المتحركة': 'Animation',
  'التصميم الجرافيكي': 'Graphic Design',
  'تصميم الهوية البصرية': 'Visual Identity Design',
  
  // Photo/Video sub-services
  'التصوير الفوتوغرافي': 'Photography',
  'المونتاج': 'Video Editing',
  'تصوير المنتجات': 'Product Photography',
  'التصوير الاحترافي': 'Professional Photography',
  'معالجة الصور': 'Image Processing',
  'إنتاج الفيديو': 'Video Production',
  'التصوير السينمائي': 'Cinematography',
  'الصوتيات': 'Audio Production',
  
  // General sub-services
  'الدعم الفني': 'Technical Support',
  'خدمة العملاء': 'Customer Service',
  'إدارة المحتوى': 'Content Management',
  'التحليل والتقارير': 'Analytics & Reporting',
  'الاستشارة الفنية': 'Technical Consulting',
  'التدريب والتطوير': 'Training & Development',
  'ضمان الجودة': 'Quality Assurance',
  'الصيانة والدعم': 'Maintenance & Support'
};

// Pre-compiled translation map for O(1) lookup
const translationMap = new Map(Object.entries(serviceTranslations));

export function translateArabicToEnglish(arabicText) {
  if (!arabicText || typeof arabicText !== 'string') return arabicText;
  return translationMap.get(arabicText) || arabicText;
}
