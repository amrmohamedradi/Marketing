import React from 'react';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import { useI18n } from '@/lib/i18n';
import { canonLang } from '@/lib/lang';
import { Mail, Phone, Facebook, Instagram, Linkedin, Twitter, ExternalLink } from 'lucide-react';

interface ContactCompanyProps {
  email?: string;
  phone?: string;
  website?: string;
  social?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const defaultContact = {
  phone: '+965 2228 4398',
  website: 'https://servicespecmaker.com',
  social: {
    instagram: 'https://www.instagram.com/marketingcornerkw/',
    linkedin: 'https://www.linkedin.com/company/marketingcornerkw/?originalSubdomain=kw'
  }
};

export function ContactCompany({ 
  email,
  phone = defaultContact.phone,
  website = defaultContact.website,
  social = defaultContact.social
}: ContactCompanyProps) {
  const { ref, isVisible } = useRevealOnScroll();
  const { t, currentLanguage } = useI18n();
  
  // locale from i18n (must be the same on SSR & CSR)
  const loc = canonLang(currentLanguage);
  const phoneLabel = t('phone'); // Uses existing i18n key: { ar: 'الهاتف', en: 'Phone' }

  const socialLinks = [
    { 
      name: 'Instagram', 
      icon: Instagram, 
      url: social.instagram,
      color: 'hover:text-pink-600'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      url: social.linkedin,
      color: 'hover:text-blue-700'
    }
  ];

  return (
    <section 
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border border-border/50 p-8 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-foreground">{t('get_in_touch')}</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t('ready_to_start_project')}
          </p>
        </div>

        <div className="flex justify-center mb-8">
          {/* Phone */}
          {phone && (
            <section dir={loc === 'ar' ? 'rtl' : 'ltr'} lang={loc}>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center space-x-4 p-4 bg-background/50 rounded-xl border border-border/30
                         hover:bg-background/80 hover:border-primary/20 transition-all duration-300
                         focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-muted-foreground">{phoneLabel}</div>
                  {/* number MUST be LTR regardless of page dir */}
                  <div 
                    className="text-foreground font-medium digits-ltr notranslate"
                    dir="ltr"
                    lang="en"
                    aria-label={`${phoneLabel} ${phone}`}
                  >
                    <bdi>{phone}</bdi>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            </section>
          )}
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 md:gap-6">
          {socialLinks.map((social) => {
            if (!social.url) return null;
            
            const Icon = social.icon;
            
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
                className={`w-11 h-11 p-3 bg-background/50 rounded-lg border border-border/30
                          hover:bg-background/80 hover:border-primary/20 transition-all duration-300
                          focus:outline-none focus:ring-2 focus:ring-primary/20 ${social.color}`}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
