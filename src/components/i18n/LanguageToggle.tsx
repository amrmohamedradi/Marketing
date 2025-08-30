import React from 'react';
import { useI18n } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { currentLanguage, changeLanguage } = useI18n();

  const handleLanguageChange = (lang: string) => {
    // Update provider state
    changeLanguage(lang);
    
    // Write cookie (1 year expiry)
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `lang=${lang}; expires=${expires.toUTCString()}; path=/; ${window.location.protocol === 'https:' ? 'secure;' : ''}`;
    
    // Update URL query param
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-400" aria-hidden="true" />
      <div className="flex rounded-lg bg-white/10 p-1" role="group" aria-label="Language selection">
        <button
          onClick={() => handleLanguageChange('ar')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
            currentLanguage === 'ar'
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          aria-pressed={currentLanguage === 'ar'}
          type="button"
        >
          العربية
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/40 ${
            currentLanguage === 'en'
              ? 'bg-white/20 text-white shadow-sm'
              : 'text-gray-300 hover:text-white hover:bg-white/10'
          }`}
          aria-pressed={currentLanguage === 'en'}
          type="button"
        >
          English
        </button>
      </div>
    </div>
  );
}
