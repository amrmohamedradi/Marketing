import React from 'react';
import { clientFieldLabels, ClientFieldKey } from '@/lib/formMetadata';
import { deepCompact } from '@/lib/utils/deepCompact';
import { useI18n } from '@/lib/i18n';
import { i18nText } from '@/lib/i18nContent';
import { canonLang } from '@/lib/lang';
import { User, Building, Mail, Phone, FileText, MapPin, Globe, MessageCircle } from 'lucide-react';

interface ClientData {
  name?: string | { ar?: string; en?: string };
  company?: string | { ar?: string; en?: string };
  industry?: string;
  location?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  description?: string;
}

interface AboutClientProps {
  client: ClientData;
  isStandalone?: boolean; // Whether this is displayed as the main focus
}

const fieldIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  name: User,
  company: Building,
  industry: Building,
  location: MapPin,
  email: Mail,
  phone: Phone,
  whatsapp: MessageCircle,
  website: Globe,
  description: FileText
};

export function AboutClient({ client, isStandalone = false }: AboutClientProps) {
  const { t, currentLanguage } = useI18n();
  
  console.log('AboutClient received client data:', client);
  
  // Apply deepCompact to sanitize data
  const sanitizedClient = deepCompact(client) as ClientData;
  
  console.log('AboutClient sanitized client data:', sanitizedClient);
  
  if (!sanitizedClient || Object.keys(sanitizedClient).length === 0) {
    console.log('AboutClient: No client data to display');
    return null;
  }

  const renderValue = (key: string, value: string) => {
    switch (key) {
      case 'email':
        return (
          <a 
            href={`mailto:${value}`}
            className="underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-400/40 break-all"
          >
            {value}
          </a>
        );
      case 'phone': {
        // locale from i18n (must be the same on SSR & CSR)
        const loc = canonLang(currentLanguage);
        const phoneLabel = loc === 'ar' ? 'الهاتف' : 'Phone';
        
        // Keep the raw number as a STRING (do not Intl-format phone numbers)
        const phoneRaw = value;
        const phoneHref = `tel:${phoneRaw.replace(/\s+/g, '')}`;
        
        return (
          <section dir={loc === 'ar' ? 'rtl' : 'ltr'} lang={loc} className="phone-card">
            {/* number MUST be LTR regardless of page dir */}
            <a
              href={phoneHref}
              className="phone digits-ltr notranslate underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-400/40"
              dir="ltr"
              lang="en"
              aria-label={`${phoneLabel} ${phoneRaw}`}
            >
              <bdi>{phoneRaw}</bdi>
            </a>
          </section>
        );
      }
      case 'whatsapp':
        return (
          <a 
            href={`https://wa.me/${value.replace(/[^\d]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-400/40"
          >
            {value}
          </a>
        );
      case 'website': {
        const url = value.startsWith('http') ? value : `https://${value}`;
        return (
          <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:no-underline focus:outline-none focus:ring-2 focus:ring-blue-400/40 break-all"
          >
            {value}
          </a>
        );
      }
      default:
        return (
          <span className={key === 'description' ? 'leading-relaxed' : 'break-words'}>
            {value}
          </span>
        );
    }
  };

  const getFieldLabel = (key: string): string => {
    const labelKeys: Record<string, string> = {
      name: 'client_name',
      company: 'company',
      industry: 'industry',
      location: 'location',
      email: 'email_address',
      phone: 'phone_number',
      whatsapp: 'whatsapp',
      website: 'website',
      description: 'project_description'
    };
    return t(labelKeys[key] || key);
  };

  return (
    <section className={`card-neo p-6 no-motion-client ${isStandalone ? 'max-w-4xl mx-auto' : ''}`} aria-labelledby="about-client">
      <h2 id="about-client" className={`font-semibold mb-4 text-white ${
        isStandalone ? 'text-2xl text-center' : 'text-lg'
      }`}>{t('about_client')}</h2>

      <dl className={`gap-x-6 gap-y-4 ${
        isStandalone ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid grid-cols-1 md:grid-cols-2'
      }`}>
        {Object.entries(sanitizedClient).map(([key, value]) => {
          if (!value) return null;
          
          const Icon = fieldIcons[key];
          const label = getFieldLabel(key);
          
          // Convert i18n objects to strings using inline safe conversion - prevent React error #130
          const displayValue = typeof value === 'object' && value !== null
            ? (typeof value[currentLanguage as 'ar' | 'en'] === 'string' ? value[currentLanguage as 'ar' | 'en'] : '') ||
              (typeof value[currentLanguage === 'ar' ? 'en' : 'ar'] === 'string' ? value[currentLanguage === 'ar' ? 'en' : 'ar'] : '') ||
              ''
            : String(value || '');
          if (!displayValue) return null;

          return (
            <div key={key} className={`flex items-start gap-3 ${
              isStandalone ? 'bg-gray-800/50 p-4 rounded-lg border border-gray-700/50' : ''
            }`}>
              {Icon ? (
                <Icon className={`mt-0.5 h-4 w-4 opacity-75 text-blue-400 flex-shrink-0 ${
                  isStandalone ? 'h-5 w-5' : ''
                }`} aria-hidden="true" />
              ) : (
                <svg aria-hidden="true" className={`mt-0.5 h-4 w-4 opacity-75 text-blue-400 flex-shrink-0 ${
                  isStandalone ? 'h-5 w-5' : ''
                }`} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              )}
              <div className="min-w-0 flex-1">
                <dt className={`tracking-wide text-gray-400 uppercase mb-1 ${
                  isStandalone ? 'text-sm font-medium' : 'text-xs'
                }`}>
                  {label}
                </dt>
                <dd className={`font-medium text-white ${
                  isStandalone ? 'text-base' : 'text-sm'
                }`}>
                  {renderValue(key, displayValue)}
                </dd>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
