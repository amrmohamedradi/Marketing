import React from 'react';
import { motion } from "framer-motion";
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useI18n } from '@/lib/i18n';
import { canonLang } from '@/lib/lang';
import { i18nText } from "@/lib/i18nText";
import { useAutoTranslateMissing } from '@/hooks/useAutoTranslateMissing';
import { CheckCircle, LucideIcon } from 'lucide-react';

interface SubService {
  id?: string;
  name?: string | { ar?: string; en?: string };
  key?: string;  // Case B: slug/key format
  description?: string | { ar?: string; en?: string };
}

interface ServiceItem {
  id?: string;
  text?: string | { ar?: string; en?: string };
  name?: string | { ar?: string; en?: string };
  label?: string | { ar?: string; en?: string };
  key?: string;  // Case B: slug/key format
}

interface Service {
  id?: string;
  // Case A: raw English strings
  name?: string | { ar?: string; en?: string };
  title?: string | { ar?: string; en?: string };
  description?: string | { ar?: string; en?: string };
  // Case A: category as raw English string
  category?: string | { ar?: string; en?: string };
  // Case B: categoryKey as slug/key
  categoryKey?: string;
  icon?: LucideIcon;
  subServices?: SubService[];
  items?: ServiceItem[];
}

interface ServicesProps {
  services: Service[];
}

export function Services({ services }: ServicesProps) {
  const { ref, isVisible } = useRevealOnScroll();
  const { t, currentLanguage } = useI18n();
  
  // Canonicalize language from the same source as UI labels
  const lang = canonLang(currentLanguage);
  const loc = lang?.startsWith('ar') ? 'ar' : 'en';

  // Optional tiny dictionary for common labels (extend only if needed)
  const DICT: Record<string, { ar: string; en?: string }> = {
    Programming: { ar: 'البرمجة' },
    Documentation: { ar: 'التوثيق' },
    'Frontend UI': { ar: 'واجهة المستخدم' },
    Includes: { ar: 'ما يشمله' },
    'Web Development': { ar: 'تطوير الويب' },
    'Mobile Development': { ar: 'تطوير التطبيقات' },
    'Backend Development': { ar: 'تطوير الخادم' },
    'API Integration': { ar: 'تكامل واجهات برمجة التطبيقات' },
    'Database Design': { ar: 'تصميم قواعد البيانات' },
    'UI/UX Design': { ar: 'تصميم واجهة المستخدم' },
    'Quality Assurance': { ar: 'ضمان الجودة' },
    'Testing': { ar: 'الاختبار' },
    'Maintenance': { ar: 'الصيانة' },
    'Support': { ar: 'الدعم' },
    'Security': { ar: 'الأمان' },
    'Performance': { ar: 'الأداء' },
  };

  // Fallback token translator for unseen English phrases (zero-deps)
  function tokenFallback(label?: string) {
    if (!label || loc !== 'ar') return label || '';
    const TOKEN: Record<string, string> = {
      programming: 'البرمجة',
      documentation: 'التوثيق',
      'frontend': 'واجهة أمامية',
      'ui': 'واجهة المستخدم',
      backend: 'باك-إند',
      integration: 'تكامل',
      api: 'واجهات برمجة التطبيقات',
      security: 'أمن',
      performance: 'الأداء',
      testing: 'اختبار',
      support: 'دعم',
      web: 'ويب',
      mobile: 'محمول',
      database: 'قاعدة بيانات',
      design: 'تصميم',
      maintenance: 'صيانة',
      quality: 'جودة',
      assurance: 'ضمان',
      development: 'تطوير',
    };
    const clean = label.trim();

    // exact dictionary hit
    if (DICT[clean]) return DICT[clean].ar || clean;

    // split on separators, keep them
    return clean.split(/([\/#,&|\-+]+)/).map(seg => {
      if (/^[\/#,&|\-+]+$/.test(seg)) return seg;
      const spaced = seg.replace(/([a-z])([A-Z])/g, '$1 $2'); // FrontendUI -> Frontend UI
      return spaced.split(/\s+/).map(tok => {
        const low = tok.toLowerCase();
        if (TOKEN[low]) return TOKEN[low];
        if (['ui','api'].includes(low)) return TOKEN[low] || tok;
        return tok; // unknown: keep as-is
      }).join(' ');
    }).join(' ');
  }

  // Main resolver that works for A/B/C
  function L(value: any, tPrefix?: string) {
    // C: multilingual object
    if (value && typeof value === 'object') {
      const v = value[loc] ?? value.en ?? '';
      return v ? v : '';
    }
    // B: slug/key -> prefer i18n key, fallback tokens
    if (typeof value === 'string' && /^[a-z0-9._-]+$/.test(value)) {
      const key = tPrefix ? `${tPrefix}.${value}` : value;
      const viaT = typeof t === 'function' ? t(key) : undefined;
      if (viaT && viaT !== key) return viaT;
      return tokenFallback(value);
    }
    // A: raw English label -> dict or token fallback
    if (typeof value === 'string') {
      // try i18n with a normalized key if provided
      if (tPrefix) {
        const norm = value.toLowerCase().replace(/\s+/g, '_');
        const viaT = typeof t === 'function' ? t(`${tPrefix}.${norm}`) : undefined;
        if (viaT && viaT !== `${tPrefix}.${norm}`) return viaT;
      }
      // DICT or token fallback
      if (loc === 'ar' && DICT[value]?.ar) return DICT[value].ar;
      return tokenFallback(value);
    }
    return value ?? '';
  }

  // OPTIONAL: auto-translate missing sides via server endpoint (disabled - no API available)
  const data = useAutoTranslateMissing(services, lang, { enable: false });

  const hasValidServices = data.some(service => {
    const serviceName = L(service.name || service.title || service.category || service.categoryKey);
    return serviceName?.trim() || (service.subServices && service.subServices.length > 0) || (service.items && service.items.length > 0);
  });

  if (!hasValidServices) return null;

  return (
    <section 
      key={lang}
      ref={ref}
      dir={loc === 'ar' ? 'rtl' : 'ltr'} 
      lang={loc}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-8 text-center text-white">
          {typeof t === 'function' ? t('our_services') : (loc === 'ar' ? 'خدماتنا' : 'Our Services')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.filter(service => {
            const items = service.items || [];
            const subServices = service.subServices || [];
            return items.length > 0 || subServices.length > 0; // Only show services with items
          }).map((service, index) => {
            // Use unified resolver L() for service name - handles A/B/C cases
            const serviceName = L(service.category ?? service.categoryKey ?? service.name ?? service.title, 'services.categories');

            const Icon = service.icon;

            // ✅ Guard dynamic component rendering - prevent React error #130
            if (Icon && typeof Icon !== 'function') {
              console.error('Invalid icon component in Services', { Icon, service });
            }

            return (
              <article
                key={service.id || service.category || service.categoryKey || index}
                className="service-card-neo p-6 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 hover:shadow-xl hover:-translate-y-2 hover:bg-white/5 transition-all duration-300 group"
                tabIndex={0}
                role="article"
                aria-label={`Service: ${serviceName}`}
              >
                <div className="flex items-start space-x-4 mb-4">
                  {Icon && typeof Icon === 'function' && (
                    <div className="flex-shrink-0 p-2 bg-white/10 rounded-lg 
                                  group-hover:bg-blue-500/20 group-hover:shadow-lg transition-all duration-300">
                      <Icon className="h-6 w-6 text-white 
                                     group-hover:scale-110 group-hover:text-blue-300 transition-all duration-300" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2 
                                 group-hover:text-blue-300 transition-colors duration-300">
                      {serviceName}
                    </h3>
                  </div>
                </div>

                {/* Render items (new bilingual structure) or subServices (legacy) */}
                {((service.items && service.items.length > 0) || (service.subServices && service.subServices.length > 0)) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                      {L('Includes', 'services.meta') /* label if needed */}
                    </h4>
                    <ul className="mt-3 grid gap-2">
                      {/* Case A/B/C all resolved via L() */}
                      {service.items && service.items.map((item: any, itemIndex: number) => {
                        // Use unified resolver for item text - handles A/B/C cases
                        const itemText = L(item.label ?? item.name ?? item.key ?? item.text ?? item, 'services.items');
                        
                        if (!itemText) return null;
                        
                        return (
                          <li
                            key={item.id || item.key || itemIndex}
                            className="group/item relative flex items-start gap-2 rounded-lg px-3 py-2
                                     text-white/90
                                     transition-all duration-200
                                     hover:bg-white/10 hover:translate-x-1 hover:shadow-md
                                     focus-within:bg-white/10 focus-within:translate-x-1 focus-within:shadow-md"
                            style={{ transitionDelay: `${itemIndex * 50}ms` }}
                            tabIndex={0}
                            role="listitem"
                            aria-label={itemText}
                          >
                            <svg 
                              aria-hidden="true"
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400
                                       transition-transform duration-200
                                       group-hover/item:scale-110 group-hover/item:rotate-6
                                       group-focus-within/item:scale-110 group-focus-within/item:rotate-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path 
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-sm leading-relaxed">{itemText}</span>
                          </li>
                        );
                      })}
                      
                      {/* Fallback to legacy subServices structure ONLY when items are absent */}
                      {(!service.items || service.items.length === 0) && service.subServices && service.subServices.map((subService, subIndex) => {
                        // Use unified resolver for subService name - handles A/B/C cases
                        const subServiceName = L(subService.name ?? subService.key ?? subService, 'services.items');
                        
                        if (!subServiceName) return null;
                        
                        return (
                        <li
                          key={subService.id || subService.key || subIndex}
                          className="group/item relative flex items-start gap-2 rounded-lg px-3 py-2
                                   text-white/90
                                   transition-all duration-200
                                   hover:bg-white/10 hover:translate-x-1 hover:shadow-md
                                   focus-within:bg-white/10 focus-within:translate-x-1 focus-within:shadow-md"
                          style={{ transitionDelay: `${subIndex * 50}ms` }}
                          tabIndex={0}
                          role="listitem"
                          aria-label={subServiceName}
                        >
                          {/* Sparkle/star icon */}
                          <svg 
                            aria-hidden="true"
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400
                                     transition-transform duration-200
                                     group-hover/item:scale-110 group-hover/item:rotate-6
                                     group-focus-within/item:scale-110 group-focus-within/item:rotate-6
                                     drop-shadow-[0_0_6px_rgba(59,130,246,0.35)]"
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                          >
                            <path d="M12 3l1.6 4.7L18 9.3l-4.4 1.6L12 16l-1.6-5.1L6 9.3l4.4-1.6L12 3z"/>
                          </svg>

                          <div className="leading-relaxed">
                            <span className="text-sm font-medium">{subServiceName}</span>
                          </div>

                          {/* Subtle glow ring on hover */}
                          <span 
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 rounded-lg
                                     ring-0 ring-blue-400/30
                                     group-hover/item:ring-1 group-focus-within/item:ring-1
                                     transition duration-200"
                          />
                        </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LangDebug({ services, lang }: { services: Service[], lang: string }) {
  if (typeof window === 'undefined') return null;
  const missing = services.reduce((n, s) => {
    const title = s?.title;
    const missTitle = title && typeof title === 'object' && !title[lang] && (title.ar || title.en);
    const missItems = (s.items || []).filter(it => {
      const t = it?.text;
      return t && typeof t === 'object' && (t.ar || t.en) && !t[lang];
    }).length;
    return n + (missTitle ? 1 : 0) + missItems;
  }, 0);
  return (
    <div style={{ position: 'fixed', bottom: 12, right: 12, fontSize: 12, opacity: .7, background: 'rgba(0,0,0,0.8)', color: 'white', padding: '4px 8px', borderRadius: '4px' }}>
      <div>Lang: {lang} | Fields using fallback: {missing}</div>
    </div>
  );
}
